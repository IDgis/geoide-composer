/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Services } from '/imports/api/collections/services.js';

import './services.html';

Template.services.helpers({
  /**
   * Get cursor of services
   * 
   * @return {cursor} cursor of services found
   *
   * Note:
   *  services are sorted by name
   */
  services: function(){
        return Services.find({},{sort:[['name', 'asc']]});
  },
  
  /**
   * Check whether a service is used in a layer
   * 
   * @param {string} id of the service
   * @return {string} 'disabled' if service is used in a layer 
   */
  setDisabled: function(id){
    return ReactiveMethod.call('isServiceInLayer', id)?'disabled':'';
  }
});


Template.services.events({
  /**
   * Save service id in a Session object when edit service button is pressed
   * Then render the service form
   */
  'click .edit-service': function () { 
    Session.set('selectedServiceId', this._id);
    Router.go('service.edit', {_id: this._id});
  },
  
  /**
   * Set a Session object (to null) when insert service button is pressed
   * Then render the service form
   */
  'click .insert-service': function () {
    Session.set('selectedServiceId', null);
    Router.go('service.insert');
  },
  
  /**
   * Show confirmation dialog when delete service button is pressed
   * When user presses OK button, delete the service from the service collection
   */
  'click .delete-service': function() {
   // zie atmosphere package matdutour:popup-confirm
   const serviceId = this._id;
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
  }
});



