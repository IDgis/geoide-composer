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
  /**
   * settings: version   
   */
  getVersion : function(){
    if (Meteor.settings){
      return Meteor.settings.version;
    } else {
      return '-';
    }
  },

  /**
   * settings: url initiating geoide-viewer configuration reload   
   */
  getViewerReloadConfigUrl : function(){
    if (Meteor.settings){
      return Meteor.settings.viewer.reloadConfigUrl;
    } else {
      return null;
    }
  },

  /**
   * settings: folder where uploaded legendGraphics are stored   
   */
  getLegendGraphicUploadFolder : function(){
    if (Meteor.settings){
      return Meteor.settings.legendGraphic.uploadFolder;
    } else {
      return "/tmp/.uploads/";
    }
  },

  /**
   * initiate geoide-viewer configuration reload by calling http get on url
   */
  triggerViewerReload : function (){
    var url = Meteor.call('getViewerReloadConfigUrl');
    console.log('triggerViewerReload() url: ', url);
    if (url){
      try {
        var res = HTTP.get(url, {headers:{
            'User-Agent': 'Meteor/1.3',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        return res;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        console.log('triggerViewerReload() error', e);
        return e; // return the error as a valid result, to be analyzed at client side
      }
    }
  },

});

/**
 * Set up for upload package (used for legendGraphics)
 */
UploadServer.init({
  tmpDir: Meteor.call('getLegendGraphicUploadFolder') + 'tmp',
  uploadDir: Meteor.call('getLegendGraphicUploadFolder'),
  checkCreateDirectories: true, //create the directories for you
  overwrite: true,
  finished(fileInfo, formFields) {
    console.log('fileInfo', fileInfo);
    console.log('formFields', formFields);
  },
//  uploadUrl: '/GetLegendGraphic/', // ## must be 'upload' ##
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
