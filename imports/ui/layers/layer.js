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
	  layerTypes: function () {
	    return[{label: "default", value: "default"},
	           {label: "cosurvey-sql", value: "cosurvey-sql"}];
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
  'change select[name$=".service"]' : function(e){
    console.log("change on service select ");
    console.log(e);
  },
  'change select[name$="featureType.0.nameInService"]' : function(e){
    console.log("change on featureType select ");
    console.log(e);
    // get name of ft select
    var srcName = e.target.name;
//    service_layers.0.featureType.0.nameInService
//    service_layers.0.featureType.0.searchTemplates.0.attribute_localname
    console.log("Source: " + srcName);
    var srcSelect = $('select[name="' + srcName + '"] ');
//    console.log(srcSelect);
    var ftName = srcSelect[0].value;
//    console.log("FeatureType Name " + ftName);

    // find searchtemplate localname selectbox 
    var dstName = srcName.replace("nameInService", "searchTemplates.0.attribute_localname");
//    console.log("Destination: " + dstName);
//    var dstSelect = $('select[name="' + dstName + '"] ');
    var dstSelects = $('select[name$=attribute_localname] ');
    console.log(dstSelects);

    // find service id from service selectbox
    var srvName = srcName.replace("nameInService", "service");
//    console.log("Service: " + srvName);
    var srvSelect = $('select[name="' + srvName + '"] ');
//    console.log(srvSelect);
    var serviceId = srvSelect[0].value;
//    console.log("service id " + serviceId);

    // find targetnamespace 
//    var nsName = srcName.replace("nameInService", "searchTemplates.0.attibute_namespace");
//    console.log("nsInput " + nsName);
//    var nsInput = $('input[name="' + nsName + '"] ');
    var nsInputs = $('input[name$=attibute_namespace] ');
    console.log(nsInputs);
    
    Meteor.call('describeFeatureType',
        serviceId,
        ftName
        , function(lError, lResponse) {
            if (lError) {
              console.log(' Error ', lError);
            } else {
              // service layers found !!
              console.log(' result ', lResponse);
              // put it in options /  of nameInService
//              $(nsInput).val(lResponse.targetNamespace);
              $.each(nsInputs, function(count, ns){
                $(ns).val(lResponse.targetNamespace);
              });
              $.each(dstSelects, function(count, dstSelect){
                dstSelect.empty();
                $.each(lResponse.options, function(count, obj) {   
                  dstSelect.append($('<option>', { value : obj.name }).text(obj.title)); 
                });
              });
            }
    });
     
  },
  'click select[name$=".service"]' : function(e){
    console.log("clicked on service select ");
    console.log(e);
  },
  /**
   * Fill a selectbox with layernames of a service
   * 1. listen to click on button near the selectbox 'service' in servicelayer,
   * 2. get the service layers from the GetCapabilities of the selected service
   * 3. and put the layer list in selectbox 'nameInService'
   */
  'click input[name$="selectButton"]' : function(e){
    console.log("clicked select button");
    console.log(e);
    // get name of button
    var buttonName = e.target.name;
//     find select listbox above it (source of serviceId)
    var srcName = buttonName.replace("selectButton", "service");
    console.log("Source: " + srcName);
    var srcSelect = $('select[name="' + srcName + '"] ');
    console.log(srcSelect);
    // and the field input below it (destination of layerName)
    var dstName = buttonName.replace("selectButton", "nameInService");
    console.log("Destination: " + dstName);
    var dstSelect = $('select[name="' + dstName + '"] ');
    console.log(dstSelect);
    // TODO find service id, get its layers and show them in next element 'nameInService' options 

    var serviceId = srcSelect[0].value;
    console.log("service id " + serviceId);
    Meteor.call('getService', serviceId
        , function(sError, sResponse) {
            if (sError) {
              console.log('getService Error ', sError);
            } else {
              // service found
              console.log('getService result ', sResponse);
              console.log('getService endpoint ', sResponse[0].endpoint);
              var methodName = '';
              switch(sResponse[0].type) {
                case 'WMS':
                    methodName = 'getWmsLayers';
                    break;
                case 'TMS':
                  methodName = 'getTmsLayers';
                  break;
                case 'WFS':
                  methodName = 'getWfsFeatureTypes';
                  break;
                default:
                  methodName = '';
              }
              if (methodName == ''){
                // error
              } else {
                  Meteor.call(methodName,
                      sResponse[0].endpoint,
                      sResponse[0].version
                      , function(lError, lResponse) {
                          if (lError) {
                            console.log(methodName + ' Error ', lError);
                          } else {
                            // service layers found !!
                            console.log(methodName + ' result ', lResponse);
                            // put it in options /  of nameInService
                            dstSelect.empty();
                            $.each(lResponse, function(count, obj) {   
                              dstSelect.append($('<option>', { value : obj.name }).text(obj.title)); 
                            });
    //                        lResponse.forEach(function(entry) {
    //                          var layerOption = "<option value=" + entry.name + ">" + entry.title
    //                              + "</option>"
    //                          $('select[name$=".nameInService"] ').append(layerOption);
    //                        });
    
                          }
                  });
              }
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
  },
  onRendered: function(formType, error){
    console.log("layer autoform rendered= " + formType);
  }
});
