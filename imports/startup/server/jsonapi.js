/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { EJSON } from 'meteor/ejson';

import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

/**
 * Helper routines to show the collections as json
 */
Router.map(function () {
  this.route('jsonapi-services', {
    path: '/jsonapi-services',
    where: 'server',
    action: function () {
      const  json = Services.find().fetch(); 
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(EJSON.stringify(json, {indent: true}));
    }
  });
  this.route('jsonapi-layers', {
    path: '/jsonapi-layers',
    where: 'server',
    action: function () {
      const  json = Layers.find().fetch(); 
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(EJSON.stringify(json, {indent: true}));
    }
  });
  this.route('jsonapi-maps', {
    path: '/jsonapi-maps',
    where: 'server',
    action: function () {
      const  json = Maps.find().fetch(); 
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(EJSON.stringify(json, {indent: true}));
    }
  });
});
