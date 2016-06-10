Maplayers = new Mongo.Collection("maplayers");


Maplayers.attachSchema(new SimpleSchema({
	layer: {
		type: String
	},
	map_layers: {
		type: [String]
	},
	state_visible: {
		type: Boolean
	},
	state_query: {
		type: String
	}
}));

//map_layer Object bestaat uit layer, state en map_layers
//layer is verwijzing naar layer
//state is een Array van key-value pairs

Maplayers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})