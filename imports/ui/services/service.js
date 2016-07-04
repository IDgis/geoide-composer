import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Services } from '/imports/api/collections/services.js';
import { ServiceSchema } from '/imports/api/collections/services.js';

import './service.html';


Template.service.helpers({
  services: function(){
    return Services.find();
  },
  serviceSchema: function(){
    return ServiceSchema;
  },
	formType: function () {
		if (Session.get("selectedServiceId")) {
		    return "update";
		 } else {
		    return "insert";
		 }
	},
	serviceDoc: function () {
		if (Session.get("selectedServiceId")) {
		    return this;
		 } else {
		    return null ;
		 }
	},
	serviceTypes: function () {
		return[{label: "WMS", value: "WMS"},
		       {label: "WFS", value: "WFS"},
		       {label: "TMS", value: "TMS"}];
	},
	wmsVersions: function() {
		return [{label: "1.1.1", value: "1.1.1"},
		        {label: "1.3.0", value: "1.3.0"}];
	},
	wfsVersions: function() {
		return [{label: "1.0.0", value: "1.0.0"},
		        {label: "1.1.0", value: "1.1.0"},
		        {label: "2.0.0", value: "2.0.0"}];
	},
	tmsVersions: function() {
		return [{label: "1.0.0", value: "1.0.0"}];
	}
});


Template.service.events({
	'submit #serviceform': function () {
		//TODO: niet terug naar de lijst wanneer er een validatie fout is opgetreden 
		//Router.go('services');
	},
	'click #return': function () {
		Router.go('services');
	}
});