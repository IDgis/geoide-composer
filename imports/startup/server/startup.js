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

UploadServer.init({
  tmpDir: process.env.PWD + '/public/.uploads/tmp',
  uploadDir: process.env.PWD + '/public/.uploads/',
  checkCreateDirectories: true, //create the directories for you
  overwrite: true,
  finished(fileInfo, formFields) {
    console.log('fileInfo', fileInfo);
    console.log('formFields', formFields);
  },
  //  uploadUrl: '/getLegendGraphic/',
});

/**
 * Make sure user idgis-admin with administrator role exists,
 * make one if needed 
 */
var adminUser = Meteor.users.findOne({username: 'idgis-admin'});
console.log("idgis-admin user: ",adminUser);
if (!adminUser){
  adminUser = Accounts.createUser({username:'idgis-admin', password:'koffie'});
  
  console.log("new idgis-admin user: ",adminUser);
  Meteor.users.update(adminUser);
}
