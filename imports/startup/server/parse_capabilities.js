import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { xml2js } from 'meteor/peerlibrary:xml2js';

import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

/**
 * All kinds of handy routines, mainly wms/wfs parsing.
 * TODO: Could be split in several utility files.  
 * 
 */

/*
 * Global variables used for caching WMS/WFS request results
 * 
 */

PRINTFORMAT = new Map();

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
    console.log('getImage() host: ', host);
    try {
      var res = HTTP.get(host, {headers:{
          'User-Agent': 'Meteor/1.3',
//          'Accept-Language': 'en-US,en;q=0.7,nl;q=0.3',
//          'Accept-Encoding': 'gzip, deflate',
          'Accept': 'image/gif,image/jpeg,image/png;q=0.9,*/*;q=0.8'
        }
      });
      return res;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      return e; // return the error as a valid result, to be analyzed at client side
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
    host = Meteor.call("addQmarkToUrl", host);
    console.log('getXml() host: ', host + ', params: ' + params);
    try {
      var res = HTTP.get(host, {'params' : params, 
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
      return e; // return the error as a valid result, to be analyzed at client side
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
    return xml2js.parseStringSync(xml, {explicitArray:true, stripPrefix: true});
  },

  /**
   * Find if the layer with layerId is use in a map
   */
  isLayerInMap: function(layerId){
    var cursor = Maps.find();
    var result = false;
    cursor.forEach(function(map){
//      console.log('map', map.text);
      _.each(map.children,function(child){
        if (child.data){
//          console.log('  child.data.layerid', child.data.layerid);
          if (child.data.layerid){
            if (child.data.layerid == layerId){
              result = true;
            }
          }
        }
        _.each(child.children,function(child1){
          if (child1.data){
//            console.log('    child1.data.layerid', child1.data.layerid);
            if (child1.data.layerid){
              if (child1.data.layerid == layerId){
                result = true;
              }
            }
          }
          _.each(child1.children,function(child2){
            if (child2.data){
//              console.log('      child2.data.layerid', child2.data.layerid);
              if (child2.data.layerid){
                if (child2.data.layerid == layerId){
                  result = true;
                }
              }
            }
            _.each(child2.children,function(child3){
              if (child3.data){
//                console.log('        child3.data.layerid', child3.data.layerid);
                if (child3.data.layerid){
                  if (child3.data.layerid == layerId){
                    result = true;
                  }
                }
              }
            });
          });
        });
      });
    });
//    console.log('isLayerInMap ' + layerId + ": " + result);
    return result;
  },

  /**
   * Find if the service with serviceId is use in a layer
   */
  isServiceInLayer: function(serviceId){
    var cursor = Layers.find();
    var result = false;
    cursor.forEach(function(layer){
//      console.log('layer', layer.name);
      _.each(layer.service_layers,function(serviceLayer){
//        console.log('  serviceLayer.service', serviceLayer.service);
        if (serviceLayer.service == serviceId){
          result = true;
        }
        if (serviceLayer.featureType){
          if (serviceLayer.featureType[0]){
//            console.log('    serviceLayer.featureType.service', serviceLayer.featureType[0].service);
            if (serviceLayer.featureType[0].service == serviceId){
              result = true;
            }
          }
        }
      });
    });
//    console.log('isServiceInLayer ' + serviceId + ": " + result);
    return result;
  },
  
  /**
   * Get layers from a WMS
   */
  getWmsLayers: function(host, version){
    console.log('getWmsLayers host: ' + host + ', version: ' + version);
    var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
//    console.log('getServiceLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
    var servoptions = [];

//    console.log('------- Capability -------');
    switch(version) {
    case '1.3.0':
      // version 1.3.0
//      console.log('------- WMS Capability main -------', parseResponse.WMS_Capabilities.Capability);
      // main layer
      var capLayer= parseResponse.WMS_Capabilities.Capability[0].Layer;
      break;
    case '1.1.1':
    default:
      // version 1.1.1
//      console.log('------- WMS Capability main -------', parseResponse.WMT_MS_Capabilities.Capability);
      // main layer
      var capLayer= parseResponse.WMT_MS_Capabilities.Capability[0].Layer;
      break;
    }
  
//    console.log('******* main Layers *******');
    _.each(capLayer,function(mainLayer){
//      console.log(mainLayer);
      if (mainLayer.$){
        if (mainLayer.$.queryable){
          if (mainLayer.$.queryable == '1'){
            servoptions.push({name:mainLayer.Name[0], title:mainLayer.Title[0]});
          }
        }
      }
//      console.log('**************************');
      // sub layer(s)
      if (mainLayer.Layer){
//        console.log('...... sub Layers .........');
        _.each(mainLayer.Layer,function(subLayer){
//          console.log(subLayer);
          if (subLayer.$){
            if (subLayer.$.queryable){
              if (subLayer.$.queryable == '1'){
                servoptions.push({name:subLayer.Name[0], title:subLayer.Title[0]});
              }
            }
          }
//          console.log('..........................');
        });
      }
    });
    var sortedServoptions = _.sortBy(servoptions, 'title');
    console.log('WMS Layers found: ',sortedServoptions);
    return sortedServoptions;
  },
  
  /**
   * Get layers from a TMS
   */
  getTmsLayers: function(host, version){
    console.log('getTmsLayers host: ' + host + ', version: ' + version);
    var xmlResponse = Meteor.call('getXml', host, {});
//    console.log('getTmsLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
//    console.log('getTmsLayers parseResponse:', parseResponse);
//    console.log('getTmsLayers TileSets:', parseResponse.TileMap.TileSets[0]);
 
    // version 1.0.0
    /**
     * get the first tileset and extract the layername from the href url
     */
    var tmsLayer = parseResponse.TileMap.TileSets[0].TileSet[0];
    var href = tmsLayer.$.href;
    var first = href.indexOf('1.0.0/') + 6;
    var last = href.indexOf('@');
    if (!last){
      last = href.lastIndexOf('/');
    }
    // the layername is between the tms version and the last '/'or the first '@'
    var layername = href.slice(first, last);
    var servoptions = [];
    servoptions.push({name:layername, title:layername});
    console.log('TMS Layers found: ',servoptions);
    return servoptions;
  },
  
  /**
   * Get feature types from a WFS
   */
  getWfsFeatureTypes: function(host, version){
    console.log('getWfsFeatureTypes host: ' + host + ', version: ' + version);
    var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WFS', version: version});
//    console.log('getWfsFeatureTypes xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
//    console.log('getWfsFeatureTypes parseResponse:', parseResponse);
//    console.log('------- WFS Capability -------', parseResponse);
//    console.log('------- WFS Capability main -------', parseResponse.WFS_Capabilities);
//    console.log('--------------------------');

    var servoptions = [];

    // version:  1.0.0, 1.1.0, 2.0.0
    // using this 'each' construction instead of 'parseResponse.WFS_Capabilities' makes it prefix unaware
    _.each(parseResponse,function(WFS_Capabilities){
      // But the following tag FeatureTypeList can have the same or no prefix
      // find some common tag namespace prefixes
      var namePrefix = '';
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
//          console.log(ft);
          if (ft[namePrefix+'Name']){
            if (ft[namePrefix+'Name'][0]._){
              servoptions.push({name:ft[namePrefix+'Name'][0]._, title:ft[namePrefix+'Title'][0]});
            } else {
              servoptions.push({name:ft[namePrefix+'Name'][0], title:ft[namePrefix+'Title'][0]});
            }
          }
        });
      });
    });
    var sortedServoptions = _.sortBy(servoptions, 'title');
    console.log('WFS FeatureTypes found: ',sortedServoptions);
    return sortedServoptions;
  },
  
  /**
   * DescribeFeatureType
   * Retrieve fields and namespace from a featuretype
   */
  describeFeatureType: function(serviceId, ftName){
    var ft = {options:[]}; 
    console.log('describeFeatureType serviceId: ', serviceId );
    console.log('FeatureType name:', ftName);
    var serv = Services.find({_id: serviceId}).fetch();
    console.log('service found: ',serv);
    if (serv[0]){
      var host = serv[0].endpoint;
      var version = serv[0].version;
      var xmlResponse = Meteor.call('getXml', host, {request: 'DescribeFeatureType', service:'WFS', version: version, typeName:ftName, typeNames:ftName});
  //  console.log('getWfsDescribeFeatureTypes xmlResponse:', xmlResponse.content);
      var parseResponse = Meteor.call('parseXml', xmlResponse.content);
      // find some common tag namespace prefixes
      var namePrefix = '';
      if (parseResponse['xsd:schema']){
        namePrefix = 'xsd:';
      } else if (parseResponse['xs:schema']){
        namePrefix = 'xs:';
      } else if (parseResponse['wfs:schema']){
        namePrefix = 'wfs:';
      } else {
        namePrefix = '';
      }
//      console.log('------- WFS DescribeFeatureType -------', namePrefix);
      _.each(parseResponse,function(schema){
//        console.log('schema', schema);
        ft.targetNamespace = schema.$.targetNamespace;
        _.each(schema,function(nextTag){
//          console.log('nextTag', nextTag);
          var complexType = null;
          if (nextTag[0]){
            // look for nextTag == element or complexType
            if (nextTag[0][namePrefix+'complexType']){
  //            element.complexType.complexContent.extension.sequence.element 
                complexType = nextTag[0][namePrefix+'complexType'];
            } else if (nextTag[0][namePrefix+'complexContent']){
  //            complexType.complexContent.extension.sequence.element 
                    complexType = nextTag;
            }
          }
          if (complexType){
//            console.log('complexType', complexType); 
            if (complexType[0]){
              if (complexType[0][namePrefix+'complexContent']){
                _.each(complexType[0],function(complexContent){     
//                  console.log('complexContent', complexContent);
                  if (complexContent[0]){
                    if (complexContent[0][namePrefix+'extension']){
                      _.each(complexContent[0],function(extension){     
//                        console.log('extension', extension);
                        if (extension[0]){
                          if (extension[0][namePrefix+'sequence']){
                            _.each(extension[0],function(sequence){     
//                              console.log('sequence', sequence);
                              if (sequence[0]){
                                if (sequence[0][namePrefix+'element']){
                                  _.each(sequence[0][namePrefix+'element'],function(ftField){     
//                                    console.log('FeatureType field: ' + ftField.$.name);
                                    ft.options.push({name:ftField.$.name, title:ftField.$.name});
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
//      console.log('--------------------------');
      ft.options = _.sortBy(ft.options, 'title');
    }
    return ft;
  },
  
  /**
   * GetLegendGraphic from a WMS LAYER
   */
  getLegendGraphicUrl: function(serviceId, layer){
    console.log('getLegendGraphic serviceId: ' + serviceId + ', layer: ' + layer);
    var serv = Services.find({_id: serviceId}).fetch();
    console.log('service found: ',serv);
    if (serv[0]){
      var host = serv[0].endpoint;
      var url = host;
      var version = serv[0].version;
      var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
      var parseResponse = Meteor.call('parseXml', xmlResponse.content);
      
//      console.log('------- Capability -------');
      var capKey = Object.keys(parseResponse);
      var wmsCapObject = parseResponse[capKey];
      if(!wmsCapObject.Capability) {
    	  return '';
      }
      var capObject = wmsCapObject.Capability[0];      
      var layersObject = capObject.Layer;
      var capLayer = Meteor.call('getLayerByName',layersObject, layer);
      if(capLayer) {
	      if(capLayer.Style) {
	    	  if(!capLayer.Style) {
	    		  return '';
	    	  }
	    	  if(capLayer.Style[0].LegendURL) {
	    		  if(!capLayer.Style[0].LegendURL[0].OnlineResource[0]) { 
	    			  return '';
	    		  }
	    		  return capLayer.Style[0].LegendURL[0].OnlineResource[0].$['xlink:href'];
	    	  }
	      }
      }
      return '';
    }
  },
  
  
  /**
   * getPrintFormat from a WMS 
   */
  getPrintFormat: function(host, version){
    var sortedServoptions = [];
    var PRINTFORMATKEY = host + "-" + version;
    console.log('getPrintFormat key: ', PRINTFORMATKEY);
    var resultPrintFormat = PRINTFORMAT.get(PRINTFORMATKEY);
    if (resultPrintFormat){
      sortedServoptions = resultPrintFormat;
    } else {
      console.log('getPrintFormat service: ',host, version);
      var servoptions = [];
      var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
  //    console.log("xmlResponse ",xmlResponse);
      if (xmlResponse.content){
        var parseResponse = Meteor.call('parseXml', xmlResponse.content);
        
        var req = undefined;
        switch(version) {
        case '1.3.0':
          if (parseResponse.WMS_Capabilities.Capability[0]){
            req = parseResponse.WMS_Capabilities.Capability[0].Request;
          }
          break;
        case '1.1.1':
        default:
          if (parseResponse.WMT_MS_Capabilities.Capability[0]){
            req = parseResponse.WMT_MS_Capabilities.Capability[0].Request;
          }
          break;
        }
  //      console.log("req ",req);
        if (req){
          if (req[0].GetMap){
  //            console.log("req[0].GetMap ",req[0].GetMap);
            _.each(req[0].GetMap[0].Format,function(format){
  //            console.log(format);
              servoptions.push({label:format, value:format});
            });
          }
        }
      }
      sortedServoptions = _.sortBy(servoptions, 'label');
      PRINTFORMAT.set(PRINTFORMATKEY, sortedServoptions);
    }
    console.log('WMS getmap format found: ',sortedServoptions);
    return sortedServoptions;
  },
  
  
  getLayerByName: function(layers, name){
	for(var i = 0; i < layers.length; i++){
		if (layers[i].Layer) {
			return Meteor.call('getLayerByName', layers[i].Layer, name);
		}	
		else if(layers[i].Name) {
			if (layers[i].Name[0] === name ) {
				return layers[i];
			}	
		} 
	};
	return null;
  },
  
  
  /**
   * Get service from collection
   */
  getService: function(serviceId){
    console.log('getService id:', serviceId);
    var serv = Services.find({_id: serviceId}).fetch();
    console.log('service found: ',serv);
    return serv;
  },
  
  /**
   * remove '?' from service endpoint
   */
  removeQmarkFromUrl: function(url){
    var q = url.indexOf("?");
    if (q != -1) {
      url = url.substr(0,q);
    }
    return url;
  },
  
  /**
   * add '?' to service endpoint
   */
  addQmarkToUrl: function(url){
    if (url.indexOf("?") == -1) {
      url += "?";
    }
    return url;
  },
  

});

