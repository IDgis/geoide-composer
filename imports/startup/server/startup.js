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
   * settings: 
   *   version to be displayed in GUI
   * 
   * @return [string] version string
   *   a default value is returned, 
   *   if this item is not found in the settings file
   * 
   * !!!!!!!!!!!!!!!!!!!!!
   * UPDATE DEFAULT VERSION 
   * BEFORE EVERY RELEASE
   * !!!!!!!!!!!!!!!!!!!!!
   */
  getVersion : function(){
    if ((Meteor.settings) && (Meteor.settings.version)){
      return Meteor.settings.version;
    } else {
      // update before release
      return '1.1.0-dev';
    }
  },

  /**
   * settings: 
   *   url initiating geoide-viewer configuration reload
   *   
   * @return [string] url to call after every form save action
   *    null if no value found in the settings file
   */
  getViewerReloadConfigUrl : function(){
    if (Meteor.settings && Meteor.settings.viewer && Meteor.settings.viewer.reloadConfigUrl){
      return Meteor.settings.viewer.reloadConfigUrl;
    } else {
      return null;
    }
  },

  /**
   * settings: 
   *   folder where uploaded legendGraphics are stored
   *   
   * @return [string] location of folder
   *   a default value is returned, 
   *   if this item is not found in the settings file
   */
  getLegendGraphicUploadFolder : function(){
    if (Meteor.settings && Meteor.settings.legendGraphic && Meteor.settings.legendGraphic.uploadFolder){
      return Meteor.settings.legendGraphic.uploadFolder;
    } else {
      return '/tmp/.uploads/';
    }
  },

  /**
   * settings: 
   *   delay of resetting WMS/WFS caches
   * @return [number] delay time in milliseconds
   *   a default value is returned, 
   *   if this item is not found in the settings file
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
   * Initiate geoide-viewer configuration reload 
   * by calling http get on url found in settings
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
    } else {
      return null;
    }
  }

});

/**
 * Set up for upload package tomi:upload-server 
 * (used for legendGraphics)
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
 * Make sure user 'idgis-admin' exists,
 * make one if needed. 
 * 
 * This user has implicit administrator role. 
 */
let adminUser = Meteor.users.findOne({username: 'idgis-admin'});
if (!adminUser){
  adminUser = Accounts.createUser({username:'idgis-admin', password:'koffie'});
  Meteor.users.update(adminUser);
}
