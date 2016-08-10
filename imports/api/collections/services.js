import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ServiceSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.services.name.label'); },
    unique : true,
    autoform: {
      "title": function(){ return i18n ('tooltips.services.autoform.fields.name'); },
    },
  },
  label: {
    type: String,
    label: function(){ return i18n('collections.services.label.label'); },
    autoform: {
      "title": function(){ return i18n ('tooltips.services.autoform.fields.label'); },
    },
  },
	endpoint: {
		type: String,
		label: function(){ return i18n('collections.services.endpoint.label'); },
    autoform: {
      "title": function(){ return i18n ('tooltips.services.autoform.fields.endpoint'); },
    },
	},
	type: {
		type: String,
		label: function(){ return i18n('collections.services.type.label'); },
		allowedValues: ['WMS', 'WFS', 'TMS'],
//		defaultValue: 'WMS',
    autoform: {
      "title": function(){ return i18n ('tooltips.services.autoform.fields.type'); },
    },
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
	    },
	    autoform: {
	      "title": function(){ return i18n ('tooltips.services.autoform.fields.version'); },
	    },
	},
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