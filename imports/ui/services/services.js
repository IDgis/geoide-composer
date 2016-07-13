import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Services } from '/imports/api/collections/services.js';

import './services.html';

Template.services.helpers({
	/**
	 * List of services
	 */
  services: function(){
        return Services.find({},{sort:["name", "asc"]});
    },
    isSelectedService: function () {
		return Session.equals("selectedServiceId", this._id);
	},
});


Template.services.events({
  'click .edit-service': function () { 
	  Session.set("selectedServiceId", this._id);
    console.log("edit service " + this._id); 
	  Router.go('service.edit', {_id: this._id});
  },
  'click .insert-service': function () {
	  Session.set("selectedServiceId", null);
    console.log("insert service "); 
	  Router.go('service.insert');
  },
  'click .delete-service': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder service " + this._id); 
	 Services.remove({_id:this._id})
  },
});



