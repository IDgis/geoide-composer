/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

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
  /**
   * Default Meteor collections
   */
  Meteor.subscribe('allUsers');
  Meteor.subscribe('userData');

  /**
   * Accounts configuration
   */
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
});
