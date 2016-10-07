import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {
  i18n.setDefaultLanguage('nl');
  
  /**
   * Client subscriptions
   */
  Meteor.subscribe('services');
  Meteor.subscribe('layers');
  Meteor.subscribe('maps');
  Meteor.subscribe('allUsers');
  Meteor.subscribe('userData');
  
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });
  
//  AutoForm.debug(true);//enable debugging during development
//  SimpleSchema.debug = true;

});

setCursorProgress = function() {
  console.log("set cursor to WAIT");
  $("body").css("cursor", "wait");
}

setCursorNormal = function() {
  console.log("set cursor to NORMAL");
  $("body").css("cursor", "default");
}
