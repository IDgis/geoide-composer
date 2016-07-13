import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Services } from '/imports/api/collections/services.js';

SimpleSchema.searchTemplate = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.label.label'); },
  },
  attribute_localname : {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.attributeLocalname.label'); },
  },
  attibute_namespace: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplate.attributeNamespace.label'); },
  }		
});

SimpleSchema.featureType = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.featureType.label.label'); },
  }, 
	//service_id WFS
	service: {
		type: String,
		label: function(){ return i18n('collections.layers.serviceLayer.featureType.service.label'); },
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
    },
	},
	
  selectButton: {
    type: String,
    label: ' ',
    autoform: {
      afFieldInput: {
        type: "button",
        defaultValue: function(){ return i18n('collections.layers.serviceLayer.featureType.selectButton.label'); },
        class: 'btn btn-warning'
      }
    }
  },
  
	nameInService: {
		type: String,
		label: function(){ return i18n('collections.layers.serviceLayer.featureType.nameInService.label'); },
    autoform: {
      options:  []    
    }
	},
	searchTemplates: {
    	type: [SimpleSchema.searchTemplate],
    	label: function(){ return i18n('collections.layers.serviceLayer.featureType.searchTemplates.label'); },
      optional: true,
      minCount: 0,
      maxCount: 5,
	},   
});

SimpleSchema.serviceLayer = new SimpleSchema ({
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.label.label'); },
  }, 
  //services_id WMS/TMS
  service: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.service.label'); }, 
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
  
  selectButton: {
    type: String,
    label: ' ',
    autoform: {
      afFieldInput: {
        type: "button",
        defaultValue: function(){ return i18n('collections.layers.serviceLayer.selectButton.label'); },
        class: 'btn btn-warning'
      }
    }
  },
  nameInService: {
    type: String,
    label: function(){ return i18n('collections.layers.serviceLayer.nameInService.label'); },
    autoform: {
      options:  []    
    }
  }, 
  
  featureType: {
    type: [SimpleSchema.featureType],
    label: function(){ return i18n('collections.layers.servicelayer.featureTypes.label'); },
    optional: true,
    minCount: 0,
    maxCount: 1,
  },
});

SimpleSchema.layerProperties = new SimpleSchema ({
  initial_visible: {
    type: Boolean,
    defaultValue: false,
    label: function(){ return i18n('collections.layers.properties.initialVisible.label'); },
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
     label: function(){ return i18n('collections.layers.properties.initialQuery.label'); },
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
  label: {
    type: String,
    label: function(){ return i18n('collections.layers.label.label'); },
  }, 
  type: {
    type: String,
    label: function(){ return i18n('collections.layers.type.label'); },
    allowedValues: ['default','cosurvey-sql'],
  }, 
  service_layers: {
    type: [SimpleSchema.serviceLayer],
    label: function(){ return i18n('collections.layers.serviceLayers.label'); }, 
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
