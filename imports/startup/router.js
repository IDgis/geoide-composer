import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

import '../ui/main.css';
import '../ui/main.html';

import '../ui/services/services.js';
import '../ui/services/service.js';

import '../ui/layers/layer.js';

import '../ui/maps/map.js';
import '../ui/maps/maps.js';


Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('services');
}, {
  name: 'main'
});

//service routes
//Router.route('/services', 'services');
Router.route('/services', function () {
  this.render('services');
}, {
  name: 'services.list'
});

//Router.route('/service/insert','service'), {
//	name: 'service.insert'
//};
Router.route('/service/insert', function () {
  this.render('service');
}, {
  name: 'service.insert'
});

Router.route('/service/:_id', function () {
    var service = Services.findOne({_id: this.params._id});
    this.render('service', {data: service});
}, {
    name: 'service.edit'
});

//map routes
//Router.route('/maps', 'maps');
Router.route('/maps', function () {
  this.render('maps');
}, {
  name: 'maps.list'
});


Router.route('/map/insert', function () {
    this.render('map');
}, {
    name: 'map.insert'
});

Router.route('/map/:_id', function () {
    var map = Maps.findOne({_id: this.params._id});
    this.render('map', {data: map});
}, {
    name: 'map.edit'
});

//layer routes
Router.route('/layer', 'layer');
//Router.route('/layers', 'layers');
Router.route('/layers', function () {
  this.render('layers');
}, {
  name: 'layers.list'
});

Router.route('/layer/insert', function () {
    this.render('layer');
}, {
    name: 'layer.insert'
});

Router.route('/layer/:_id', function () {
    var layer = Layers.findOne({_id: this.params._id});
    this.render('layer', {data: layer});
}, {
    name: 'layer.edit'
});

// temporary routes
// test i18n
Router.route('/i18n', 'international');

// test json
Router.route('/jsonapi',  function () {
  var json = Services.find().fetch(); // what ever data you want to return
  this.response.setHeader('Content-Type', 'application/json');
  this.response.end(JSON.stringify(json));
}, {
  name: 'jsonapi'
});
//Router.route('jsonapi', {
//  path: '/jsonapi',
//  where: 'server',
//  action: function () {
//    var json = Services.find().fetch(); // what ever data you want to return
//    this.response.setHeader('Content-Type', 'application/json');
//    this.response.end(JSON.stringify(json));
//  }
//});

// test xml parsing
Router.route('xmlapi', function () {
  console.log('calling http client');
  Meteor.call('getXml',
//      'http://httpbin.org/post'
      'http://acc-services.inspire-provincies.nl/ProtectedSites/services/view_PS' // host argument
      , {request: 'GetCapabilities', service:'WMS'} // params argument
      ,
      function(xmlError,xmlResponse){
        if (xmlError){
          console.log('capError',xmlError);
        } else {
          console.log('capXml',xmlResponse);
//          console.log('capXml.content',xmlResponse.content);
          console.log('calling xml parser');          
          // parse xml
          Meteor.call('parseXml', 
              xmlResponse.content, // xml string argument
              function(parseError,parseResponse){
                if (parseError){
                  console.log('parseError',parseError);
                } else {
                  // resultaat: parseResponse Object van van Capabilities
                  console.log('parseResponse Object:',parseResponse);
                  console.log('URL:',parseResponse.WMS_Capabilities.Capability.Request.GetCapabilities.DCPType.HTTP.Get.OnlineResource.$['xlink:href']);
                  console.log('Service:',parseResponse.WMS_Capabilities.Service.Name);
                  console.log("version:", parseResponse.WMS_Capabilities.$.version);
                  console.log("title:", parseResponse.WMS_Capabilities.Capability.Layer.Title);
                  _.each(parseResponse.WMS_Capabilities.Capability.Layer.Layer,function(layer){
                      console.log('layer:',layer.Title);
                  });
                }
              }
          );
          Session.set('demoResult', xmlResponse);
        }
      }
  );
  
}, {
  name: 'api.xml'
});
