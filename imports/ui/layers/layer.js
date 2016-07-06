import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Services } from '/imports/api/collections/services.js';
import { Layers, LayerSchema } from '/imports/api/collections/layers.js';

import './layer.html';

Template.layer.helpers({
  /**
   * Retrieve a list of services options for a selectbox
   */
	services: function(){
		var serv = Services.find({},{fields:{name:1,_id:1}}).fetch();
		var servoptions = [];
		serv.forEach(function(entry) {
			servoptions.push({label:entry.name, value:entry._id});
		});
		return servoptions;
	},
	/**
	 * Find a specific service
	 */
  service: function(thisid){
    var serv = Services.find({_id: thisid}).fetch();
    return serv;
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
	     } else {
	        return null ;
	     }
	  },
	
});

fillLayerSelect = function() {
  var layers = Layers.find({}, {
    fields : {
      name : 1,
      _id : 1
    }
  }).fetch();
  layers.forEach(function(entry) {
    var layerOption = "<option value=" + entry._id + ">" + entry.name
        + "</option>"
    $('#layerselect').append(layerOption);
  });
};

Template.layer.events({
  /**
   *  When the Cancel button is pressed go to the layer list
   */
  'click #returnLayer': function () {
    console.log("clicked cancel layerform" );
    Router.go('layers.list');
  },
  /**
   * Fill a selectbox with layernames of a service
   * 1. listen to changes in the selectbox 'service' in servicelayer,
   * 2. get the service layers form the GetCapabilities
   * 3. and put the list in selectbox 'nameInService'
   */
  'change select[name$=".service"]' : function(e){
    console.log("clicked service select by name ");
    console.log(e);
    // TODO find service id, get its layers and show them in next element 'nameInService' options 
    // service id
    var serviceId = e.target.value;
    console.log("service id " + serviceId);
    Meteor.call('getService', serviceId
        , function(sError, sResponse) {
            if (sError) {
              console.log('getService Error ', sError);
            } else {
              // service found
              console.log('getService result ', sResponse);
              console.log('getService endpoint ', sResponse[0].endpoint);
              Meteor.call('getServiceLayers',
                  sResponse[0].endpoint
                  , function(lError, lResponse) {
                      if (lError) {
                        console.log('getServiceLayers Error ', lError);
                      } else {
                        // service layers found !!
                        console.log('getServiceLayers result ', lResponse);
                        // put it in options /  of nameInService
                        $.each(lResponse, function(count, obj) {   
                          // TODO this selects all elements with ".nameInService" in the name!!
                          // we only need to address the one next to selectbox 'service'
                          $('select[name$=".nameInService"] ')
                               .append($('<option>', { value : obj.name })
                               .text(obj.title)); 
                        });
//                        lResponse.forEach(function(entry) {
//                          var layerOption = "<option value=" + entry.name + ">" + entry.title
//                              + "</option>"
//                          $('select[name$=".nameInService"] ').append(layerOption);
//                        });

                      }
                    });
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
