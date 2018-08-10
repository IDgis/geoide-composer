/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Services } from '/imports/api/collections/services.js';
/**
 * Definition of Layers Collection.
 * 
 * Layer
 *   |-- ServiceLayer [0-5]
 *         |-- FeatureType [0-1]
 *               |-- SearchTemplate [0-3]
 * ServiceLayer is a layer from a WMS or TMS service [optional]
 * Featuretype is a featuretype from a WFS [optional]
 * SearchTemplate is a specific field of a featuretype [optional]
 * 
 * This definition depends on the use of AutoForm (aldeed:autoform).
 * Heavy use is being made of AutoForm reactivity in getFieldValue().
 * The number of nested serviceLayer and searchTemplates
 * has been limited, the UI can get very unresponsive otherwise.   
 */

 // Constants
 const scaleOptions = [
  {label: "750", value: 750},
  {label: "1500", value: 1500},
  {label: "2500", value: 2500},
  {label: "5000", value: 5000},
  {label: "7500", value: 7500},
  {label: "10000", value: 10000},
  {label: "25000", value: 25000},
  {label: "50000", value: 50000},
  {label: "100000", value: 100000},
  {label: "500000", value: 500000},
  {label: "1000000", value: 1000000},
  {label: "3000000", value: 3000000},
];

/*
 * Definition of schema searchTemplate
 * 
 * Searchtemplates can be used in a viewer to filter on featuretype properties 
 * label: user defined name of this filter
 * attribute_localname: name of a field in the featuretype
 * attribute_namespace: namespace of the field in the featuretype
 */
SimpleSchema.searchTemplate = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.label.label'); },
    optional: false,
    autoform: {
      'class': 'namelabel',
      /*
       * 'disabled' works reactive i.e. after the form is rendered
       * whereas optional, omit, hidden do not 
       */
      disabled: function() {
        return AutoForm.getFieldValue('type', 'layerform') === 'default';
      },
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.searchTemplate.label'); }
    }
  },
  attribute_localname : {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.attributeLocalname.label'); },
    autoform: {
      options: function(){
        const serviceField = this.name.substr(0, this.name.indexOf('searchTemplates')) + 'service';
        const service = AutoForm.getFieldValue(serviceField);
        const ftField = this.name.substr(0, this.name.indexOf('searchTemplates')) + 'nameInWfsService';
        const ftName = AutoForm.getFieldValue(ftField);
        /*
         * Fill the attribute_localname options list
         */
        let servoptions = [];
  
        if (service && ftName){
          /*
           * Retrieve the featuretype fields from the service
           * and put them in the options
           */
          const featuretypeFields = ReactiveMethod.call(
              'describeFeatureType',
              service,
              ftName
          );
          if (featuretypeFields){
            servoptions = featuretypeFields.options;
          }
        }
        return servoptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      /*
       * 'disabled' works reactive i.e. after the form is rendered
       * whereas optional, omit, hidden do not 
       */
      disabled: function() {
        return AutoForm.getFieldValue('type', 'layerform') === 'default';
      },
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.searchTemplate.attributeLocalname'); }
    }
  },
  attribute_namespace: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.attributeNamespace.label'); },
    autoform: {
      value: function(){
        const serviceField = this.name.substr(0, this.name.indexOf('searchTemplates')) + 'service';
        const service = AutoForm.getFieldValue(serviceField);
        const ftField = this.name.substr(0, this.name.indexOf('searchTemplates')) + 'nameInWfsService';
        const ftName = AutoForm.getFieldValue(ftField);
        let namespace = '';
  
        if (service && ftName){
          /*
           * Retrieve the featuretype targetNamespace from the service
           */
          const featuretypeFields = ReactiveMethod.call(
              'describeFeatureType',
              service,
              ftName
          );
          if (featuretypeFields){
            namespace = featuretypeFields.targetNamespace;
          }
        }
        return namespace;
      },    
      'class': 'namespace',
      'readonly': true,
      /*
       * 'disabled' works reactive i.e. after the form is rendered
       * whereas optional, omit, hidden do not 
       */
      disabled: function() {
        return AutoForm.getFieldValue('type', 'layerform') === 'default';
      },
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.searchTemplate.attibuteNamespace'); }
    }
  }
});

/*
 * Definition of featureType
 * 
 * label: user defined name
 * service: name of the WFS service for this featuretype
 * nameInWfsService: name of the featuretype
 * searchTemplates: list of searchTemplates based on properties of this featuretype 
 */
SimpleSchema.featureType = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.label.label'); },
    optional: false,
    autoform: {
      'class': 'namelabel',
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.featureType.label'); }
    }
  }, 
  //service_id WFS
  service: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.service.label'); },
    autoform: {
      options: 
        function(){
          const serv = Services.find({type:'WFS'},{fields:{name:1,_id:1}, sort:[['name', 'asc']]}).fetch();
          const servoptions = [];
          serv.forEach(function(entry) {
            servoptions.push({label:entry.name, value:entry._id});
          });
          return servoptions;
        },
        firstOption: function(){ return i18n('collections.firstOption'); },
        'title': function(){ return i18n ('tooltips.layers.autoform.fields.featureType.service'); }
    }
  },
  
  nameInWfsService: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.nameInService.label'); },
    autoform: {
      options: function(){
        const service = AutoForm.getFieldValue(this.name.replace('.nameInWfsService', '.service'));
        /*
         * Fill the nameInWfsService options list
         */
        let servoptions = [];

        if (service){
          const serv = Services.findOne({_id:service});
          /*
           * Retrieve the featuretypes from the service
           * and put them in the options
           */
          servoptions = ReactiveMethod.call(
              'getWfsFeatureTypes',
              serv.endpoint,
              serv.version
          );
        }
        return servoptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.featureType.nameInWfsService'); }
    }
  },
  searchTemplates: {
      type: [SimpleSchema.searchTemplate],
      label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplates.label'); },
      optional: true,
      minCount: 0,
      autoform: {
        type: function() {
          if (AutoForm.getFieldValue('type', 'layerform') === 'default') {
            return 'hidden';
          }
        },
        maxCount: function() {
          if (AutoForm.getFieldValue('type', 'layerform') === 'default') {
            return 0;
          } else {
            return 3;
          }
        },
        'title': function(){ return i18n ('tooltips.layers.autoform.fields.featureType.searchTemplates'); }
      }
  }   
});

/*
 * Definition of serviceLayer
 * 
 * label: userdefined name
 * service: name of the WMS or TMS service for this serviceLayer
 * nameInService: name of the layer in the service
 * maxScale: Maximum scale of the layer. Default: 3000000 (This corresponds with a zoom level of ~2.00)
 * minScale: Minimum scale of the layer. Default: 750 (zoom level of 14)
 * legendGraphic: name or url of an image that is used as a legendgraphic
 * featureType: optional featureType
*/

SimpleSchema.serviceLayer = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.label.label'); },
    optional: true,
    autoform: {
      'class': 'namelabel',
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.label'); }
    }
  }, 
  //services_id WMS/TMS
  service: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.service.label'); }, 
    autoform: {
      options: 
        function(){
          const serv = Services.find({type: {$in: ['WMS','TMS'] }},{fields:{name:1,_id:1}, sort:[['name', 'asc']]}).fetch();
          const servoptions = [];
          serv.forEach(function(entry) {
            servoptions.push({label:entry.name, value:entry._id});
          });
          return servoptions;
        },
        firstOption: function(){ return i18n('collections.firstOption'); },
        'title': function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.service'); }
    }
  },
  
  nameInService: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.nameInService.label'); },
    autoform: {
      options: function(){
        const service = AutoForm.getFieldValue(this.name.replace('.nameInService', '.service'));
        /*
         * Fill the nameInService options list
         */
        let servoptions = [];
        if (service){
          const serv = Services.findOne({_id:service});
          /*
           * Decide which method to call
           */
          let methodName = '';
          switch(serv.type) {
            case 'WMS':
                methodName = 'getWmsLayers';
                break;
            case 'TMS':
              methodName = 'getTmsLayers';
              break;
            default:
                // should never get here
              break;
          }
          /*
           * Retrieve the layers from the service
           * and put them in the options
           */
          servoptions = ReactiveMethod.call(
              methodName,
              serv.endpoint,
              serv.version
          );
        }
        return servoptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.nameInService'); }
    }
  },

  // scale works the other ways as zoom.
  // That's why min and max from scale corresponds to max and min respectivly of zoom
  maxScale: { // Should be higher the minScale
    type: Number,
    label: function(){ return i18n('collections.layers.serviceLayer.minZoom.label')+' '+i18n('scale'); },
    max: 12288000,
    min: 188,
    autoform: {
      options: Object.assign([], scaleOptions).reverse(), // reverse() works on the array, thus need to return a new array
      firstOption: false,
    },
  },

  minScale: { // Should be lower the maxScale
    type: Number,
    label: function(){ return i18n('collections.layers.serviceLayer.maxZoom.label')+' '+i18n('scale'); },
    max: 12288000,
    min: 188,
    autoform: {
      options: scaleOptions,
      firstOption: false,
    },
  },

  /*
   * This input uses a special defined type of input,
   * defined in ui/legendGraphic/legendGraph.js
   */
  legendGraphic: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.legendGraphic.label'); },
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'legendGraphicType'
      },
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.legendGraphic'); }
    }
  }, 
  
  featureType: {
    type: [SimpleSchema.featureType],
    label: function(){ return i18n('collections.layers.serviceLayer.featureTypes.label'); },
    optional: true,
    minCount: 0,
    maxCount: 1,
    autoform: {
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.featureType'); }
    }
  }
});

/*
 * Definition of layer properties
 * 
 * initial_query: optional query belonging to this layer
 *   defined when layer.type is 'cosurvey-sql'
 *   disabled when layer.type is 'default'
 */
SimpleSchema.layerProperties = new SimpleSchema ({
  initial_query: {
    type: String,
     label: function(){ return i18n('collections.layers.properties.initialQuery.label'); },
     optional: true,
     autoform: {
       /*
        * 'disabled' works reactive i.e. after the form is rendered
        * whereas optional, omit, hidden do not 
        */
       disabled: function() {
         return AutoForm.getFieldValue('type', 'layerform') === 'default';
       },
       'type': 'textarea',
       'class': 'initquery',
       'title': function(){ return i18n ('tooltips.layers.autoform.fields.properties.initialQuery'); }
     }
  }  
});

/*
 * Definition of root element Layer
 * 
 * name: unique userdefined name
 * label: userdefined label as it can appear in a viewer
 * type: ['default', 'cosurvey-sql']
 * properties: optional, holding query when type is cosurvey-sql
 * service_layers: list of optional serviceLayers
 */
export const LayerSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.layers.name.label'); },
    unique: true,
    regEx: /^([a-zA-Z0-9_\-]+)$/,
    autoform: {
      'class': 'namelabel',
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.name'); }
    }
  }, 
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.label.label'); },
    autoform: {
      'class': 'namelabel',
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.label'); }
    }
  }, 
  type: {
    type: String,
    label: function(){ return i18n('collections.layers.type.label'); },
    allowedValues: ['default','cosurvey-sql'],
    defaultValue: 'default',
    autoform: {
      'type': 'select-radio-inline',
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.type'); }
    }
  }, 
  properties:  {
    type: SimpleSchema.layerProperties,
    label: function(){ return i18n('collections.layers.properties.label'); },
    optional: true,
    autoform: {
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.properties.main'); }
    }
  },
  service_layers: {
    type: [SimpleSchema.serviceLayer],
    label: function(){ return i18n('collections.layers.serviceLayers.label'); },
    optional: true,
    minCount: 0,
    maxCount: 5,
    autoform: {
      'title': function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.main'); }
    }
  }
  
});

export const Layers = new Mongo.Collection('layers');
Layers.attachSchema(LayerSchema);

/*
 * Collection manipulation is only allowed when a user is logged in.
 */
Layers.allow({
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
