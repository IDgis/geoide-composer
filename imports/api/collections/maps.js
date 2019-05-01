/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.messages({
  minxError: 'Minx kan niet groter dan of gelijk zijn aan Maxx',
  maxxError: 'Maxx kan niet kleiner dan of gelijk zijn aan Minx',
  minyError: 'Miny kan niet groter dan of gelijk zijn aan Maxy',
  maxyError: 'Maxy kan niet kleiner dan of gelijk zijn aan Miny',
});

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
      defaultValue: 0,
      label:  function(){ return i18n('collections.maps.initial_extent.minX.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.minx'); }
      },
      custom: function() {
        if (this.value >= this.field('initial_extent.maxx').value) {
          return 'minxError';
        }
      },
    },
    'miny': {
      type: Number,
      defaultValue: 300000,
      label: function(){ return i18n('collections.maps.initial_extent.minY.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.miny'); }
      },
      custom: function() {
        if (this.value >= this.field('initial_extent.maxy').value) {
          return 'minyError';
        }
      },
     },
    'maxx': {
      type: Number,
      defaultValue: 300000,
      label: function(){ return i18n('collections.maps.initial_extent.maxX.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.maxx'); }
      },
      custom: function() {
        if (this.value <= this.field('initial_extent.minx').value) {
          return 'maxxError';
        }
      },
    },
    'maxy':  {
      type: Number,
      defaultValue: 620000,
      label: function(){ return i18n('collections.maps.initial_extent.maxY.label'); },
      autoform: {
        'title': function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.maxy'); } 
      },
      custom: function() {
        if (this.value <= this.field('initial_extent.miny').value) {
          return 'maxyError';
        }
      },
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
  crs: {
    type: String,
    label: function(){ return i18n('collections.maps.crs.label'); },
    autoform: {
      // https://github.com/aldeed/meteor-autoform#affieldinput
      title: function(){ return i18n('tooltips.maps.autoform.fields.crs'); },
      afFieldInput: {
        type: 'select',
        firstOption: false,
        options: [
          { label: "Amersfoort / RD New - (EPSG:28992)", value: "EPSG:28992" },
          { label: "ETRS89 - (EPSG:4258)", value: "EPSG:4258" },
          { label: "Web Mercator - (EPSG:3857)", value: "EPSG:3857" },
          { label: "WGS84 - (EPSG:4326)", value: "EPSG:4326" }
        ],
        defaultValue: 'EPSG:28992',
      },
      template: 'bootstrap3-horizontal',
      'label-class': 'col-sm-4',
      'input-col-class': 'col-sm-6',
    },
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
