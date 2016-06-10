ServiceLayers = new Mongo.Collection("servicelayers");
ServiceLayers.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: "Label"
	}, 
	name: {
		type: String,
		label: "Naam"
	}, 
	service: {
		type: String
	}
}));

ServiceLayers.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})