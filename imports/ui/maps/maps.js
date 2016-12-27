/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Maps } from '/imports/api/collections/maps.js';

import './maps.html';

Template.maps.helpers({
  /**
   * Get a cursor containing Map collection sorted by name
   * Note:
   *   the map name is stored in field 'text'
   */
  maps: function(){
      return Maps.find({},{sort:[['name', 'asc']]});
  }
});

Template.maps.events ({

  /**
   * Save map id in a Session object when edit map button is pressed
   * Then render the map form
   */
  'click .edit-map': function () { 
    Session.set('selectedMapId', this._id);
    Router.go('map.edit', {_id: this._id});
  },
  
  /**
   * Set a Session object (to null) when insert map button is pressed
   * Then render the map form
   */
  'click .insert-map': function () {
    Session.set('selectedMapId', null);
    Router.go('map.insert');
  },
  
  /**
   * Show confirmation dialog when delete map button is pressed
   * When user presses OK button, delete the map from the map collection
   */
  'click .delete-map': function() {
    // zie atmosphere package matdutour:popup-confirm
    const mapId = this._id;
    new Confirmation({
      message: function(){ return i18n('collections.confirmation.delete.message.maps'); },
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
        Maps.remove({_id:mapId});
      }
    });
  }
});
