Layers = new Mongo.Collection("layers");


Layers.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: "Label"
	}, 
	layer_type: {
		type: String,
		label: "Type"
	}, 
	service_layers: {
		type: [String],
		label: "servicelagen",
		optional: true
	}, 
	state_visible: {
		type: Boolean,
		optional: true,
		label: "Standaard zichtbaar"
	},
	state_query: {
		type: String,
		optional: true,
	},
	property_applayer: {
		type: Boolean,
		optional: true,
		label: "CRS2 laag"
	}
}));

Layers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})