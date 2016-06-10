Services = new Mongo.Collection("services");
Services.attachSchema(new SimpleSchema({
	label: {
			type: String,
			label: "Naam"
	},
	service_endpoint: {
		type: String,
		label: "Url"
	},
	service_type: {
		type: String,
		label: "Type",
		allowedValues: ["WMS", "WFS", "TMS"],
		autoform: {
            options: [
                {label: "WMS", value: "WMS"},
                {label: "TMS", value: "TMS"},
                {label: "WFS", value: "WFS"}
            ]
        }
	},
	version: {
		type: String,
		label: "Type"
	}
}));