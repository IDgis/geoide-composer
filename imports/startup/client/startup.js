Meteor.startup(function() {
  i18n.setDefaultLanguage('nl');
  
  /**
   * Client subscriptions
   */
  Meteor.subscribe('services');
  Meteor.subscribe('layers');
  Meteor.subscribe('maps');
});

