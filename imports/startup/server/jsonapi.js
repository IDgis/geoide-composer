import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

Router.map(function () {
  this.route('jsonapi-services', {
    path: '/jsonapi-services',
    where: 'server',
    action: function () {
      var json = Services.find().fetch(); // what ever data you want to return
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    }
  });
  this.route('jsonapi-layers', {
    path: '/jsonapi-layers',
    where: 'server',
    action: function () {
      var json = Layers.find().fetch(); // what ever data you want to return
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    }
  });
  this.route('jsonapi-maps', {
    path: '/jsonapi-maps',
    where: 'server',
    action: function () {
      var json = Maps.find().fetch(); // what ever data you want to return
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    }
  });
});