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
let PRINTFORMAT = new Map();
let WMSLAYERS = new Map();
let TMSLAYERS = new Map();
let FEATURETYPES = new Map();
let DESCRIBEFEATURETYPES = new Map();
let LEGENDGRAPHICURL = new Map();

// clear all caches every DELAY milliseconds
const DELAY = Meteor.call('getRequestCacheDelay');
Meteor.setInterval(function(){
  PRINTFORMAT.clear();
  WMSLAYERS.clear();
  TMSLAYERS.clear();
  FEATURETYPES.clear();
  DESCRIBEFEATURETYPES.clear();
  LEGENDGRAPHICURL.clear();
  console.log('Cleared WMS/WFS request caches');
}, DELAY);

Meteor.methods({
  /**
   * Get result from a server as image. 
   * host: url of host
   *   example:
   *   'http://acc-services.inspire-provincies.nl/ProtectedSites/services/view_PS' 
   * params : array of key/value pairs
   *   example:  
   *   {request: 'GetCapabilities', service:'WMS'} 
   */ 
  getImage : function (host){
    try {
      let res = HTTP.get(host, {headers:{
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
   * host: url of host
   *   example:
   *   'http://acc-services.inspire-provincies.nl/ProtectedSites/services/view_PS' 
   * params : array of key/value pairs
   *   example:  
   *   {request: 'GetCapabilities', service:'WMS'} 
   */ 
  getXml : function (host, params){
    host = Meteor.call('addQmarkToUrl', host);
    try {
      let res = HTTP.get(host, {'params' : params, 
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
   *  But the result will be cleaner and robust.  
   * 
   */
  parseXml : function(xml){
    if (xml){
      return xml2js.parseStringSync(xml, {explicitArray:true, stripPrefix: true});
    } else {
      return [];
    }
  },

  /**
   * Find if the layer with layerId is use in a map
   */
  isLayerInMap: function(layerId){
    let cursor = Maps.find();
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
   * Find if the service with serviceId is use in a layer
   */
  isServiceInLayer: function(serviceId){
    let cursor = Layers.find();
    let result = false;
    cursor.forEach(function(layer){
      _.each(layer.service_layers,function(serviceLayer){
        if (serviceLayer.service === serviceId){
          result = true;
        }
        if (serviceLayer.featureType){
          if (serviceLayer.featureType[0]){
            if (serviceLayer.featureType[0].service === serviceId){
              result = true;
            }
          }
        }
      });
    });
    return result;
  },
  
  /**
   * Get layers from a WMS
   */
  getWmsLayers: function(host, version){
    let sortedServoptions = [];
    let WMSLAYERSKEY = host + '-' + version;
    let resultWmsLayers = WMSLAYERS.get(WMSLAYERSKEY);
    if (resultWmsLayers){
      sortedServoptions = resultWmsLayers;
    } else {
      let xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
      if (xmlResponse.content){
        let parseResponse = Meteor.call('parseXml', xmlResponse.content);
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
      
        _.each(capLayer,function(mainLayer){
          let level = 0;
          if ((mainLayer.$) && (mainLayer.$.queryable === '1')){
            level = 2;
            if (mainLayer.Name){
              servoptions.push({value:mainLayer.Name[0], label:mainLayer.Title[0]});
            } else {
              servoptions.push({value:'', label:mainLayer.Title[0], disabled:true});
            }
          }
          // sub layer(s)
          servoptions = Meteor.call('getOptionsFromLayers', mainLayer, servoptions, level);
        });
        // do not sort
        sortedServoptions = servoptions;
        WMSLAYERS.set(WMSLAYERSKEY, sortedServoptions);
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
  
  getOptionsFromLayers: function(mainLayer, servoptions, level){
    let prefixChars = '______________..';
    if (level < 0) {level = 0;}
    if (level > prefixChars.length) {level = prefixChars.length;}
    let prefix = prefixChars.substr(0, level);
    if (mainLayer.Layer){
      _.each(mainLayer.Layer,function(subLayer){
        if ((subLayer.$) && (subLayer.$.queryable === '1')){
          if (subLayer.Title){
            const titleWithPrefix = (prefix + ' ' +  subLayer.Title[0]);
            if (subLayer.Name){
              servoptions.push({value:subLayer.Name[0], label:titleWithPrefix});
            } else {
              servoptions.push({value:'', label:titleWithPrefix, disabled:true});
            }
          }
        }
        servoptions = Meteor.call('getOptionsFromLayers', subLayer, servoptions, (level + 2));
      });
    }
    return servoptions;
  },
  /**
   * Get layers from a TMS
   */
  getTmsLayers: function(host, version){
    let servoptions = [];
    let TMSLAYERSKEY = host + '-' + version;
    let resultTmsLayers = TMSLAYERS.get(TMSLAYERSKEY);
    if (resultTmsLayers){
      servoptions = resultTmsLayers;
    } else {
      let xmlResponse = Meteor.call('getXml', host, {});
      if (xmlResponse.content){
        let parseResponse = Meteor.call('parseXml', xmlResponse.content);
        
        //version 1.0.0
        /**
         * get the title from the TileMap and use this as layername and title
         */
        let layername =  parseResponse.TileMap.Title;
        if (layername){
          servoptions.push({label:layername[0], value:layername[0]});
        } else {
          servoptions.push({label:'not found', value:'not found', disabled:true});
        }
        TMSLAYERS.set(TMSLAYERSKEY, servoptions);
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
   * Get feature types from a WFS
   */
  getWfsFeatureTypes: function(host, version){
    let sortedServoptions;
    let FEATURETYPESKEY = host + '-' + version;
    let resultFeatureTypes = FEATURETYPES.get(FEATURETYPESKEY);
    if (resultFeatureTypes){
      sortedServoptions = resultFeatureTypes;
    } else {
      let xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WFS', version: version});
      let parseResponse = Meteor.call('parseXml', xmlResponse.content);
      let servoptions = [];
  
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
          namePrefix = '';
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
      FEATURETYPES.set(FEATURETYPESKEY, sortedServoptions);
    }
    return sortedServoptions;
  },
  
  /**
   * DescribeFeatureType
   * Retrieve fields and namespace from a featuretype
   */
  describeFeatureType: function(serviceId, ftName){
    let ft = {options:[]}; 
    let DESCRIBEFEATURETYPESKEY = serviceId + '-' + ftName;
    let resultFeatureTypes = DESCRIBEFEATURETYPES.get(DESCRIBEFEATURETYPESKEY);
    if (resultFeatureTypes){
      ft = resultFeatureTypes;
    } else {
      let serv = Services.find({_id: serviceId}).fetch();
      if (serv[0]){
        let host = serv[0].endpoint;
        let version = serv[0].version;
        if (ftName){
          let xmlResponse = Meteor.call('getXml', host, {request: 'DescribeFeatureType', service:'WFS', version: version, typeName:ftName, typeNames:ftName});
          let parseResponse = Meteor.call('parseXml', xmlResponse.content);
          // find some common tag namespace prefixes
          let namePrefix = '';
          if (parseResponse['xsd:schema']){
            namePrefix = 'xsd:';
          } else if (parseResponse['xs:schema']){
            namePrefix = 'xs:';
          } else if (parseResponse['wfs:schema']){
            namePrefix = 'wfs:';
          } else {
            namePrefix = '';
          }
          _.each(parseResponse,function(schema){
            ft.targetNamespace = schema.$.targetNamespace;
            _.each(schema,function(nextTag){
              let complexType = null;
              if (nextTag[0]){
                // look for nextTag == element or complexType
                if (nextTag[0][namePrefix+'complexType']){
                    complexType = nextTag[0][namePrefix+'complexType'];
                } else if (nextTag[0][namePrefix+'complexContent']){
                        complexType = nextTag;
                }
              }
              if (complexType){
                if (complexType[0]){
                  if (complexType[0][namePrefix+'complexContent']){
                    _.each(complexType[0],function(complexContent){     
                      if (complexContent[0]){
                        if (complexContent[0][namePrefix+'extension']){
                          _.each(complexContent[0],function(extension){     
                            if (extension[0]){
                              if (extension[0][namePrefix+'sequence']){
                                _.each(extension[0],function(sequence){     
                                  if (sequence[0]){
                                    if (sequence[0][namePrefix+'element']){
                                      _.each(sequence[0][namePrefix+'element'],function(ftField){     
                                        ft.options.push({value:ftField.$.name, label:ftField.$.name});
                                      });
                                    }
                                  }
                                });
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                }
              }
            });
          });
          ft.options = _.sortBy(ft.options, 'title');
          DESCRIBEFEATURETYPES.set(DESCRIBEFEATURETYPESKEY, ft);
        }
      }
    }
    return ft;
  },
  
  /**
   * GetLegendGraphic from a WMS LAYER
   */
  getLegendGraphicUrl: function(serviceId, layer){
    let LEGENDGRAPHICURLKEY = serviceId + '-' + layer;
    let result = LEGENDGRAPHICURL.get(LEGENDGRAPHICURLKEY);
    if (!result){
      let serv = Services.find({_id: serviceId}).fetch();
      if (serv[0]){
        let host = serv[0].endpoint;
        let url = host;
        let version = serv[0].version;
        let xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
        let parseResponse = Meteor.call('parseXml', xmlResponse.content);
        
        let capKey = Object.keys(parseResponse);
        let wmsCapObject = parseResponse[capKey];
        if ((wmsCapObject) && (wmsCapObject.Capability)) {
          let capObject = wmsCapObject.Capability[0];      
          let layersObject = capObject.Layer;
          let capLayer = Meteor.call('getLayerByName',layersObject, layer);
          if ((capLayer) && (capLayer.Style)) {
  	        // Kies de default style of de laatste in de lijst als er geen default is
  	        let styleDefaultName = 'default';
  	        let styleDefaultFound = false;
            _.each(capLayer.Style,function(style){
              if (!styleDefaultFound){
      	    	  if ((style.LegendURL) && (style.LegendURL[0].OnlineResource[0])) {
      	    	    result = style.LegendURL[0].OnlineResource[0].$['xlink:href'];
      	    	  }
      	    	  if (style.Name[0] === styleDefaultName){
      	    	    styleDefaultFound = true;
      	    	  }
              }
            });
          }
          if (!result){
            /*
             *  there is no legendgraphic url in the layer itself, use the general one
             */ 
            let capRequest = capObject.Request;
            if (capRequest){
              let getLegendGraphic = capRequest[0].GetLegendGraphic;
              if (!getLegendGraphic){
                getLegendGraphic = capRequest[0]['sld:GetLegendGraphic'];
              }
              if (getLegendGraphic){
                let selectedFormat;
                let pngFormat, jpgFormat, gifFormat;
                let prefFormat = serv[0].printFormat;
                let formats = getLegendGraphic[0].Format; 
                _.each(formats,function(format){
                  if (format === prefFormat){
                    selectedFormat = format;            
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
                // select a preferred format (png, then jpg, then gif)
                if (!selectedFormat){
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
                /* looking for a base url (DCPType) of the GetLegendGraphic request has no use
                 * because in the capabilities it can be listed as 'http://localhost:8081/...'
                 */ 
                if (selectedFormat){
                  if (url.lastIndexOf('?') < 0){
                    url = url + '?';
                  }
                  url = url + 'request=GetLegendGraphic&service=WMS'
                    + '&layer=' + layer 
                    + '&format=' + selectedFormat
                    // tbv Mapserver:
                    // (wordt genegeerd door deegree en geoserver)
                    + '&version=' + version
                    + '&sld_version=1.1.0';          
                } else {
                  url = null;
                }
                result = url;
              }
            }
          }
        }
      }
      LEGENDGRAPHICURL.set(LEGENDGRAPHICURLKEY, result);
    }
    return result;
  },
  
  
  getLayerByName: function(layers, name){
    let result = null;
    for(let i = 0; i < layers.length; i++){
      if (layers[i].Layer) {
        result = Meteor.call('getLayerByName', layers[i].Layer, name);
      } else if(layers[i].Name) {
        if (layers[i].Name[0] === name ) {
          result =  layers[i];
        }	
      }
      if (result){ 
        break;
      }
    };
    return result;
  },
  
  
  /**
   * getPrintFormat from a WMS 
   */
  getPrintFormat: function(host, version){
    let sortedServoptions;
    let PRINTFORMATKEY = host + '-' + version;
    let resultPrintFormat = PRINTFORMAT.get(PRINTFORMATKEY);
    if (resultPrintFormat){
      sortedServoptions = resultPrintFormat;
    } else {
      let servoptions = [];
      let xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
      if (xmlResponse.content){
        let parseResponse = Meteor.call('parseXml', xmlResponse.content);
        
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
      }
      sortedServoptions = _.sortBy(servoptions, 'label');
      PRINTFORMAT.set(PRINTFORMATKEY, sortedServoptions);
    }
    return sortedServoptions;
  },
  
  
  /**
   * Get service from collection
   */
  getService: function(serviceId){
    let serv = Services.find({_id: serviceId}).fetch();
    return serv;
  },
  
  /**
   * remove '?' from service endpoint
   */
  removeQmarkFromUrl: function(url){
    let q = url.indexOf('?');
    if (q !== -1) {
      url = url.substr(0,q);
    }
    return url;
  },
  
  /**
   * add '?' to service endpoint
   */
  addQmarkToUrl: function(url){
    if (url.indexOf('?') === -1) {
      url += '?';
    }
    return url;
  }
  

});

