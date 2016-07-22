import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Layers } from '/imports/api/collections/layers.js';

import './layers.html';

Template.layers.helpers({
	/**
	 * List of layers
	 */
  layers: function(){
        return Layers.find({});
    },
});


Template.layers.events({
  'click .edit-layer': function () { 
	  Session.set("selectedLayerId", this._id);
    console.log("edit layer " + this._id); 
	  Router.go('layer.edit', {_id: this._id});
  },
  'click .insert-layer': function () {
	  Session.set("selectedLayerId", null);
    console.log("insert layer "); 
	  Router.go('layer.insert');
  },
  'click .delete-layer': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder layer " + this._id); 
	 Layers.remove({_id:this._id})
  },
});



