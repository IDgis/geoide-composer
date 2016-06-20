Template.international.helpers({
  heading1: function(){
    console.log('heading1: ' + i18n('heading1'));
    return i18n('heading1');
  },
  heading2: function(){
    console.log('heading2.main: ' + i18n('heading2.main'));
    return i18n('heading2.main');
  },
});

Template.international.events({
  'click .english': function () { 
    console.log('english lang set');
    i18n.setDefaultLanguage('en');
    i18n.setLanguage('en');
  },
  'click .nederlands': function() {
    console.log('nederlandse taal gezet'); 
    i18n.setDefaultLanguage('nl');
    i18n.setLanguage('nl');
  },
});
