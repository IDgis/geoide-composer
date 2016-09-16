import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Services } from '/imports/api/collections/services.js';

SimpleSchema.searchTemplate = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.label.label'); },
    optional: false,
    autoform: {
      "class": 'namelabel',
      /*
       * 'disabled' works reactive i.e. after the form is rendered
       * whereas optional, omit, hidden do not 
       */
      disabled: function() {
        if (AutoForm.getFieldValue('type', 'layerform') == 'default') {
          return true;
        } else {
          return false;
        }
      },
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.searchTemplate.label'); },
    },
  },
  attribute_localname : {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.attributeLocalname.label'); },
    autoform: {
      options:  [],
      /*
       * 'disabled' works reactive i.e. after the form is rendered
       * whereas optional, omit, hidden do not 
       */
      disabled: function() {
        if (AutoForm.getFieldValue('type', 'layerform') == 'default') {
          return true;
        } else {
          return false;
        }
      },
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.searchTemplate.attributeLocalname'); },
    },
  },
  attibute_namespace: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.attributeNamespace.label'); },
    autoform: {
      "class": 'namespace',
      "readonly": true,
      /*
       * 'disabled' works reactive i.e. after the form is rendered
       * whereas optional, omit, hidden do not 
       */
      disabled: function() {
        if (AutoForm.getFieldValue('type', 'layerform') == 'default') {
          return true;
        } else {
          return false;
        }
      },
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.searchTemplate.attibuteNamespace'); },
    },
  },		
});

SimpleSchema.featureType = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.label.label'); },
    optional: false,
    autoform: {
      "class": 'namelabel',
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.featureType.label'); },
    },
  }, 
	//service_id WFS
	service: {
		type: String,
		label: function(){ return i18n('collections.layers.serviceLayer.featureType.service.label'); },
    autoform: {
      options: 
        function(){
          var serv = Services.find({type:"WFS"},{fields:{name:1,_id:1}, sort:[["name", "asc"]]}).fetch();
          var servoptions = [];
          serv.forEach(function(entry) {
            servoptions.push({label:entry.name, value:entry._id});
          });
          return servoptions;
        },
        firstOption: function(){ return i18n('collections.firstOption'); },
        "title": function(){ return i18n ('tooltips.layers.autoform.fields.featureType.service'); },
    },
	},
	
	nameInWfsService: {
		type: String,
		label: function(){ return i18n('collections.layers.serviceLayer.featureType.nameInService.label'); },
    autoform: {
      options: function(){
        console.log("nameInWfsService name", this.name);
        var service = AutoForm.getFieldValue(this.name.replace(".nameInWfsService", ".service"));
        console.log("nameInWfsService service", service);
        var servoptions = [];

        if (service){
          var serv = Services.findOne({_id:service});
          console.log("Found service in DB", serv);
          /*
           * Retrieve the featuretypes from the service
           * and put them in the options
           */
          var featuretypeoptions = ReactiveMethod.call(
              'getWfsFeatureTypes',
              serv.endpoint,
              serv.version
          );
          _.each(featuretypeoptions, function(ft){
            servoptions.push({label:ft.title, value:ft.name});            
          });
        }
        console.log("return options",servoptions);
        return servoptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.featureType.nameInWfsService'); },
    },
	},
	searchTemplates: {
    	type: [SimpleSchema.searchTemplate],
    	label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplates.label'); },
      optional: true,
      minCount: 0,
//      maxCount: 3,
      autoform: {
        type: function() {
          if (AutoForm.getFieldValue('type', 'layerform') == 'default') {
            return "hidden";
          }
        },
        maxCount: function() {
          if (AutoForm.getFieldValue('type', 'layerform') == 'default') {
            return 0;
          } else {
            return 3;
          }
        },
        "title": function(){ return i18n ('tooltips.layers.autoform.fields.featureType.searchTemplates'); },
      },
	},   
});

SimpleSchema.serviceLayer = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.label.label'); },
    optional: true,
    autoform: {
      "class": 'namelabel',
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.label'); },
    },
  }, 
  //services_id WMS/TMS
  service: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.service.label'); }, 
    autoform: {
      options: 
        function(){
          var serv = Services.find({type: {$in: ["WMS","TMS"] }},{fields:{name:1,_id:1}, sort:[["name", "asc"]]}).fetch();
          var servoptions = [];
          serv.forEach(function(entry) {
            servoptions.push({label:entry.name, value:entry._id});
          });
          return servoptions;
        },
        firstOption: function(){ return i18n('collections.firstOption'); },
        "title": function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.service'); },
    },
  },
  
  nameInService: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.nameInService.label'); },
    autoform: {
      options: function(){
        var service = AutoForm.getFieldValue(this.name.replace(".nameInService", ".service"));
        console.log("nameInService service", service);

        /*
         * Fill the nameInService options list
         */
        var servoptions = [];
        if (service){
          var serv = Services.findOne({_id:service});
          console.log("Found service in DB", serv);
          /*
           * Retrieve the layers from the service
           * and put them in the options
           */
          var methodName = '';
          switch(serv.type) {
            case 'WMS':
                methodName = 'getWmsLayers';
                break;
            case 'TMS':
              methodName = 'getTmsLayers';
              break;
          }
          var layeroptions = ReactiveMethod.call(
              methodName,
              serv.endpoint,
              serv.version
          );
          _.each(layeroptions, function(layer){
            servoptions.push({label:layer.title, value:layer.name});            
          });
        }
        console.log("return options",servoptions);
        return servoptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.nameInService'); },
    },
  }, 
  
  legendGraphic: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.legendGraphic.label'); },
    optional: true,
    autoform: {
      afFieldInput: {
        type: "legendGraphicType"
      },
      "value": function(){
        var lg = '';
        var lyrName =  AutoForm.getFieldValue(this.name.replace(".legendGraphic", ".nameInService"));
//        console.log("legendGraphic lyrName", lyrName);
        if (lyrName){
          var service = AutoForm.getFieldValue(this.name.replace(".legendGraphic", ".service"));
//        console.log("legendGraphic service", service);
          if (service){
            var lgUrl = ReactiveMethod.call('getLegendGraphicUrl',
                service,
                lyrName,
            );
            if (lgUrl){
              lg = lgUrl;
            }
          }
        }
        console.log("legendGraphic", lg);
        return lg;
      },

      "title": function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.legendGraphic'); },
    },
  }, 
  
  featureType: {
    type: [SimpleSchema.featureType],
    label: function(){ return i18n('collections.layers.serviceLayer.featureTypes.label'); },
    optional: true,
    minCount: 0,
    maxCount: 1,
    autoform: {
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.featureType'); },
    },
  },
});

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
         if (AutoForm.getFieldValue('type', 'layerform') == 'default') {
           return true;
         } else {
           return false;
         }
       },
       "type": 'textarea',
       "class": 'initquery',
       "title": function(){ return i18n ('tooltips.layers.autoform.fields.properties.initialQuery'); },
     },
  },  
})

export const LayerSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.layers.name.label'); },
    unique: true,
    regEx: /^([a-zA-Z0-9_\-]+)$/,
    autoform: {
      "class": 'namelabel',
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.name'); },
    },
  }, 
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.label.label'); },
    autoform: {
      "class": 'namelabel',
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.label'); },
    },
  }, 
  type: {
    type: String,
    label: function(){ return i18n('collections.layers.type.label'); },
    allowedValues: ['default','cosurvey-sql'],
    defaultValue: 'default',
    autoform: {
      "type": 'select-radio-inline',
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.type'); },
    },
  }, 
  properties:  {
    type: SimpleSchema.layerProperties,
    label: function(){ return i18n('collections.layers.properties.label'); },
    optional: true,
    autoform: {
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.properties.main'); },
    },
  },
  service_layers: {
    type: [SimpleSchema.serviceLayer],
    label: function(){ return i18n('collections.layers.serviceLayers.label'); },
    optional: true,
    minCount: 0,
    maxCount: 5,
    autoform: {
      "title": function(){ return i18n ('tooltips.layers.autoform.fields.serviceLayers.main'); },
    },
  }, 
  
});

export const Layers = new Mongo.Collection("layers");
Layers.attachSchema(LayerSchema);

Layers.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  },
  update: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  },
  remove: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  }
});
