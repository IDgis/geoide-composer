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

  Meteor.publish("userData", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId});
    } else {
      this.ready();
    }
  });
  
  Meteor.publish("allUsers", function () {
    return Meteor.users.find({});
  });
  
});

/**
 * Make sure user idgis_admin with administrator role exists 
 */
var user = Meteor.users.findOne({username: 'idgis_admin'});
console.log("idgis_admin user: ",user);
if (!user){
  user = Accounts.createUser({username:'idgis_admin', password:'koffie'});
  
  console.log("new idgis_admin user: ",user);
  Meteor.users.update(user, {$set: {role: 'idgis-admin'}});
}

