import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Maps } from '/imports/api/collections/maps.js';

import './maps.html';

Template.maps.helpers({
	maps: function(){
	    return Maps.find();
	},
    isSelectedMap: function () {
		return Session.equals("selectedMapId", this._id);
	},
});

Template.maps.events ({
  'click .edit-map': function () { 
	  Session.set("selectedMapId", this._id);
	  Router.go('map.edit', {_id: this._id});
  },
  'click .insert-map': function () {
	  Session.set("selectedMapId", null);
	  Router.go('map.insert');
  },
  'click .delete-map': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder kaart " + this._id); 
	 Maps.remove({_id:this._id})
  },
});