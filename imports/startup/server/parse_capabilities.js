import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { xml2js } from 'meteor/peerlibrary:xml2js';

import { Services } from '/imports/api/collections/services.js';


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
   */
  parseXml : function(xml){
    return xml2js.parseStringSync(xml, {explicitArray:true, stripPrefix: true});
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

    console.log('------- Capability -------');
    switch(version) {
    case '1.3.0':
      // version 1.3.0
      console.log(parseResponse.WMS_Capabilities.Capability);
      // main layer
      var capLayer= parseResponse.WMS_Capabilities.Capability[0].Layer;
      break;
    case '1.1.1':
    default:
      // version 1.1.1
      console.log(parseResponse.WMT_MS_Capabilities.Capability);
      // main layer
      var capLayer= parseResponse.WMT_MS_Capabilities.Capability[0].Layer;
      break;
    }
  
    console.log('******* main Layers *******');
    _.each(capLayer,function(mainLayer){
      console.log(mainLayer);
      if (mainLayer.$){
        if (mainLayer.$.queryable){
          if (mainLayer.$.queryable == '1'){
            servoptions.push({name:mainLayer.Name[0], title:mainLayer.Title[0]});
          }
        }
      }
      console.log('**************************');
      // sub layer(s)
      if (mainLayer.Layer){
        console.log('...... sub Layers .........');
        _.each(mainLayer.Layer,function(subLayer){
          console.log(subLayer);
          if (subLayer.$){
            if (subLayer.$.queryable){
              if (subLayer.$.queryable == '1'){
                servoptions.push({name:subLayer.Name[0], title:subLayer.Title[0]});
              }
            }
          }
          console.log('..........................');
        });
      }
    });
    console.log('WMS Layers found: ',servoptions);
    return servoptions;
  },
  
  /**
   * Get layers from a TMS
   */
  getTmsLayers: function(host, version){
    console.log('getTmsLayers host: ' + host + ', version: ' + version);
    var xmlResponse = Meteor.call('getXml', host, {});
    console.log('getTmsLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
    console.log('getTmsLayers parseResponse:', parseResponse);
    console.log('getTmsLayers TileSets:', parseResponse.TileMap.TileSets[0]);
 
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
    console.log('------- WFS Capability -------', parseResponse);
    console.log('------- WFS Capability main -------', parseResponse.WFS_Capabilities);
    console.log('--------------------------');

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

    console.log('WFS FeatureTypes found: ',servoptions);
    return servoptions;
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
    console.log('------- WFS DescribeFeatureType -------', namePrefix);
    _.each(parseResponse,function(schema){
      console.log('schema', schema);
      ft.targetNamespace = schema.$.targetNamespace;
      _.each(schema,function(nextTag){
        console.log('nextTag', nextTag);
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
          console.log('complexType', complexType); 
          if (complexType[0]){
            if (complexType[0][namePrefix+'complexContent']){
              _.each(complexType[0],function(complexContent){     
                console.log('complexContent', complexContent);
                if (complexContent[0]){
                  if (complexContent[0][namePrefix+'extension']){
                    _.each(complexContent[0],function(extension){     
                      console.log('extension', extension);
                      if (extension[0]){
                        if (extension[0][namePrefix+'sequence']){
                          _.each(extension[0],function(sequence){     
                            console.log('sequence', sequence);
                            if (sequence[0]){
                              if (sequence[0][namePrefix+'element']){
                                _.each(sequence[0][namePrefix+'element'],function(ftField){     
                                  console.log('FeatureType field: ' + ftField.$.name);
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
    console.log('--------------------------');

    return ft;
  },
  
  /**
   * GetLegendGraphic from a WMS
   */
  getLegendGraphicUrl: function(serviceId, layer){
    console.log('getLegendGraphic serviceId: ' + serviceId + ', layer: ' + layer);
    var serv = Services.find({_id: serviceId}).fetch();
    console.log('service found: ',serv);
    var host = serv[0].endpoint;
    var url = host;
    var version = serv[0].version;
    var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
//    console.log('getServiceLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
    var glgTag, capRequest;
    
    console.log('------- Capability -------');
    switch(version) {
    case '1.3.0':
      // version 1.3.0
      console.log(parseResponse.WMS_Capabilities.Capability);
      // request
      capRequest = parseResponse.WMS_Capabilities.Capability[0].Request;
      glgTag = 'sld:GetLegendGraphic';
      break;
    case '1.1.1':
    default:
      // version 1.1.1
      console.log(parseResponse.WMT_MS_Capabilities.Capability);
      // request
      capRequest = parseResponse.WMT_MS_Capabilities.Capability[0].Request;
      glgTag = 'GetLegendGraphic';
      break;
    }

    // main layer
    console.log('******* WMS requests: *******');
    var selectedFormat;
    _.each(capRequest,function(mainRequest){
        console.log(mainRequest);
        var lg = mainRequest[glgTag];
        console.log(lg);
        var pngFormat, jpgFormat, gifFormat;
        var formats = lg[0].Format; 
        _.each(formats,function(format){
          console.log(format);
          if (format === 'image/png'){
            pngFormat = format;            
          } 
          if (format === 'image/jpg' | format === 'image/jpeg'){
            jpgFormat = format;
          }
          if (format === 'image/gif'){
            gifFormat = format;
          }
        })
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
        /* looking for a base url (DCPType) of the GetLegendGraphic request has no use
         * because in the capabilities it can be listed as 'http://localhost:8081/...'
         */ 
        if (url.lastIndexOf('?') < 0){
          url = url + '?';
        }
        if (selectedFormat){
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
        console.log('**************************');
    });
    console.log('WMS getLegendGraphic url: ',url);
    var imgResponse = Meteor.call('getImage', url, {});
    console.log('imgResponse', imgResponse);
    return url;
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
});

