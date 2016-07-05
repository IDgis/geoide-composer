import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Services } from '/imports/api/collections/services.js';
import { Layers, LayerSchema } from '/imports/api/collections/layers.js';

import './layer.html';

Template.layer.helpers({
	services: function(){
		var serv = Services.find({},{fields:{label:1,_id:1}}).fetch();
		var servoptions = [];
		serv.forEach(function(entry) {
			servoptions.push({label:entry.label, value:entry._id});
		});
		return servoptions;
	},
	
	  /**
	   * Layers collection
	   */
	  layers: function(){
	    return Layers;
	  },
	  /**
	   * Layers schema
	   */
	  layerSchema: function(){
	    return LayerSchema;
	  },
	  formType: function () {
	    if (Session.get("selectedLayerId")) {
	        return "update";
	     } else {
	        return "insert";
	     }
	  },
	  layerDoc: function () {
	    if (Session.get("selectedLayerId")) {
	      return Layers.findOne({_id: Session.get("selectedLayerId")});
//	        return this;
	     } else {
	        return null ;
	     }
	  },
	
});

