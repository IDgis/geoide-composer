/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Accounts } from 'meteor/accounts-base';

import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

Meteor.startup(function() {
/**
 * Server publications
 */
  Meteor.publish('services', function(){
    return Services.find({},{sort:[['name', 'asc']]});
  });

  Meteor.publish('layers', function(){
    return Layers.find({},{sort:[['name', 'asc']]});
  });
   
  Meteor.publish('maps', function(){
    return Maps.find({},{sort:[['text', 'asc']]});
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
      return null;
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
      return '/tmp/.uploads/';
    }
  },

  /**
   * settings: delay of resetting WMS/WFS caches   
   */
  getRequestCacheDelay : function(){
    if ((Meteor.settings) && 
      (Meteor.settings.requestcache)&& 
      (Meteor.settings.requestcache.delay)){
      return Meteor.settings.requestcache.delay;
    }
    // 60 minutes
    return 60 * 60 * 1000;
  },

  /**
   * initiate geoide-viewer configuration reload by calling http get on url
   */
  triggerViewerReload : function (){
    const url = Meteor.call('getViewerReloadConfigUrl');
    if (url){
        const res = HTTP.get(url, {headers:{
            'User-Agent': 'Meteor/1.3',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        return res;
    }
  }

});

/**
 * Set up for upload package tomi:upload-server (used for legendGraphics)
 */
UploadServer.init({
  tmpDir: Meteor.call('getLegendGraphicUploadFolder') + 'tmp',
  uploadDir: Meteor.call('getLegendGraphicUploadFolder'),
  //create the directories:
  checkCreateDirectories: true,
  overwrite: true
//  uploadUrl: '/GetLegendGraphic/', // ## must be 'upload' ##
});

/**
 * Make sure user idgis-admin with administrator role exists,
 * make one if needed 
 */
let adminUser = Meteor.users.findOne({username: 'idgis-admin'});
if (!adminUser){
  adminUser = Accounts.createUser({username:'idgis-admin', password:'koffie'});
  Meteor.users.update(adminUser);
}
