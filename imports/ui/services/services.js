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
        return Services.find({},{sort:[["name", "asc"]]});
    },
    setDisabled: function(id){
      return ReactiveMethod.call('isServiceInLayer', id)?'disabled':'';
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
	 // zie atmosphere package matdutour:popup-confirm
	 console.log("verwijder service " + this._id);
	 var serviceId = this._id;
	 new Confirmation({
	   message: function(){ return i18n('collections.confirmation.delete.message.services'); },
	   title: function(){ return i18n('collections.confirmation.delete.title'); },
	   cancelText: function(){ return i18n('collections.confirmation.delete.cancel'); },
	   okText: function(){ return i18n('collections.confirmation.delete.ok'); },
	   success: false, // whether the button should be green or red
	   focus: "ok" // which button to autofocus, "cancel" (default) or "ok", or "none"
	 }, function (ok) {
	   console.log("confirmation", ok);
	   // ok is true if the user clicked on "ok", false otherwise
	   if (ok){
	     console.log("id", serviceId);
	     Services.remove({_id:serviceId});
	   }
	 });
  },
});



