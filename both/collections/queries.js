Queries = new Mongo.Collection("queries");
//wfs service
//ft property label

Queries.attachSchema(new SimpleSchema({
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