/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Definition of Service
 * 
 * A service contains a service url, a type of service and a version.
 * 
 * This definition depends on the use of AutoForm  
 */

/*
 * Definition of Service schema
 *   name: userdefined unique name of the service
 *   endpoint: valid url 
 *   type: can be 'WMS', 'TMS' or 'WFS'
 *   version: value depends on type, each type has a specific defaultvalue
 *   printFormat: preferred format for images in WMS getmap request  
 */
export const ServiceSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.services.name.label'); },
    unique : true,
    regEx: /^([a-zA-Z0-9_\-]+)$/,
    autoform: {
      'title': function(){ return i18n ('tooltips.services.autoform.fields.name'); }
    }
  },
  endpoint: {
    type: String,
    label: function(){ return i18n('collections.services.endpoint.label'); },
    regEx: /^((http:|https:)\/\/[a-zA-Z0-9\.-]{2,}(:[0-9]{2,5})?(\/)(([a-zA-Z0-9_\-@:]+)(\/|\.)?){1,}([a-zA-Z0-9_\-@:]+)([\?]{0,1}))$/,
    autoform: {
      'title': function(){ return i18n ('tooltips.services.autoform.fields.endpoint'); }
    }
  },
  type: {
    type: String,
    label: function(){ return i18n('collections.services.type.label'); },
    allowedValues: ['WMS', 'WFS', 'TMS'],
    autoform: {
      'title': function(){ return i18n ('tooltips.services.autoform.fields.type'); }
    }
  },
  version: {
    type: String,
    label: function(){ return i18n('collections.services.version.label'); },
    allowedValues: function() {
      if (this.type === 'WMS') {
        return ['1.1.1','1.3.0'];
      }
      if (this.type === 'WFS') {
        return ['1.0.0','1.1.0','2.0.0'];
      } 
      if (this.type === 'TMS') {
        return ['1.0.0'];
      }
    },
    // this does not seem to work reactively
    'defaultValue': function() {
      if (this.type === 'WMS') {
        return '1.1.1';
      }
      if (this.type === 'WFS') {
        return '1.1.0';
      } 
      if (this.type === 'TMS') {
        return '1.0.0';
      }
    },
    autoform: {
      'title': function(){ return i18n ('tooltips.services.autoform.fields.version'); },
      // this is added, because the default value does not work 
      // after a value has already been selected
      'value': function() {
        const currentVersion = AutoForm.getFieldValue('version', 'serviceform');
        const currentType = AutoForm.getFieldValue('type', 'serviceform');
        if (currentType === 'WMS') {
          // 1.1.1. is default
          if (currentVersion === '1.3.0'){
            return '1.3.0';
          } else {
            return '1.1.1';
          }
        } else if (currentType === 'WFS') {
          // 1.1.0. is default
          if (currentVersion === '1.0.0' || currentVersion === '2.0.0'){
            return currentVersion;
          } else {
            return '1.1.0';
          }
        } else if (currentType === 'TMS') {
          return '1.0.0';
        } else {
          // should not get here
          return currentVersion;
        }
      },
      // this seems to work reactively
      'defaultValue': function() {
        const currentType = AutoForm.getFieldValue('type', 'serviceform');
        if (currentType === 'WMS') {
          return '1.1.1';
        } else if (currentType === 'WFS') {
          return '1.1.0';
        } else if (currentType === 'TMS') {
          return '1.0.0';
        } else {
          // should not get here
          return '';
        }
      }
    }
  },
  
  printFormat: {
    type: String,
    label: function(){ return i18n('collections.services.printFormat.label'); },
    optional: true,
    autoform: {
      options: function(){
        const host = AutoForm.getFieldValue(this.name.replace('printFormat', 'endpoint'));
        const version = AutoForm.getFieldValue(this.name.replace('printFormat', 'version'));
        /*
         * Fill the printFormat options list
         */
        let printFormatOptions = [];
        if (host){
          printFormatOptions = ReactiveMethod.call(
              'getPrintFormat',
              host,
              version
          );
        }
        return printFormatOptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      'title': function(){ return i18n ('tooltips.services.autoform.fields.printFormat'); },
      'defaultValue': function() {return 'image/png'; }
    }
  }
});

export const Services = new Mongo.Collection('services');
Services.attachSchema(ServiceSchema);

/*
 * Manipulation of collection only allowed when user is logged in
 */
Services.allow({
    insert: function(userId) {
      return !! userId; 
    },
    update: function(userId) {
      return !! userId; 
    },
    remove: function(userId) {
      return !! userId; 
    }
});
