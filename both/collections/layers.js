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
		label: "servicelagen"
	}, 
	state_visible: {
		type: Boolean
	},
	state_query: {
		type: String
	},
	property_applayer: {
		type: Boolean
	}
}));

Layers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})