import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Services } from '/imports/api/collections/services.js';

SimpleSchema.searchTemplate = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.service_layer.featureType.searchTemplate.label.label'); },
  },
  attribute_localname : {
    type: String,
    label: function(){ return i18n('collections.layers.service_layer.featureType.searchTemplate.attribute_localname.label'); },
  },
  attibute_namespace: {
    type: String,
    label: function(){ return i18n('collections.layers.service_layer.featureType.searchTemplate.attribute_namespace.label'); },
    optional: true
  }		
});

SimpleSchema.featureType = new SimpleSchema ({
	name: {
		type: String,
		label: function(){ return i18n('collections.layers.service_layer.featureType.name.label'); },
	}, 
	//service_id WFS
	service: {
		type: String,
		label: function(){ return i18n('collections.layers.service_layer.featureType.service.label'); },
    autoform: {
      options: 
        function(){
          var serv = Services.find({type:"WFS"},{fields:{name:1,_id:1}}).fetch();
          var servoptions = [];
          serv.forEach(function(entry) {
            servoptions.push({label:entry.name, value:entry._id});
          });
          return servoptions;
        }
    }
	},
	nameInService: {
		type: String,
		label: function(){ return i18n('collections.layers.service_layer.featureType.nameInService.label'); },
    autoform: {
      options:  []    
    }
	},
	searchTemplates: {
    	type: [SimpleSchema.searchTemplate],
    	label: function(){ return i18n('collections.layers.service_layer.featureType.searchTemplates.label'); },
    	optional: true,
	},   
});

SimpleSchema.serviceLayer = new SimpleSchema ({
  name: {
    type: String,
    label: function(){ return i18n('collections.layers.service_layer.name.label'); },
  }, 
  //services_id WMS/TMS
  service: {
    type: String,
    label: function(){ return i18n('collections.layers.service_layer.service.label'); }, 
//    allowedValues:  ['service1', 'WMS'],
    autoform: {
      options: 
        function(){
          var serv = Services.find({type: {$in: ["WMS","TMS"] }},{fields:{name:1,_id:1}}).fetch();
          var servoptions = [];
          serv.forEach(function(entry) {
            servoptions.push({label:entry.name, value:entry._id});
          });
          return servoptions;
        }
    }
  },
  nameInService: {
    type: String,
    label: function(){ return i18n('collections.layers.service_layer.nameInService.label'); },
  }, 
  
  chooseLayer: {
    type: String,
    optional: true,
    label: function(){ return i18n('collections.layers.service_layer.chooseLayer.label'); },
    autoform: {
      afFieldInput: {
        type: "button",
        text: '...',
      }
    }
  },
  
  featureType: {
    type: SimpleSchema.featureType,
    optional: true,
    label: function(){ return i18n('collections.layers.servicelayer.featureTypes.label'); },
  },
});

SimpleSchema.layerProperties = new SimpleSchema ({
  initial_visible: {
    type: Boolean,
    defaultValue: false,
    label: function(){ return i18n('collections.layers.properties.initial_visible.label'); },
  },
  initial_query: {
    type: String,
    optional: function() {
      if (this.type==='cosurvey-sql') {
        return false;
      } else {
        return true;
      } 
     },
     label: function(){ return i18n('collections.layers.properties.initial_query.label'); },
  },  
  applayer: {
    type: Boolean,
    defaultValue: false,
    label: function(){ return i18n('collections.layers.properties.applayer.label'); },
  }
})

export const LayerSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.layers.name.label'); },
    unique: true,
  }, 
  type: {
    type: String,
    label: function(){ return i18n('collections.layers.type.label'); },
    allowedValues: ['default','cosurvey-sql'],
  }, 
  service_layers: {
    type: [SimpleSchema.serviceLayer],
    label: function(){ return i18n('collections.layers.service_layers.label'); }, 
  }, 
  properties:  {
    type: SimpleSchema.layerProperties,
    label: function(){ return i18n('collections.layers.properties.label'); },
  }
  
});

export const Layers = new Mongo.Collection("layers");
Layers.attachSchema(LayerSchema);

Layers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
});
