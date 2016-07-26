import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ServiceSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.services.name.label'); },
    unique : true,
  },
  label: {
    type: String,
    label: function(){ return i18n('collections.services.label.label'); },
  },
	endpoint: {
		type: String,
		label: function(){ return i18n('collections.services.endpoint.label'); }
	},
	type: {
		type: String,
		label: function(){ return i18n('collections.services.type.label'); },
		allowedValues: ['WMS', 'WFS', 'TMS'],
//		defaultValue: 'WMS',
	},
	version: {
	    type: String,
	    label: function(){ return i18n('collections.services.version.label'); },
	    allowedValues: function() {
  			if (this.type==='WMS') {
  				return ["1.1.1","1.3.0"];
  			}
  			if (this.type==='WFS') {
  				return ["1.0.0","1.1.0","2.0.0"];
  			} 
  			if (this.type==='TMS') {
  				return ["1.0.0"];
  			}
	    }
	}
});

export const Services = new Mongo.Collection("services");
Services.attachSchema(ServiceSchema);
 
Services.allow({
	  insert: function(userId, doc) {
	    // only allow posting if you are logged in
	    return !! userId; 
	  },
	  update: function(userId, doc) {
	    // only allow posting if you are logged in
	    return !! userId; 
	  },
	  remove: function(userId, doc) {
	    // only allow posting if you are logged in
	    return !! userId; 
	  }
});