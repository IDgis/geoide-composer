import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { UserSchema } from '/imports/api/collections/users.js';

import './user.html';

Template.user.helpers({
  /**
   * Users collection
   */
  users: function(){
    return Meteor.users;
  },
  /**
   * Users schema
   */
  userSchema: function(){
    return UserSchema;
  },
	formType: function () {
		if (Session.get("selectedUserId")) {
		    return "update";
		 } else {
		    return "insert";
		 }
	},
	userDoc: function () {
		if (Session.get("selectedUserId")) {
		  return Meteor.users.findOne({_id: Session.get("selectedUserId")});
		 } else {
		    return null ;
		 }
	},
});

/**
 * When the Cancel button is pressed go to the user list
 */
Template.user.events({
	'click #return': function () {
    console.log("clicked cancel userform" );
		Router.go('users.list');
	}
});
 
/**
 * when the autoform is succesfully submitted, then go to the user list
 */
AutoForm.addHooks('userform',{
  onSuccess: function(formType, result) {
    console.log("submit user autoform, goto list");
    Router.go('users.list');
  },
  onError: function(formType, error){
    console.log("user autoform error = " + error);
  }
});