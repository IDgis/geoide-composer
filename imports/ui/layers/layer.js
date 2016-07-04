import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';

import './layer.html';

Template.layer.helpers({
	selectedLayerDoc: function () {
		return Layers.findOne({_id: 'mhBkfxmNuNHrE3zMp'});
	},
	
	services: function(){
		var serv = Services.find({},{fields:{label:1,_id:1}}).fetch();
		var servoptions = [];
		serv.forEach(function(entry) {
			servoptions.push({label:entry.label, value:entry._id});
		});
		return servoptions;
	},
	
	  Layers: function () {
	    return Layers;
	  },
	
});

