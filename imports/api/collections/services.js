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
 * A service contains 
 *   name: userdefined unique name of the service
 *   endpoint: valid url 
 *   type: can be 'WMS', 'TMS' or 'WFS'
 *   version: value depends on type, each type has a specific defaultvalue
 *   printFormat: preferred format for images in WMS getmap request  
 * 
 * This definition depends on the use of AutoForm
 * Reactivity is performed by AutoForm.getFieldValue()   
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
    // fix allowed versions
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
    // and therefore could be deleted altogether?
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
      // field value is added, because the defaultValue does not work 
      // after a value has already been selected:
      'value': function() {
        // depending on choices made in type and version, 
        // the current version or default version is returned
        const currentVersion = AutoForm.getFieldValue('version', 'serviceform');
        const currentType = AutoForm.getFieldValue('type', 'serviceform');
        let newVersionValue = currentVersion;
        if (currentType === 'WMS') {
          // 1.1.1. is default
          if (currentVersion !== '1.3.0'){
            newVersionValue = '1.1.1';
          }
        } else if (currentType === 'WFS') {
          // 1.1.0. is default
          if (currentVersion !== '1.0.0' && currentVersion !== '2.0.0'){
            newVersionValue = '1.1.0';
          }
        } else if (currentType === 'TMS') {
          newVersionValue = '1.0.0';
        } else {
          // should not get here
        }
        return newVersionValue;
      },
      // this works in a reactive way
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
  /*
   * Let the user choose a preferred format from the list of GetMap formats.
   * This value is used by Geoide-Viewer when performing a print.
   */
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
