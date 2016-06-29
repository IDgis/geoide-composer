Services = new Mongo.Collection("services");
Services.attachSchema(new SimpleSchema({
	label: {
		type: String,
		label: "Naam",
			autoform: {
				
			}
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
	    autoform: {
    	type: 'select-radio-inline', 
		  options: function() {
			  if (this.service_type==='WMS') {
				  return [{
		                label: "1.1.1",
		                value: "1.1.1",
		            },{
		            	label: "1.3.0",
		                value: "1.3.0",
		            }] 
			  }
			  if (this.service_type==='WFS') {
				  return [{
		                label: "1.0.0",
		                value: "1.0.0",
		            },{
		                label: "1.1.0",
		                value: "1.1.0",
		            },{
		                label: "2.0.0",
		                value: "2.0.0",
		            }] 
			  } if (this.service_type==='TMS') {
				  return [{
		                label: "1.0.0",
		                value: "1.0.0",
		            }] 
			  }
		  }
		  
	   }
	}
}));

Services.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})