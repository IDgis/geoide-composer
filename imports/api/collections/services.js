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
  endpoint: {
  	type: String,
  	label: function(){ return i18n('collections.services.endpoint.label'); },
    regEx: /^((http:|https:)\/\/[a-zA-Z0-9\.-]{2,}(:[0-9]{2,5})?(\/)(([a-zA-Z0-9_\-@:]+)(\/|\.)?){1,}([a-zA-Z0-9_\-@:]+)([\?]{0,1}))$/,
    autoform: {
      "title": function(){ return i18n ('tooltips.services.autoform.fields.endpoint'); },
    },
  },
  type: {
  	type: String,
  	label: function(){ return i18n('collections.services.type.label'); },
  	allowedValues: ['WMS', 'WFS', 'TMS'],
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
          return (currentVersion)?((currentVersion === "1.0.0" || currentVersion === "2.0.0")?currentVersion:"1.1.0"):"1.1.0";
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
	
  printFormat: {
    type: String,
    label: function(){ return i18n('collections.services.printFormat.label'); },
    optional: true,
    autoform: {
      options: function(){
        var host = AutoForm.getFieldValue(this.name.replace("printFormat", "endpoint"));
        var version = AutoForm.getFieldValue(this.name.replace("printFormat", "version"));
        /*
         * Fill the printFormat options list
         */
        var printFormatOptions = [];
        if (host){
          printFormatOptions = ReactiveMethod.call(
              'getPrintFormat',
              host,
              version
          );
        }
        return printFormatOptions;
      },    
      firstOption: function(){ return i18n('collections.firstOption'); },
      "title": function(){ return i18n ('tooltips.services.autoform.fields.printFormat'); },
      "defaultValue": function() {return "image/png"; },
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