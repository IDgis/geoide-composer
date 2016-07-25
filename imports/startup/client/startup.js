import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {
  i18n.setDefaultLanguage('nl');
  
  /**
   * Client subscriptions
   */
  Meteor.subscribe('services');
  Meteor.subscribe('layers');
  Meteor.subscribe('maps');
  
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });
});

