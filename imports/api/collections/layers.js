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
    autoform: {
      options:  []    
    }
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
  applayer: {
    type: Boolean,
    defaultValue: false,
    label: function(){ return i18n('collections.layers.properties.applayer.label'); },
  },
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
     },
  },  
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
    defaultValue: 'default',
    autoform: {
      "type": 'select-radio-inline',
    },
  }, 
  properties:  {
    type: SimpleSchema.layerProperties,
    label: function(){ return i18n('collections.layers.properties.label'); },
    minCount: 1,
    maxCount: 2,

  },
  service_layers: {
    type: [SimpleSchema.serviceLayer],
    label: function(){ return i18n('collections.layers.serviceLayers.label'); }, 
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
