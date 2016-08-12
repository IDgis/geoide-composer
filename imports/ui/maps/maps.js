import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Maps } from '/imports/api/collections/maps.js';

import './maps.html';

Template.maps.helpers({
	maps: function(){
	    return Maps.find({},{sort:[["name", "asc"]]});
	},
});

Template.maps.events ({
  'click .edit-map': function () { 
	  Session.set("selectedMapId", this._id);
    console.log("edit kaart " + this._id); 
	  Router.go('map.edit', {_id: this._id});
  },
  'click .insert-map': function () {
	  Session.set("selectedMapId", null);
    console.log("insert kaart"); 
	  Router.go('map.insert');
  },
  'click .delete-map': function() {
    // zie atmosphere package matdutour:popup-confirm
    console.log("verwijder map " + this._id);
    var mapId = this._id;
    new Confirmation({
      message: function(){ return i18n('collections.confirmation.delete.message.maps'); },
      title: function(){ return i18n('collections.confirmation.delete.title'); },
      cancelText: function(){ return i18n('collections.confirmation.delete.cancel'); },
      okText: function(){ return i18n('collections.confirmation.delete.ok'); },
      success: false, // whether the button should be green or red
      focus: "ok" // which button to autofocus, "cancel" (default) or "ok", or "none"
    }, function (ok) {
      console.log("confirmation", ok);
      // ok is true if the user clicked on "ok", false otherwise
      if (ok){
        console.log("id", mapId);
        Maps.remove({_id:mapId});
      }
    });
  },
});