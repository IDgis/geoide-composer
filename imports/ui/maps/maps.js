import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Maps } from '/imports/api/collections/maps.js';

import './maps.html';

Template.maps.helpers({
	maps: function(){
	    return Maps.find({});
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
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder kaart " + this._id); 
	 Maps.remove({_id:this._id})
  },
});