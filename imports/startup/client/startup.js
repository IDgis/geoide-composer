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
  
// enable debugging during development
//  AutoForm.debug(true);
//  SimpleSchema.debug = true;

});

setCursorProgress = function() {
  $("body").css("cursor", "wait");
};

setCursorNormal = function() {
  $("body").css("cursor", "default");
};
