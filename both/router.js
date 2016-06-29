Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', 'services');

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

// temporary routes
// test i18n
Router.route('/i18n', 'international');

// test xml parsing
Router.route('xmlapi', function () {
  console.log('calling http client');
  Meteor.call('getXml',
//      'http://httpbin.org/post'
      'http://acc-services.inspire-provincies.nl/ProtectedSites/services/view_PS' // host argument
      , {request: 'GetCapabilities', service:'WMS'} // params argument
      ,
      function(xmlError,xmlResponse){
        if (xmlError){
          console.log('capError',xmlError);
        } else {
          console.log('capXml',xmlResponse);
//          console.log('capXml.content',xmlResponse.content);
          console.log('calling xml parser');          
          // parse xml
          Meteor.call('parseXml', 
              xmlResponse.content, // xml string argument
              function(parseError,parseResponse){
                if (parseError){
                  console.log('parseError',parseError);
                } else {
                  // resultaat: parseResponse Object van van Capabilities
                  console.log('parseResponse Object:',parseResponse);
                  console.log('URL:',parseResponse.WMS_Capabilities.Capability.Request.GetCapabilities.DCPType.HTTP.Get.OnlineResource.$['xlink:href']);
                  console.log('Service:',parseResponse.WMS_Capabilities.Service.Name);
                  console.log("version:", parseResponse.WMS_Capabilities.$.version);
                  console.log("title:", parseResponse.WMS_Capabilities.Capability.Layer.Title);
                  _.each(parseResponse.WMS_Capabilities.Capability.Layer.Layer,function(layer){
                      console.log('layer:',layer.Title);
                  });
                }
              }
          );
          Session.set('demoResult', xmlResponse);
        }
      }
  );
  this.render('map', {data: Session.get('demoResult')});
  
}, {
  name: 'api.xml'
});
