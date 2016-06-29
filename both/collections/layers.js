Layers = new Mongo.Collection("layers");

SimpleSchema.qName = new SimpleSchema ({
	localname: {
		type: String,
		label: "Naam"
	},
	namespace: {
		type: String,
		label: "Namespace",
		optional: true
	}
})

SimpleSchema.queryDescription = new SimpleSchema ({
	label: {
		type: String,
		label: "Label"
	},
	attribute : {
		type: SimpleSchema.qName,
		label: "Attribuutveld"
	}		
	
})

SimpleSchema.featureType = new SimpleSchema ({
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
	},
	queryDescriptions: {
	    	type: [SimpleSchema.queryDescription],
	    	label: "Zoekingangen",
	    	optional: true
	}   
})

SimpleSchema.serviceLayer = new SimpleSchema ({
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
		type: SimpleSchema.featureType,
		optional: true
	}
});

SimpleSchema.layerState = new SimpleSchema ({
	visible: {
		type: Boolean,
		optional: true,
		label: "Standaard zichtbaar"
	},
	query: {
		type: String,
		optional: true,
	},	
})

SimpleSchema.layerProperties = new SimpleSchema ({
	applayer: {
		type: Boolean,
		optional: true,
		label: "CRS2 laag"
	}
})

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
		type: [SimpleSchema.serviceLayer],
		label: "Servicelagen",
		optional: true,
		autoform: {
			
		}		
	}, 
	state: {
		type: SimpleSchema.layerState,
		label: "Toestand"
	},
	properties:  {
		type: SimpleSchema.layerProperties,
		label: "Extra Properties"
	}
	
}));

Layers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
});


