import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Services,  ServiceSchema } from '/imports/api/collections/services.js';

import './service.html';

Template.service.helpers({
  /**
   * Services collection
   */
  services: function(){
    return Services;
  },
  /**
   * Services schema
   */
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
		  return Services.findOne({_id: Session.get("selectedServiceId")});
//		    return this;
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

/**
 * When the Cancel button is pressed go to the service list
 */
Template.service.events({
	'click #return': function () {
    console.log("clicked cancel serviceform" );
		Router.go('services.list');
	}
});
 
/**
 * when the autoform is succesfully submitted, then go to the service list
 */
AutoForm.addHooks('serviceform',{
  onSuccess: function(formType, result) {
    console.log("submit service autoform, goto list");
    Router.go('services.list');
  },
  onError: function(formType, error){
    console.log("service autoform error = " + error);
  }
});