/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Definition of Map schema
 * 
 * A map contains layers and groups of layers
 * It also has a bounding box
 * 
 * This schema definition is closely related to the use of jstree as a tree component in the UI.
 * This definition also depends on the use of AutoForm  
 */

/*
 * Definition of MapLayerState
 * 
 * checked: if true then the layer is initially visible in a viewer
 */
SimpleSchema.mapLayerState = new SimpleSchema ({
  //mapLayer initial visible
  checked: {
    type: Boolean,
    optional: true,
    autoform: {
      'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_visible'); }
    }
  }
});

/*
 * Definition of MapLayerData
 * 
 * layerid: stored in the tree component
 */
SimpleSchema.mapLayerData = new SimpleSchema ({
  //id of layer is stored in data-attribute
  layerid: {
    type: String,
    optional: true
    
  }
});
/*
 * Definition of initialExtent (bounding box)
 * 
 * minx, miny, maxx, maxy: values and ranges are based on RD coordinates (EPSG:28992) 
 * validation on minx < maxx: see https://github.com/aldeed/meteor-simple-schema#custom-validation
 */
SimpleSchema.initialExtent = new SimpleSchema ({
    'minx': {
      type: Number,
      min: 0,
      max: 300000,
      defaultValue: 0,
      label:  function(){ return i18n('collections.maps.initial_extent.minX.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.minx'); }
      }
    },
    'miny': {
      type: Number,
      min: 300000,
      max: 620000,
      defaultValue: 300000,
      label: function(){ return i18n('collections.maps.initial_extent.minY.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.miny'); }
      }
     },
     'maxx': {
      type: Number,
      min: 0,
      max: 300000,
      defaultValue: 300000,
      label: function(){ return i18n('collections.maps.initial_extent.maxX.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.maxx'); }
      }
    },
    'maxy':  {
      type: Number,
       min: 300000,
       max: 620000,
       defaultValue: 620000,
       label: function(){ return i18n('collections.maps.initial_extent.maxY.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.maxy'); } 
      }
    }
});

/*
 * Definition of Map
 * 
 * text: is the name attribute, must be unique
 * label: userdefined description that can be shown in a viewer instead of name (text)
 * type: in tree (not relevant for viewerconfig)
 * initial_extent: bounding box
 * children:
 *   all levels of map groups/layers have been written out in this schema
 *   the behaviour is modelled out in code, for example: 
 *      a layer cannot have another layer as a child etc.
 *   members:
 *     id: in tree (not relevant for viewerconfig)
 *     text: layer name (overrules name in layerconfig)
 *     state: layer visibility
 *     type: in tree (not relevant for viewerconfig)
 *     data: layer id from mongo collection  
 *     
 *  Example of map structure:
 *  Map
 *   |-- layer 1
 *   |-- layer 2
 *   |-- group 1 
 *   |     |-- layer 1.1
 *   |     |-- layer 1.2
 *   |-- layer 3      
 *   |-- group 2 
 *   |     |-- group 2.1 
 *   |           |-- layer 2.1.1
 *   |           |-- layer 2.1.2
 *   |-- layer 4
 *               
 */
export const MapSchema= new SimpleSchema({
  //name of map
  text: {
    type: String,
    label: function(){ return i18n('collections.maps.name.label'); },
    unique: true,
    regEx: /^([a-zA-Z0-9_\-]+)$/,    
    autoform: {
      'title': function(){ return i18n ('tooltips.maps.autoform.fields.name'); }
    }
  }, 
  label: {
    type: String,
    label: function(){ return i18n('collections.maps.label.label'); },
    autoform: {
      'title': function(){ return i18n ('tooltips.maps.autoform.fields.label'); }
    }
  }, 
  
  type: {
    type: String,
    defaultValue: 'map'
  },
  initial_extent: {
    type: SimpleSchema.initialExtent,
    label: function(){ return i18n('collections.maps.initialExtent.label'); },
    optional: true,
    autoform: {
      'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.label'); }
    }
  },
  children: {
    type: [Object],
    optional: true
  },
  'children.$.id': {
        type: String,
        optional: true
    },
    'children.$.text': {
        type: String,
        optional: true
    },
    'children.$.state': {
      type: SimpleSchema.mapLayerState,
      optional: true
  },
    'children.$.type': {
        type: String,
        optional: true
    },
    'children.$.data': {
      type: SimpleSchema.mapLayerData,
      optional: true
    },
    'children.$.children': {
        type: [Object],
        optional: true
    },
    'children.$.children.$.id': {
         type: String,
         optional: true
     },
  'children.$.children.$.text': {
       type: String,
       optional: true
   },
   'children.$.children.$.state': {
     type: SimpleSchema.mapLayerState,
     optional: true
   },
  'children.$.children.$.type': {
     type: String,
     optional: true
   },
   'children.$.children.$.data': {
      type: SimpleSchema.mapLayerData,
      optional: true
    },
   'children.$.children.$.children': {
       type: [Object],
       optional: true
   },
  'children.$.children.$.children.$.id': {
       type: String,
       optional: true
   },
   'children.$.children.$.children.$.text': {
       type: String,
       optional: true
   },
   'children.$.children.$.children.$.state': {
     type: SimpleSchema.mapLayerState,
     optional: true
   },
   'children.$.children.$.children.$.type': {
     type: String,
     optional: true
   },
   'children.$.children.$.children.$.data': {
     type: SimpleSchema.mapLayerData,
       optional: true
   }
});

export const Maps = new Mongo.Collection('maps');
Maps.attachSchema(MapSchema);

/*
 * Manipulation of collection only allowed when user is logged in
 */
Maps.allow({
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
