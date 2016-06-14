Maps = new Mongo.Collection("maps");


Maps.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: "Label"
	}, 
	initial_extent: {
		type: [Number],
		label: "Initieel extent"
	}, 
	map_layers: {
		type: [String]
	},
	map_queries: {
		type: [String]
	}

}));


//map_layer Object bestaat uit layer, state en map_layers
//layer is verwijzing naar layer
//state is een Array van key-value pairs


Maps.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})