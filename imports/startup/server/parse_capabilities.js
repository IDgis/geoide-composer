/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { xml2js } from 'meteor/peerlibrary:xml2js';

import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

/**
 * All kinds of handy routines, mainly wms/wfs parsing.
 * 
 */

/*
 * Global variables used for caching WMS/WFS request results
 * 
 */
const PRINTFORMAT_CACHE = new Map();
const WMSLAYERS_CACHE = new Map();
const TMSLAYERS_CACHE = new Map();
const FEATURETYPES_CACHE = new Map();
const DESCRIBEFEATURETYPES_CACHE = new Map();
const LEGENDGRAPHICURL_CACHE = new Map();

// clear all caches every DELAY milliseconds
const DELAY = Meteor.call('getRequestCacheDelay');
Meteor.setInterval(function(){
  PRINTFORMAT_CACHE.clear();
  WMSLAYERS_CACHE.clear();
  TMSLAYERS_CACHE.clear();
  FEATURETYPES_CACHE.clear();
  DESCRIBEFEATURETYPES_CACHE.clear();
  LEGENDGRAPHICURL_CACHE.clear();
  console.log('Cleared WMS/WFS request caches');
}, DELAY);


let describeFeature = function(xml, ftName, ft) {
  if (xml['ows:ExceptionReport']) {
    console.log(`describeFeature ERROR xml`)
    console.log(xml['ows:ExceptionReport']['ows:Exception']);
  } else {

    // find some common tag namespace prefixes
    let namePrefix = '';
    if (xml['xsd:schema']){
      namePrefix = 'xsd:';
    } else if (xml['xs:schema']){
      namePrefix = 'xs:';
    } else if (xml['wfs:schema']){
      namePrefix = 'wfs:';
    } else {
      //
    }

    // Remove namespace prefix for searchName
    let searchName = ''
    if (ftName.indexOf(':') !== -1) {
      searchName = ftName.split(':')[1]
    } else {
      searchName = ftName;
    }

    _.each(xml,function(schema){
      ft.targetNamespace = schema.$.targetNamespace;
      _.each(schema,function(nextTag){
        let complexType = null;
        if (nextTag.length > 0) {
          _.each(nextTag,function(element){
            if (element.$ && element.$.name && element.$.name.indexOf(searchName) !== -1) {
              if (element[namePrefix+'complexType']) {
                complexType = element[namePrefix+'complexType'];
              } else if (element[namePrefix+'complexContent']){
                complexType = nextTag;
              } else {
              // nothing to do
              }
            }
          });
        }
        if ( (complexType) && (complexType[0]) && (complexType[0][namePrefix+'complexContent'])){
          _.each(complexType[0],function(complexContent){   
            if ((complexContent[0]) && (complexContent[0][namePrefix+'extension'])){
              _.each(complexContent[0],function(extension){     
                if ((extension[0]) && (extension[0][namePrefix+'sequence'])){
                  _.each(extension[0],function(sequence){     
                    if ((sequence[0]) && (sequence[0][namePrefix+'element'])){
                      _.each(sequence[0][namePrefix+'element'],function(ftField){     
                        ft.options.push({value:ftField.$.name, label:ftField.$.name});
                        //console.log(ft.options)
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }
}

Meteor.methods({
  /**
   * Get image from a url. 
   * host: url of host
   * 
   * @param {string} url that will result in an image
   * @return {object} image in jpg, png or gif format.
   */ 
  getImage : function (host){
    try {
      const res = HTTP.get(host, {headers:{
          'User-Agent': 'Meteor/1.3',
//          'Accept-Language': 'en-US,en;q=0.7,nl;q=0.3',
//          'Accept-Encoding': 'gzip, deflate',
          'Accept': 'image/gif,image/jpeg,image/png;q=0.9,*/*;q=0.8'
        }
      });
      return res;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      // return the error as a valid result, to be analyzed at client side
      return e;
    }
  },
  /**
   * Get result from a server as xml.
   *  
   * @param {string} host url of the server
   * @param {array} params array of key/value pairs
   *   example:  
   *   {request: 'GetCapabilities', service:'WMS'}
   * @return {string} xml as returned by the server
   *     or  {object} error that was thrown
   */ 
  getXml : function (host, params){
    host = Meteor.call('addQmarkToUrl', host);
    try {
      const res = HTTP.get(host, {'params' : params, 
        headers:{
          'User-Agent': 'Meteor/1.3',
//          'Accept-Language': 'en-US,en;q=0.7,nl;q=0.3',
//          'Accept-Encoding': 'gzip, deflate',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      return res;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      // return the error as a valid result, to be analyzed at client side
      return e;
    }
  },
  /**
   * Parse xml and return a javascript object representing the xml content. 
   * Using package peerlibrary:xml2js (xml2js is available on server side only)
   * 'explicitArray:true' : parsing code can behave the same whether
   * an object contains one or more subobjects of some kind. 
   * 'stripPrefix: true' : strip prefixes (except xmlns)
   * 
   * Note:
   *  There is one option (xmlns=true) that saves the tagname 
   *  without prefix in the js object. 
   *  This means code restructuring.
   *  But the result will be cleaner and more robust.  
   * 
   * @param {string} xml that will be parsed into a Javascript object
   * @return {object} Javascript object which members will reflect content of xml
   */
  parseXml : function(xml){
    if (xml){
      return xml2js.parseStringSync(xml, {explicitArray:true, stripPrefix: true});
    } else {
      return {};
    }
  },

  /**
   * Find if the layer with layerId is use in a map.
   * 
   * @param {number} layerId mongo database id of the layer
   * @return {boolean} true if this layer is used in any map, false otherwise 
   */
  isLayerInMap: function(layerId){
    const cursor = Maps.find();
    let result = false;
    cursor.forEach(function(map){
      _.each(map.children,function(child){
        if ((child.data ) && (child.data.layerid === layerId)){
          result = true;
        }
        _.each(child.children,function(child1){
          if ((child1.data) && (child1.data.layerid === layerId)){
            result = true;
          }
          _.each(child1.children,function(child2){
            if ((child2.data) && (child2.data.layerid === layerId)){
              result = true;
            }
            _.each(child2.children,function(child3){
              if ((child3.data) && (child3.data.layerid === layerId)){
                result = true;
              }
            });
          });
        });
      });
    });
    return result;
  },

  /**
   * Find if the service with serviceId is use in a layer.
   * 
   * @param {number} serviceId mongo database id of the service
   * @return {boolean} true if this service is used in any layer, false otherwise 
   */
  isServiceInLayer: function(serviceId){
    let result = false;
    const cursor = Layers.find();
    cursor.forEach(function(layer){
      _.each(layer.service_layers,function(serviceLayer){
        if (serviceLayer.service === serviceId){
          result = true;
        }
        if (serviceLayer.featureType && serviceLayer.featureType[0]){
          if (serviceLayer.featureType[0].service === serviceId){
            result = true;
          }
        }
      });
    });
    return result;
  },
  
  /**
   * Get layers from a WMS as a listbox options list.
   * Checks if a list of layers already exist in cache.
   * If not it tries to retrieve it from the WMS.
   * 
   * @param {string} host url of the WMS service
   * @param {string} version of the service
   * @return {object} sorted list of name, label pairs of all WMS layers found; 
   *   array [value, label, [disabled]]
   *   The label reflects the hierarchy of the WMS layers
   *      example: [{value: 'layerName', label: 'layerTitle'}, {...},...] 
   *   This result can be used in a listbox.
   *   Layers that have no name (only title) will be flagged as disabled
   */
  getWmsLayers: function(host, version){
    let sortedServoptions = [];
    const WMSLAYERSKEY = host + '-' + version;
    const resultWmsLayers = WMSLAYERS_CACHE.get(WMSLAYERSKEY);
    if (resultWmsLayers && resultWmsLayers.length > 0){
      sortedServoptions = resultWmsLayers;
    } else {
      const xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
      if (xmlResponse.content){
        const parseResponse = Meteor.call('parseXml', xmlResponse.content);
        let servoptions = [];
        let capLayer;
        switch(version) {
        case '1.3.0':
          // version 1.3.0
          // main layer
          capLayer= parseResponse.WMS_Capabilities.Capability[0].Layer;
          break;
        case '1.1.1':
        default:
          // version 1.1.1
          // main layer
          capLayer= parseResponse.WMT_MS_Capabilities.Capability[0].Layer;
          break;
        }
        _.each(capLayer, function(mainLayer){
          let level = 2;
          if (mainLayer.Name && mainLayer.Title){
            servoptions.push({value:mainLayer.Name[0], label:mainLayer.Title[0]});
          } else if (mainLayer.Title) {
            servoptions.push({value:'', label:mainLayer.Title[0], disabled:true});
          } else if (mainLayer.Name) {
            servoptions.push({value:mainLayer.Name[0], label:mainLayer.Name[0]});
          } else {
            servoptions.push({value:'', label:'', disabled:true});
          }
            // sub layer(s)
          servoptions = Meteor.call('getOptionsFromLayers', mainLayer, servoptions, level);
        });
        // do not sort
        sortedServoptions = servoptions;
        WMSLAYERS_CACHE.set(WMSLAYERSKEY, sortedServoptions);
      } else {
        console.log('getWmsLayers ERROR xmlResponse:', xmlResponse);
        let errorMsg = xmlResponse.statusCode;
        if (!errorMsg){
          if (xmlResponse.response){
            errorMsg = xmlResponse.response.statusCode;
          } else {
            errorMsg = xmlResponse.code;
          }
        }
        sortedServoptions.push({value:WMSLAYERSKEY, label:'[Error: '+errorMsg+']', disabled:true});
      }
    }
    return sortedServoptions;
  
  },
  
  /**
   * Search a hierarchy of layers and put their name and title 
   * into value, label pairs for use in a listbox.
   * 
   * @private
   * @param {object} mainLayer layer object
   * @param {object} servoptions listbox options to append to
   * @param {number} level current level of mainLayer 
   * @return {object} sorted list of value, label pairs of all WMS layers found; 
   *   The label will be prefixed to show hierarchy of the WMS layers:
   *      _main-layer
   *      ___level-1a-layer
   *      ___level-1b-layer
   *      ______level-2-layer
   *   Layers that have no name (only title) will be flagged as disabled
   */
  getOptionsFromLayers: function(mainLayer, servoptions, level){
    const prefixChars = '______________..';
    if (level < 0) {
      level = 0;
    }
    if (level > prefixChars.length) {
      level = prefixChars.length;
    }
    const prefix = prefixChars.substr(0, level);
    if (mainLayer.Layer){
      _.each(mainLayer.Layer,function(subLayer){
        if ((subLayer) && (subLayer.Title)){
          const titleWithPrefix = (prefix + ' ' +  subLayer.Title[0]);
          if (subLayer.Name){
            servoptions.push({value:subLayer.Name[0], label:titleWithPrefix});
          } else {
            servoptions.push({value:'', label:titleWithPrefix, disabled:true});
          }
        }
        servoptions = Meteor.call('getOptionsFromLayers', subLayer, servoptions, (level + 2));
      });
    }
    return servoptions;
  },
  
  /**
   * Get layers from a TMS as a listbox options list.
   * Checks if a list of layers already exist in cache.
   * If not it tries to retrieve it from the TMS.
   * 
   * @param {string} host url of the TMS service
   * @param {string} version of the TMS service
   * @return {object} sorted list of names of all TMS layers found; 
   *   array [value, label, [disabled]]
   *      example: [{value: 'layerName', label: 'layerName'}, {...},...] 
   *   This result can be used in a listbox.
   *   When no layername can be found the listbox entry is flagged as disabled.
   *   When an error occurs, the error value is put in the label of the options list.
   *   
   * NB this implementation delivers only one layerName.
   * This layerName is retrieved from the title of the TileMap tag. 
   */
  getTmsLayers: function(host, version){
    let servoptions = [];
    const TMSLAYERSKEY = host + '-' + version;
    const resultTmsLayers = TMSLAYERS_CACHE.get(TMSLAYERSKEY);
    if (resultTmsLayers){
      servoptions = resultTmsLayers;
    } else {
      const xmlResponse = Meteor.call('getXml', host, {});
      if (xmlResponse.content){
        const parseResponse = Meteor.call('parseXml', xmlResponse.content);
        //version 1.0.0
        /**
         * get the title from the TileMap and use this as layername and title
         */
        let layername = null;
        if (parseResponse.TileMap) {
        	layername =  (parseResponse.TileMap.Title ? parseResponse.TileMap.Title : 
        						(parseResponse.TileMap.title ? parseResponse.TileMap.title : null));
        }	
        if (layername){
          servoptions.push({label:layername[0], value:layername[0]});
        } else {
          servoptions.push({label:'not found', value:'not found', disabled:true});
        }
        TMSLAYERS_CACHE.set(TMSLAYERSKEY, servoptions);
      } else {
        console.log('getTmsLayers ERROR xmlResponse:', xmlResponse);
        let errorMsg = xmlResponse.statusCode;
        if (!errorMsg){
          errorMsg = xmlResponse.response.statusCode;
        }
        servoptions.push({value:TMSLAYERSKEY, label:'[Error: '+errorMsg+']', disabled:true});
      }
    }

    return servoptions;
  },
  
  /**
   * Get featuretypes from a WFS as a listbox options list.
   * Checks if a list of featuretypes already exists in cache.
   * If not it tries to retrieve it from the WFS.
   * 
   * @param {string} host url of the WFS service
   * @param {string} version of the WFS service
   * @return {object} sorted list of value, label pairs of all WFS featuretypes  found; 
   *   array [value, label]
   *   The label reflects the hierarchy of the WMS layers
   *      example: [{value: 'feature type name', label: 'feature type title'}, {...},...] 
   *   
   *   This result can be used in a listbox.
   *   
   * NB The parseXml function delivers prefixes as part of the tag names.
   * Therefore an attempt is made to find a common tag prefix.   
   */
  getWfsFeatureTypes: function(host, version){
    let sortedServoptions;
    const FEATURETYPESKEY = host + '-' + version;
    const resultFeatureTypes = FEATURETYPES_CACHE.get(FEATURETYPESKEY);
    if (resultFeatureTypes){
      sortedServoptions = resultFeatureTypes;
    } else {
      const xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WFS', version: version});
      const parseResponse = Meteor.call('parseXml', xmlResponse.content);
      const servoptions = [];
  
      // version:  1.0.0, 1.1.0, 2.0.0
      // using this 'each' construction instead of 'parseResponse.WFS_Capabilities' makes it prefix unaware
      _.each(parseResponse,function(WFS_Capabilities){
        // But the following tag FeatureTypeList can have the same or no prefix
        // find some common tag namespace prefixes
        let namePrefix = '';
        if (WFS_Capabilities['xsd:FeatureTypeList']){
          namePrefix = 'xsd:';
        } else if (WFS_Capabilities['xs:FeatureTypeList']){
          namePrefix = 'xs:';
        } else if (WFS_Capabilities['wfs:FeatureTypeList']){
          namePrefix = 'wfs:';
        } else {
          //
        }
        
        _.each(WFS_Capabilities[namePrefix+'FeatureTypeList'][0],function(ftList){
          _.each(ftList,function(ft){
            if (ft[namePrefix+'Name']){
              if (ft[namePrefix+'Name'][0]._){
                servoptions.push({value:ft[namePrefix+'Name'][0]._, label:ft[namePrefix+'Title'][0]});
              } else {
                servoptions.push({value:ft[namePrefix+'Name'][0], label:ft[namePrefix+'Title'][0]});
              }
            }
          });
        });
      });
      sortedServoptions = _.sortBy(servoptions, 'title');
      FEATURETYPES_CACHE.set(FEATURETYPESKEY, sortedServoptions);
    }
    return sortedServoptions;
  },
  
  /**
   * Retrieve fields and namespace from a featuretype.
   * Uses DescribeFeaturetype request on a WFS.
   * Checks if a list of featuretype fields already exists in cache.
   * If not it tries to retrieve it from the WFS.
   * 
   * @param {number} serviceId mongo database id of the service
   * @param [string] ftName naem of the featuretype
   * @result [object] 
   * @return {object} object {options:[], nameSpace} 
   *   options contains a sorted list of value, label pairs of all featuretype fields found;
   *      example: options:[{value: 'featuretype field name', label: 'featuretype field name'}, {...},...] 
   *      This part can be used in a listbox.
   *   nameSpace contains the namespace of the featuretype. 
   * 
   * NB The parseXml function delivers prefixes as part of the tag names.
   * Therefore an attempt is made to find a common tag prefix.   
   */
  describeFeatureType: function(serviceId, ftName){
    let ft = {options:[]}; 
    const DESCRIBEFEATURETYPESKEY = serviceId + '-' + ftName;
    const resultFeatureTypes = DESCRIBEFEATURETYPES_CACHE.get(DESCRIBEFEATURETYPESKEY);
    if (resultFeatureTypes){
      ft = resultFeatureTypes;
    } else {
      const serv = Services.find({_id: serviceId}).fetch();
      if (serv[0]){
        const host = serv[0].endpoint;
        const version = serv[0].version;
        const xmlResponse = Meteor.call('getXml', host, {request: 'DescribeFeatureType', service:'WFS', version: version, typeName:ftName, typeNames:ftName});
        if (xmlResponse.content) {
          const parseResponse = Meteor.call('parseXml', xmlResponse.content);
          if (Object.keys(parseResponse).length > 0) {
            describeFeature(parseResponse, ftName, ft) // find the feature in the resulting xml

            ft.options = _.sortBy(ft.options, 'title');
            DESCRIBEFEATURETYPES_CACHE.set(DESCRIBEFEATURETYPESKEY, ft);
          } else {
            console.log(`DescribeFeatureType ERROR parseResponse`);
            console.log(`Couldn't parse DescribeFeatureType response`);
            console.log(`host: '${host}', request: 'DescribeFeatureType', service: 'WFS', version: '${version}', typeName: '${ftName}', typeNames: '${ftName}'`);
            // console.log(xmlResponse.content)
          }
        } else {
          console.log('DescribeFeatureType ERROR xmlResponse');
          console.log(`Error in DescribeFeatureType request`);
          console.log(`host: '${host}', request: 'DescribeFeatureType', service: 'WFS', version: '${version}', typeName: '${ftName}', typeNames: '${ftName}'`);
        }
        
      }
    }
    return ft;
  },
  
  /**
   * Get a legendGraphic url of a WMS layer.
   * Checks if a url already exists in cache.
   * If not it tries to retrieve the url, belonging to the given layer, from the WMS capabilities.
   * If no specific layer url is found, a general url is assembled using the specification 
   * of the GetLegendGraphic request. 
   * The url found is saved in cache.
   * 
   * @param {number} serviceId The database id of the service
   * @param {string} layerName The name of the layer
   * @return {string} url that results in a legendgraphic image for the layer. 
   *         Can be undefined if no url was found in the service capabilities.
   */
  getLegendGraphicUrl: function(serviceId, layerName){
    const LEGENDGRAPHICURLKEY = serviceId + '-' + layerName;
    let result = LEGENDGRAPHICURL_CACHE.get(LEGENDGRAPHICURLKEY);
    if (!result){
      result = Meteor.call('findLegendGraphicUrl', serviceId, layerName);
      LEGENDGRAPHICURL_CACHE.set(LEGENDGRAPHICURLKEY, result);
    }
    return result;
  },
  
  /**
   * Get a legendGraphic url of a WMS layer
   * It first tries to retrieve the url defined within the layer itself.
   * If no specific layer url is found, a general url is assembled using the specification 
   * of the GetLegendGraphic request.
   * 
   * @private
   * @param {number} serviceId The database id of the service
   * @param {string} layerName The name of the layer
   * @return {string} url that results in a legendgraphic image for the layer. 
   *         Can be undefined if no url was found in the service capabilities.
   */
  findLegendGraphicUrl: function(serviceId, layerName){
    let lgUrl;
    const serv = Services.find({_id: serviceId}).fetch();
    if (serv[0]){
      const host = serv[0].endpoint;
      const version = serv[0].version;
      const xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
      const parseResponse = Meteor.call('parseXml', xmlResponse.content);
      const capKey = Object.keys(parseResponse);
      const wmsCapObject = parseResponse[capKey];
      if ((wmsCapObject) && (wmsCapObject.Capability)) {
        const capObject = wmsCapObject.Capability[0];
        const layer = capObject.Layer;
        const capLayer = Meteor.call('getLayerByName',layer, layerName);
        if ((capLayer) && (capLayer.Style)) {
          // Kies de default style of de laatste in de lijst als er geen default is
          const styleDefaultName = 'default';
          let styleDefaultFound = false;
          _.each(capLayer.Style,function(style){
            if (!styleDefaultFound){
              if ((style.LegendURL) && (style.LegendURL[0].OnlineResource[0])) {
                lgUrl = style.LegendURL[0].OnlineResource[0].$['xlink:href'];
                if (lgUrl.startsWith("http:") && host.startsWith("https:")) {
                  lgUrl = lgUrl.replace("http:", "https:");
                }
              }
              if (style.Name[0] === styleDefaultName){
                styleDefaultFound = true;
              }
            }
          });
        }
        if (!lgUrl){
          /*
           *  there is no legendgraphic url in the layer itself, find the general url
           */
          let getLegendGraphic = capObject.Request[0].GetLegendGraphic;
          if (!getLegendGraphic){
            // not defined, try again with the following tag name
            getLegendGraphic = capObject.Request[0]['sld:GetLegendGraphic'];
          }
          if (getLegendGraphic && getLegendGraphic[0].Format){
            lgUrl = Meteor.call('findGenericLegendGraphicUrl', serv[0], layerName, getLegendGraphic[0].Format);
          }
        }
      }
    } else {
      // no service found, lgUrl is undefined
    }
    return lgUrl;
  },

  /**
   * Retrieve a Layer from WMS Capabilities with a given name.
   * Tries to find a layer with a given name,
   * by searching recursively in the hierarchy of layers.
   * 
   * @private
   * @param {object} layer array containing  Layer objects, each with possible sub layers
   * @param {string} layerName name of the Layer to be found
   * @return {object} Layer object having the given name
   *         returns 'undefined' when no layer with the given name was found
   *         Contains all layer tags like Name, Title, Style, etc
   */
  getLayerByName: function(layer, layerName){
    let result;
    for(let i = 0; i < layer.length; i++){
      if (layer[i].Layer) {
        result = Meteor.call('getLayerByName', layer[i].Layer, layerName);
      } else if(layer[i].Name) {
        if (layer[i].Name[0] === layerName ) {
          result =  layer[i];
        } 
      } else {
        // nothing to do
      }
      // stop as soon as a matching layer is found
      if (result){ 
        break;
      }
    }
    return result;
  },
  

  /**
   * Get a legendGraphic url for a WMS layer
   * A general url is assembled, from the service host url,  
   * layername and preferred image format.
   * 
   * @private
   * @param {object} service service Object
   * @param {string} layerName name of the layer
   * @param {object} lgFormats array of GetLegendGraphic.Format tags from the GetCapabilities xml
   * @return {string} url that results in a legendgraphic image for the layer. 
   *         Can be undefined if no url was found in the service capabilities.
   */
  findGenericLegendGraphicUrl: function(service, layerName, lgFormats){
    let url;
    let selectedFormat;
    let pngFormat, jpgFormat, gifFormat;
    const preferredPrintFormat = service.printFormat;
    // loop over all formats to find a preferred format
    _.each(lgFormats,function(format){
      if (format === preferredPrintFormat){
        selectedFormat = preferredPrintFormat;
      } 
      if (format === 'image/png'){
        pngFormat = format;            
      } 
      if (format === 'image/jpg' || format === 'image/jpeg'){
        jpgFormat = format;
      }
      if (format === 'image/gif'){
        gifFormat = format;
      }
    });
    if (!selectedFormat){
      // select a preferred format (png, then jpg, then gif)
      if (pngFormat){
        selectedFormat = pngFormat;
      } else if (jpgFormat){
        selectedFormat = jpgFormat;
      } else if (gifFormat){
        selectedFormat = gifFormat;
      } else {
        // no preferable formats found: selectedFormat = undefined
      }
    }
    /* looking for a base url (DCPType) of the GetLegendGraphic request is not foolproof 
     * because in the capabilities it could be listed as e.g. 'http://localhost:8081/...', 
     * or could end in e.g. '?service=WMS&' instead of in '?'.
     * Instead use the service endpoint as base url for the request.
     */ 
    if (selectedFormat){
      url = service.endpoint;
      if (url.lastIndexOf('?') < 0){
        url = url + '?';
      }
      url = url + 'request=GetLegendGraphic&service=WMS'
        + '&layer=' + layerName 
        + '&format=' + selectedFormat
        // tbv Mapserver:
        // (wordt genegeerd door deegree en geoserver)
        + '&version=' + service.version
        + '&sld_version=1.1.0';          
    } else {
      // selectedFormat is undefined, leave url undefined
    }
    return url;
  },

  
  
  /**
   * getPrintFormat from a WMS
   * Finds a list of WMS GetMap Formats.
   *  
   * @param {string} host url of the WMS service
   * @param {string} version of the WMFS service
   * @return {object} sorted list of value, label pairs containing WMS GetMap Formats; 
   *   array [value, label]
   *      example: [{value: 'format', label: 'format'}, {...},...] 
   *   This result can be used in a listbox.
   */
  getPrintFormat: function(host, version){
    let sortedServoptions;
    const PRINTFORMATKEY = host + '-' + version;
    const resultPrintFormat = PRINTFORMAT_CACHE.get(PRINTFORMATKEY);
    if (resultPrintFormat){
      sortedServoptions = resultPrintFormat;
    } else {
      const servoptions = [];
      const xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
      const parseResponse = Meteor.call('parseXml', xmlResponse.content);
      let req = null;
      switch(version) {
      case '1.3.0':
        if ((parseResponse.WMS_Capabilities) && (parseResponse.WMS_Capabilities.Capability[0])){
          req = parseResponse.WMS_Capabilities.Capability[0].Request;
        }
        break;
      case '1.1.1':
        if ((parseResponse.WMT_MS_Capabilities) && (parseResponse.WMT_MS_Capabilities.Capability[0])){
          req = parseResponse.WMT_MS_Capabilities.Capability[0].Request;
        }
        break;
      default:
        break;
      }
      if ((req) && (req[0].GetMap)){
        _.each(req[0].GetMap[0].Format,function(format){
          servoptions.push({label:format, value:format});
        });
      }
      sortedServoptions = _.sortBy(servoptions, 'label');
      PRINTFORMAT_CACHE.set(PRINTFORMATKEY, sortedServoptions);
    }
    return sortedServoptions;
  },
  
  
  /**
   * Get service from collection
   * 
   * @param {number} serviceId mongo database id of the service
   * @result [object] service object, undefined if none found
   */
  getService: function(serviceId){
    const serv = Services.find({_id: serviceId}).fetch();
    return serv;
  },
  
  /**
   * Remove trailing '?' from service endpoint
   * Note: 
   *  Not only the '?' will be removed if found, 
   *  but every character after it as well.
   *  This function looks for the first occurrence of '?',
   *  reading from left to right. 
   *  No attempt is being made to check for a valid url.
   * 
   * @param [string] url of service endpoint 
   * @result [string] url of service endpoint with '?' removed
   * 
   */
  removeQmarkFromUrl: function(url){
    const q = url.indexOf('?');
    if (q !== -1) {
      url = url.substr(0,q);
    }
    return url;
  },
  
  /**
   * Add '?' to service endpoint
   * Note: 
   *  if no '?' is found in the endpoint string,
   *  a '?' will be pasted at the end of the string.
   *  No attempt is being made to check for a valid url.
   * 
   * @param [string] url of service endpoint 
   * @result [string] url of service endpoint with '?' as last character
   * 
   */
  addQmarkToUrl: function(url){
    if (url.indexOf('?') === -1) {
      url += '?';
    }
    return url;
  }
  

});
