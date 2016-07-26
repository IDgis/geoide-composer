import { Accounts } from 'meteor/accounts-base';

import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

Meteor.startup(function() {
/**
 * Server publications
 */
  Meteor.publish('services', function(){
    return Services.find({},{sort:[["name", "asc"]]});
  });

  Meteor.publish('layers', function(){
    return Layers.find({},{sort:[["name", "asc"]]});
  });
   
  Meteor.publish('maps', function(){
    return Maps.find({},{sort:[["text", "asc"]]});
  });

});

Meteor.methods({
  getAdminUser : function (){
    return Meteor.users.findOne({username: 'idgis-admin'});
  }
}); 

/**
 * Make sure user idgis_admin with administrator role exists 
 */
var adminUser = Meteor.users.findOne({username: 'idgis-admin'});
console.log("idgis-admin user: ",adminUser);
if (!adminUser){
  adminUser = Accounts.createUser({username:'idgis-admin', password:'koffie'});
  
  console.log("new idgis-admin user: ",adminUser);
  Meteor.users.update(adminUser);
}
