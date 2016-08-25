import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ServiceSchema = new SimpleSchema({
  name: {
    type: String,
    label: function(){ return i18n('collections.services.name.label'); },
    unique : true,
    regEx: /^([a-zA-Z0-9_\-]+)$/,
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
		regEx: /((http:|https:)\/\/[a-zA-Z0-9\.-]{2,}(:[0-9]{2,})?(\/)[a-zA-Z0-9\/\.](\?)?)/,
		//regex url was
		/*/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
	    */
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
  			if (this.type === 'WMS') {
  				return ["1.1.1","1.3.0"];
  			}
  			if (this.type === 'WFS') {
  				return ["1.0.0","1.1.0","2.0.0"];
  			} 
  			if (this.type === 'TMS') {
  				return ["1.0.0"];
  			}
	    },
	    // this does not seem to work
      "defaultValue": function() {
        if (this.type === 'WMS') {
          return "1.1.1";
        }
        if (this.type === 'WFS') {
          return "1.1.0";
        } 
        if (this.type === 'TMS') {
          return "1.0.0";
        }
      },
	    autoform: {
	      "title": function(){ return i18n ('tooltips.services.autoform.fields.version'); },
	      // this is added, because the default value does not work 
	      // after a value has already been selected
        "value": function() {
          var currentVersion = AutoForm.getFieldValue('version', 'serviceform');
          var currentType = AutoForm.getFieldValue('type', 'serviceform');
          if (currentType === 'WMS') {
            return (currentVersion)?((currentVersion === "1.3.0")?currentVersion:"1.1.1"):"1.1.1";
          } else if (currentType === 'WFS') {
            return (currentVersion)?((currentVersion === "1.0.0" | currentVersion === "2.0.0")?currentVersion:"1.1.0"):"1.1.0";
          } else if (currentType === 'TMS') {
            return "1.0.0";
          }
        },
        // this seems to work
        "defaultValue": function() {
          var currentType = AutoForm.getFieldValue('type', 'serviceform');
          if (currentType === 'WMS') {
            return "1.1.1";
          } else if (currentType === 'WFS') {
            return "1.1.0";
          } else if (currentType === 'TMS') {
            return "1.0.0";
          }
        },
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