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
      defaultValue: 'WMS',
      afFieldInput: {type: 'select-radio-inline'},
	  }
	},
	version: {
    type: String,
    label: "Version",
    allowedValues: ['1', '2', '3', '4', '5', '6', '7' ],
	}
}));

Services.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})