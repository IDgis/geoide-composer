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

import '../../ui/users/user.js';
import '../../ui/users/users.js';


Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', function () {
  this.render('services');
}, {
  name: 'main'
});

//service routes
Router.route('/services', function () {
  console.log("REL Meteor.absoluteUrl(): " + Meteor.absoluteUrl());
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

//user routes
Router.route('/users', function () {
  this.render('users');
}, {
  name: 'users.list'
});

Router.route('/user/insert', function () {
    this.render('user');
}, {
    name: 'user.insert'
});

Router.route('/user/:_id', function () {
    var user = Meteor.users.findOne({_id: this.params._id});
    this.render('user', {data: user});
}, {
    name: 'user.edit'
});

// temporary routes
