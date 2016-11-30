/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

import '../../ui/main.js';

import '../../ui/services/services.js';
import '../../ui/services/service.js';

import '../../ui/layers/layers.js';
import '../../ui/layers/layer.js';

import '../../ui/maps/map.js';
import '../../ui/maps/maps.js';

import '../../ui/i18n/home/home.html';

/**
 * Router client routes
 */

Router.configure({
    layoutTemplate: 'main'
});

/**
 * Main entry: home page
 * Note: 
 *   The name of the home page template name, is stored in the i18n file.
 *   The home page html contains all templates for all supported languages.
 */
Router.route('/', function () {
  this.render(i18n ('main.home.template'));
}, {
  name: 'main'
});

//service routes
Router.route('/services', function () {
  this.render('services');
}, {
  name: 'services.list'
});

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
