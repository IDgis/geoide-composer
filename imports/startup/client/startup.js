import { Accounts } from 'meteor/accounts-base';

/**
 * Client side functions 
 */

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
});

/*
 * set the mouse cursor to a waiting cursor
 */
var setCursorProgress = function() {
  $("body").css("cursor", "wait");
};

/*
 * set the mouse cursor to default (arrow) cursor
 */
var setCursorNormal = function() {
  $("body").css("cursor", "default");
};
