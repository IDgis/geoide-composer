import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

Meteor.startup(function() {
/**
 * Server publications
 */
  Meteor.publish('services', function(){
    return Services.find({},{sort:["name", "asc"]});
  });

  Meteor.publish('layers', function(){
    return Layers.find({},{sort:["name", "asc"]});
  });
   
  Meteor.publish('maps', function(){
    return Maps.find({},{sort:["text", "asc"]});
  });

});

