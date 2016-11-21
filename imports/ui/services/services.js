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
        return Services.find({},{sort:[['name', 'asc']]});
    },
    setDisabled: function(id){
      return ReactiveMethod.call('isServiceInLayer', id)?'disabled':'';
    },
});


Template.services.events({
  'click .edit-service': function () { 
	  Session.set('selectedServiceId', this._id);
	  Router.go('service.edit', {_id: this._id});
  },
  'click .insert-service': function () {
	  Session.set('selectedServiceId', null);
	  Router.go('service.insert');
  },
  'click .delete-service': function() {
	 // zie atmosphere package matdutour:popup-confirm
	 var serviceId = this._id;
	 new Confirmation({
	   message: function(){ return i18n('collections.confirmation.delete.message.services'); },
	   title: function(){ return i18n('collections.confirmation.delete.title'); },
	   cancelText: function(){ return i18n('collections.confirmation.delete.cancel'); },
	   okText: function(){ return i18n('collections.confirmation.delete.ok'); },
	   // whether the button should be green or red
	   success: false,
	   // which button to autofocus, 'cancel' (default) or 'ok', or 'none'
	   focus: 'ok'
	 }, function (ok) {
	   // ok is true if the user clicked on 'ok', false otherwise
	   if (ok){
	     Services.remove({_id:serviceId});
	   }
	 });
  },
});



