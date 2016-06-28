Router.configure({
    layoutTemplate: 'main'
});
Router.route('/i18n', 'international');

//service routes
Router.route('/services', 'services');

Router.route('/service/insert','service'), {
	name: 'service.insert'
};

Router.route('/service/:_id', function () {
    var service = Services.findOne({_id: this.params._id});
    this.render('service', {data: service});
}, {
    name: 'service.edit'
});

//map routes
Router.route('/maps', 'maps');

Router.route('/map/insert', function () {
    this.render('map');
}, {
    name: 'map.insert'
});

Router.route('/map/:_id', function () {
    var map = Maps.findOne({_id: this.params._id});
    this.render('map', {data: map});
}, {
    name: 'map.edit'
});

//layer routes
Router.route('/layer', 'layer');



Router.route('xmlapi2', function () {
  console.log('calling http client');
  Meteor.call('getCap',
      'http://acc-services.inspire-provincies.nl/ProtectedSites/services/view_PS',
      'request=GetCapabilities&service=WMS&version=1.3.0'
  ,
      function(callError,callResponse){
        if (callError){
          console.log('error',callError);
        } else {
          console.log('xml',callResponse);
          Session.set('demoResult', callResponse);
        }
      }
  );
  this.render('map', {data: Session.get('demoResult')});
  
}, {
  name: 'api.xml'
});
