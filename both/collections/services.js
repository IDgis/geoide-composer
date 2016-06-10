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
		allowedValues: ['WMS', 'WFS', 'TMS'],
		autoform: {
            options: [
                {label: "WMS", value: "WMS"},
                {label: "WFS", value: "WFS"},
                {label: "TMS", value: "TMS"}
            ]
        }
	},
	version: {
		type: String,
		label: "Version"
	}
}));

Services.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})