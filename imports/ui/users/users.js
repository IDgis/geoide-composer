import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import './users.html';

Template.users.helpers({
	/**
	 * List of users
	 */
  users: function(){
        return Meteor.users.find({});
    },
});


Template.users.events({
  'click .edit-user': function () { 
	  Session.set("selectedUserId", this._id);
    console.log("edit user " + this._id); 
	  Router.go('user.edit', {_id: this._id});
  },
  'click .insert-user': function () {
	  Session.set("selectedUserId", null);
    console.log("insert user "); 
	  Router.go('user.insert');
  },
  'click .delete-user': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder user " + this._id); 
	 Meteor.users.remove({_id:this._id})
  },
});



