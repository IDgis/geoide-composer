import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { xml2js } from 'meteor/peerlibrary:xml2js';

import { Services } from '/imports/api/collections/services.js';


Meteor.methods({
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
   * We use 'explicitArray:true' so that parsing code can behave the same whether
   * an object contains one or more subobjects of some kind. 
   */
  parseXml : function(xml){
    return xml2js.parseStringSync(xml, {explicitArray:true});
  },
  /**
   * Get layers from a WMS
   */
  getWmsLayers: function(host, version){
    console.log('getWmsLayers host: ' + host + ', version: ' + version);
    var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
//    console.log('getServiceLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
    console.log('------- Capability -------');
    console.log(parseResponse.WMS_Capabilities.Capability);
    console.log('--------------------------');
    var servoptions = [];

    // TODO code below depends on version
    // version 1.3.0
    // main layer
    var capLayer= parseResponse.WMS_Capabilities.Capability[0].Layer;
    console.log('******* main Layers *******');
    _.each(capLayer,function(mainLayer){
      console.log(mainLayer);
      if (mainLayer.$){
        if (mainLayer.$.queryable){
          servoptions.push({name:mainLayer.Name[0], title:mainLayer.Title[0]});
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
              servoptions.push({name:subLayer.Name[0], title:subLayer.Title[0]});
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
    var last = href.lastIndexOf('/');
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
    console.log('------- WFS Capability -------');
    console.log(parseResponse.WFS_Capabilities);
    console.log('--------------------------');

    var servoptions = [];

    // TODO code below depends on version
    // version 2.0.0
    _.each(parseResponse.WFS_Capabilities.FeatureTypeList[0].FeatureType,function(ft){
        console.log(ft);
        if (ft.Name[0]._){
          servoptions.push({name:ft.Name[0]._, title:ft.Title[0]});
        } else {
          servoptions.push({name:ft.Name[0], title:ft.Title[0]});
        }
      });

    console.log('WFS FeatureTypes found: ',servoptions);
    return servoptions;
  },
  
  /**
   * Get service from collection
   */
  getService: function(thisid){
    console.log('getService id:', thisid);
    var serv = Services.find({_id: thisid}).fetch();
    console.log('service found: ',serv);
    return serv;
  },
});

