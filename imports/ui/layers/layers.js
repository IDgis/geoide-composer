/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Layers } from '/imports/api/collections/layers.js';

import './layers.html';

Template.layers.helpers({
  /**
   * Get cursor of layers
   * 
   * @return {cursor} cursor of layers found
   *    retrieve all layers when idgis-admin user is logged in,
   *    otherwise retrieve only layers with type='default'
   *
   * Note:
   *  layers are sorted by name
   */
  layers: function(){
      let adminLoggedIn = false; 
      if (Meteor.user()){
        const name = Meteor.user().username;
        adminLoggedIn = _.isEqual(name, 'idgis-admin');
      }
      if (adminLoggedIn){
        return Layers.find({},{sort:[['name', 'asc']]});
      } else {
        return Layers.find({type: 'default'},{sort:[['name', 'asc']]});
      }
    },
    
    /**
     * Check whether a layer is used in a map
     * 
     * @param {string} id of the layer
     * @return {string} 'disabled' if layer is used in a map 
     */
    setDisabled: function(id){
      return ReactiveMethod.call('isLayerInMap', id)?'disabled':'';
    }
});


Template.layers.events({
  /**
   * Save layer id in a Session object when edit layer button is pressed
   * Then render the layer form
   */
  'click .edit-layer': function () { 
    Session.set('selectedLayerId', this._id);
    Router.go('layer.edit', {_id: this._id});
  },
  
  /**
   * Set a Session object (to null) when insert layer button is pressed
   * Then render the layer form
   */
  'click .insert-layer': function () {
    Session.set('selectedLayerId', null);
    Router.go('layer.insert');
  },
  
  /**
   * Show confirmation dialog when delete layer button is pressed
   * When user presses OK button, delete the layer from the layer collection
   */
  'click .delete-layer': function() {
    // zie atmosphere package matdutour:popup-confirm
    const layerId = this._id;
    new Confirmation({
      message: function(){ return i18n('collections.confirmation.delete.message.layers'); },
      title: function(){ return i18n('collections.confirmation.delete.title'); },
      cancelText: function(){ return i18n('collections.confirmation.delete.cancel'); },
      okText: function(){ return i18n('collections.confirmation.delete.ok'); },
      // whether the button should be green or red:
      success: false,
      // which button to autofocus, 'cancel' (default) or 'ok', or 'none'
      focus: 'ok'
    }, function (ok) {
      // ok is true if the user clicked on 'ok', false otherwise
      if (ok){
        Layers.remove({_id:layerId});
      }
    });
  }
});



