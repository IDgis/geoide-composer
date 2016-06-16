Layers = new Mongo.Collection("layers");

SimpleSchema.featuretype = new SimpleSchema ({
	label: {
		type: String,
		label: "Label"
	}, 
	service: {
		type: String,
		label: "Service"
	},
	name: {
		type: String,
		label: "Naam"
	}
})



SimpleSchema.servicelayer = new SimpleSchema ({
	label: {
		type: String,
		label: "Label"
	}, 
	service: {
		type: String,
		label: "Service",
		autoform: {
			type: 'select',
		}
			
	},
	name: {
		type: String,
		label: "Naam"
	}, 
	featureType: {
		type: SimpleSchema.featuretype,
		optional: true
	}
});


Layers.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: "Label"
	}, 
	layer_type: {
		type: String,
		label: "Type",
		allowedValues: ['default','cosurvey-sql'],
		autoform: {
		  type: 'select-radio-inline', 
		  defaultValue: "default",
		  options: function() {
	            return [{
	                label: "default",
	                value: "default",
	            }, {
	                label: "cosurvey-sql",
	                value: "cosurvey-sql",
	            }];
		  }
		}
	}, 
	service_layers: {
		type: [SimpleSchema.servicelayer],
		label: "Servicelagen",
		optional: true,
		autoform: {
			
		}		
	}, 

	state: {
		type: Object,
		label: "State"
	},
	'state.visible': {
		type: Boolean,
		optional: true,
		label: "Standaard zichtbaar"
	},
	'state.query': {
		type: String,
		optional: true,
	},
	
	properties:  {
		type: Object,
		label: "Properties"
	},
	'properties.applayer': {
		type: Boolean,
		optional: true,
		label: "CRS2 laag"
	}
}));

Layers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
});


