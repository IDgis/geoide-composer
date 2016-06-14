Maps = new Mongo.Collection("maps");


Maps.attachSchema(new SimpleSchema({
	text: {
		type: String,
		label: "Label"
	}, 
	id: {
		type: String,
	}, 
	initial_extent: {
		type: [Number],
		label: "Initieel extent"
	}, 
	children: {
		type: [Object]
	}

}));

Maps.insert ({
	text:  "Afdelingen" ,
	id: 2,
	initial_extent: [
	1,1,1,1],
	children: [{text: "map-layers"},{text: "test2"}]
});

//map_layer Object bestaat uit layer, state en map_layers
//layer is verwijzing naar layer
//state is een Array van key-value pairs


Maps.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})