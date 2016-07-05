import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Layers = new Mongo.Collection("layers");


Layers.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: function(){ return i18n('collections.layers.name.label'); },
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
	
}));

Layers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
});


SimpleSchema.layerProperties = new SimpleSchema ({
	initial_visible: {
		type: Boolean,
		optional: true,
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

SimpleSchema.serviceLayer = new SimpleSchema ({
	name: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.name.label'); },
	}, 
	//services_id WMS/TMS
	service: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.service.label'); },	
	},
	nameInService: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.nameInService.label'); },
	}, 
	featureType: {
		type: SimpleSchema.featureType,
		optional: true,
		label: function(){ return i18n('collections.layers.servicelayer.featureTypes.label'); },
	},
});

SimpleSchema.featureType = new SimpleSchema ({
	name: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.featureType.name.label'); },
	}, 
	//service_id WFS
	service: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.featureType.service.label'); },
	},
	nameInService: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.featureType.nameInService.label'); },
	},
	searchTemplatess: {
    	type: [SimpleSchema.searchTemplate],
    	label: function(){ return i18n('collections.layers.servicelayer.featureType.searchTemplates.label'); },
    	optional: true,
	},   
})


SimpleSchema.searchTemplate = new SimpleSchema ({
	label: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.featureType.searchTemplate.label.label'); },
	},
	attribute_localname : {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.featureType.searchTemplate.attribute_localname.label'); },
	},
	attibute_namespace: {
		type: String,
		label: function(){ return i18n('collections.layers.servicelayer.featureType.searchTemplate.attribute_namespace.label'); },
		optional: true
	}		
})






