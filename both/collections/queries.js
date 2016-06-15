Queries = new Mongo.Collection("queries");

Maps.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: "Label"
	}, 
	featuretype: {
		type: String,
		label: "FeatureType"
	},
	ftfield: {
		type: String,
		label: "FeatureType Property"
	}
}));