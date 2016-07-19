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
    // get name of ft select box
    var srcName = e.target.name;
    console.log("Source: " + srcName);
    // get featuretype name 
    var srcSelect = $('select[name="' + srcName + '"] ');
    var ftName = srcSelect[0].value;

    // find service id from service selectbox
    var srvName = srcName.replace("nameInService", "service");
    var srvSelect = $('select[name="' + srvName + '"] ');
    var serviceId = srvSelect[0].value;

    // find searchtemplate localname selectboxes 
    var dstSelects = $('select[name$=attribute_localname] ');
    
    // find searchtemplate namespace fields 
    var nsInputs = $('input[name$=attibute_namespace] ');
    
    // retrieve fields and namespace from a featuretype
    // and put them in localname selectbox options resp namespace field
    Meteor.call('describeFeatureType',
      serviceId,
      ftName,
      function(lError, lResponse) {
        if (lError) {
          console.log(' Error ', lError);
        } else {
          // featuretype fields found !!
          console.log(' result ', lResponse);
          // fill all searchtemplate.namespace fields 
          $.each(nsInputs, function(count, ns){
            $(ns).val(lResponse.targetNamespace);
          });
          // fill all searchtemplate.localname options
          $.each(dstSelects, function(count, dstSelect){
            // empty select first (remove existing options)
            var len = dstSelect.length;
            for (var i = 0; i < len ; i++) {
              dstSelect.remove(0);
            }
            // then fill options with the fields found
            $.each(lResponse.options, function(count, obj) {   
              var option = document.createElement("option");
              option.text = obj.title;
              option.value = obj.name;
              dstSelect.add(option); 
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
 * This will be called after the form has been rendered.
 * Using the form data to fill in all the select options. 
 * 
 */
Template.layer.onRendered(function(){
  
  
  console.log("onRendered");
  console.log(this);
  var formData = this.data; // layer data belonging to this form
  
  if (formData){
    var serviceSelects = this.$('select[name$=".service"]');
    console.log(serviceSelects);
    
    $.each(serviceSelects, function(count, obj) {
      console.log('serviceSelect:');
      console.log(obj);
      // get name of service select and service id
      var selectName = obj.name;
      console.log('selectName ' + selectName);
      var serviceId = obj.value;
      console.log("service id " + serviceId);
      console.log('selectedIndex ' + obj.selectedIndex);
  
      // find nameInService selectbox below it (layerName, featuretype)
      var dstName = selectName.replace(".service", ".nameInService");
      console.log("Destination: " + dstName);
      var dstSelects = $('select[name="' + dstName + '"] ');
      console.log(dstSelects);
      var dstSelect = dstSelects[0];
      console.log(dstSelect);
  
    console.log("--------------");
    
    /*
     * Retrieve the layers or featuretypes from the service
     * and put them in the appropriate nameInService options
     */
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
                  sResponse[0].version,
                  function(lError, lResponse) {
                    if (lError) {
                      console.log(methodName + ' Error ', lError);
                    } else {
                      // service layers found !!
                      console.log(methodName + ' result ', lResponse);
                      // put it in options /  of nameInService
                      // empty select first (remove existing options)
                      var len = dstSelect.length;
                      for (var i = 0; i < len ; i++) {
                        dstSelect.remove(0);
                      }
                      // find the selected element
                      var name = dstSelect.name;
                      var subName = name.substr('service_layers.'.length,name.length);
                      var indexPoint = subName.indexOf('.');
                      var index = subName.substr(0,indexPoint);
                      console.log('name ' + name + ' index ' + index);
                      var selected = ''; // will not exist in real data
                      if (name.indexOf('.featureType.') > 0){
                        selected = formData.service_layers[index].featureType[0].nameInService;
                      } else {
                        selected = formData.service_layers[index].nameInService;
                      }
                      console.log('selected: ' + selected);
                      // then fill options with the fields found
                      $.each(lResponse, function(count, obj) {   
                        var option = document.createElement("option");
                        option.text = obj.title;
                        option.value = obj.name;
                        dstSelect.add(option); 
                        // set selectIndex if appropriate
                        if (selected == obj.name){
                          dstSelect.selectedIndex = count;
                          console.log('option select: ' + selected + ', index: ' + count);
                        } else {
                          console.log('option name  : ' + obj.name + ', index: ' + count);
                        }
                      });
                    }
                });
              }
            }
         });
    });
  }
});
/**/
 
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
