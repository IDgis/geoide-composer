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
   */
  parseXml : function(xml){
    return xml2js.parseStringSync(xml, {explicitArray:false, emptyTag:undefined});
  },
  /**
   * Get layers from a WMS
   */
  getWmsLayers: function(host, version){
    console.log('getWmsLayers host: ' + host + ', version: ' + version);
    var xmlResponse = Meteor.call('getXml', host, {request: 'GetCapabilities', service:'WMS', version: version});
//    console.log('getServiceLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
//    console.log('getServiceLayers parseResponse:', parseResponse);
    var servoptions = [];

    // TODO code below depends on version
    // version 1.3.0
    _.each(parseResponse.WMS_Capabilities.Capability.Layer.Layer,function(layer){
        servoptions.push({name:layer.Name, title:layer.Title});
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
    console.log('getServiceLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
    console.log('getServiceLayers parseResponse:', parseResponse);
 
    // version 1.0.0
    var tmsLayer = _.find(parseResponse.TileMap.TileSets.TileSet,function(tl){
        // break after first occurence
        return true;
      });
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
//    console.log('getServiceLayers xmlResponse:', xmlResponse.content);
    var parseResponse = Meteor.call('parseXml', xmlResponse.content);
//    console.log('getServiceLayers parseResponse:', parseResponse);
    var servoptions = [];

    // TODO code below depends on version
    // version 2.0.0
    _.each(parseResponse.WFS_Capabilities.FeatureTypeList.FeatureType,function(ft){
        if (typeof ft.Name === 'object' ){
          servoptions.push({name:ft.Name._, title:ft.Title});
        } else {
          servoptions.push({name:ft.Name, title:ft.Title});
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

