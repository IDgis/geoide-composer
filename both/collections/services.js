Services = new Mongo.Collection("services");
Services.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: function(){ return i18n('collections.services.name.label'); }
	},
	endpoint: {
		type: String,
		label: function(){ return i18n('collections.services.endpoint.label'); }
	},
	type: {
		type: String,
		label: function(){ return i18n('collections.services.type.label'); },
		allowedValues: ['WMS', 'WFS', 'TMS'],
		defaultValue: 'WMS',
	},
	version: {
	    type: String,
	    label: function(){ return i18n('collections.services.version.label'); },
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