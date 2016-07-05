import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
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

/**
 * When the Cancel button is pressed go to the layer list
 */
Template.layer.events({
  'click #returnLayer': function () {
    console.log("clicked cancel layerform" );
    Router.go('layers.list');
  },
  'change select[name$=".service"]' : function(e){
    console.log("clicked service select by name ");
    console.log(e);
    // TODO find service id, get its layers and show them in next element 'nameInService' options 
    Meteor.call('getServiceLayers',
        'http://acc-services.inspire-provincies.nl/ProtectedSites/services/view_PS' // host argument
        , function(error, response) {
            if (error) {
              console.log('getServiceLayers Error ', error);
            } else {
              console.log('getServiceLayers result ', response);
            }
         });
  },
});
 
/**
 * when the autoform is succesfully submitted, then go to the layer list
 */
AutoForm.addHooks('layerform',{
  onSuccess: function(formType, result) {
    console.log("submit layer autoform, goto list");
    Router.go('layers.list');
  },
  onError: function(formType, error){
    console.log("layer autoform error = " + error);
  }
});
