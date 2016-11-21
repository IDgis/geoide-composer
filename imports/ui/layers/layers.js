import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Layers } from '/imports/api/collections/layers.js';

import './layers.html';

Template.layers.helpers({
	/**
	 * List of layers
	 * Only retrieve all layers when idgis-admin user is logged in 
	 */
  layers: function(){
      var adminLoggedIn = false; 
      if (Meteor.user()){
        var name = Meteor.user().username;
        adminLoggedIn = _.isEqual(name, 'idgis-admin');
      }
      if (adminLoggedIn){
        return Layers.find({},{sort:[['name', 'asc']]});
      } else {
        return Layers.find({type: 'default'},{sort:[['name', 'asc']]});
      }
    },
    setDisabled: function(id){
      return ReactiveMethod.call('isLayerInMap', id)?'disabled':'';
    },
});


Template.layers.events({
  'click .edit-layer': function () { 
	  Session.set('selectedLayerId', this._id);
	  Router.go('layer.edit', {_id: this._id});
  },
  'click .insert-layer': function () {
	  Session.set('selectedLayerId', null);
	  Router.go('layer.insert');
  },
  'click .delete-layer': function() {
    // zie atmosphere package matdutour:popup-confirm
    var layerId = this._id;
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
  },
});



