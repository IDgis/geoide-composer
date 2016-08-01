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
	
	  adminLoggedIn: function(){
      var admin = false; 
      if (Meteor.user()){
        // a user is logged in
        var name = Meteor.user().username;
        admin = _.isEqual(name, 'idgis-admin');
        return admin;
      }
      return false;
	  },
	  buttonSubmitLabel: function(){
	    return i18n ('button.save');
	  }
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
   * Fill a selectbox with featuretype attributes 
   * 1. listen to change on selectbox nameInService,
   * 2. get the attributes from the describeFeatureType of the selected wfs service
   * 3. and put the attribute list in selectbox 'attribute localname'
   */
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
    var attrSelects = $('select[name$=attribute_localname] ');
    
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
          $.each(attrSelects, function(count, attrSelect){
            // empty select first (remove existing options)
            var len = attrSelect.length;
            for (var i = 0; i < len ; i++) {
              attrSelect.remove(0);
            }
            // then fill options with the fields found
            $.each(lResponse.options, function(count, obj) {   
              var option = document.createElement("option");
              option.text = obj.title;
              option.value = obj.name;
              attrSelect.add(option); 
            });
          });
        }
    });
     
  },
  /**
   * Fill selectbox 'nameInService' with layer or featuretype names of a service
   * 1. listen to change on selectbox 'service' in servicelayer/featuretype,
   * 2. get the service layers/featuretypes from the GetCapabilities of the selected service
   * 3. and put the layer/featuretype list in selectbox 'nameInService'
   */
    'change select[name$=".service"]' : function(e){
    console.log(e);
    // get the name of service selectbox
    var srcName = e.target.name;
    console.log("changed select box " + srcName);
    var srcSelect = $('select[name="' + srcName + '"] ');
    console.log(srcSelect);
    // get the name of the nameInService selectbox 
    var dstName = srcName.replace(".service", ".nameInService");
    console.log("nameInService select box: " + dstName);
    var dstSelect = $('select[name="' + dstName + '"] ');
    console.log(dstSelect);
    // get the current selected service to use in a GetCapabilities call
    var serviceId = srcSelect[0].value;
    console.log("service id " + serviceId);
    Meteor.call('getService', 
      serviceId,
      function(sError, sResponse) {
        if (sError) {
          console.log('getService Error ', sError);
        } else {
          // service found
          console.log('getService result ', sResponse);
          if (_.isEmpty(sResponse)){
            console.log('no service found');
            // TODO do nothing or clear nameInService selectboxes 
          } else {
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
                    // service layers/featuretypes found !!
                    console.log(methodName + ' result ', lResponse);
                    // put it in options of nameInService
                    dstSelect.empty();
                    $.each(lResponse, function(count, obj) {   
                      dstSelect.append($('<option>', { value : obj.name }).text(obj.title)); 
                    });
                  }
              });
            }
          }
        }
     });
  },
});

/**
 * This will be called after the form has been rendered.
 * The form data (in case of update) is used to fill in all the select options. 
 * Select boxes are:
 * - servicelayer 'nameInService'
 * - servicelayer.featuretype 'nameInService'
 * - servicelayer.featuretype.searchtemplate 'attributeLocalname'
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
                      var selected = ''; 
                      // decide which nameInService selectbox will be filled
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
                          console.log('layer/ft select: ' + selected + ', index: ' + count);
                        } else {
                          console.log('layer/ft name  : ' + obj.name + ', index: ' + count);
                        }
                      });
                      /* 
                       * now continue filling in searchTemplates
                       * localname and namespace
                       */ 
                      if (name.indexOf('.featureType.') > 0){
                        
                        // find searchtemplate localname selectboxes 
                        var attrSelects = $('select[name$=attribute_localname] ');
                        
                        // find searchtemplate namespace fields 
                        var nsInputs = $('input[name$=attibute_namespace] ');
                        // TODO get names above from name of servicelayer
                        
                        // retrieve fields and namespace from a featuretype
                        // and put them in localname selectbox options resp namespace field
                        Meteor.call('describeFeatureType',
                          serviceId,
                          selected, // =ftName
                          function(lError, lResponse) {
                            if (lError) {
                              console.log('describeFeatureType Error ', lError);
                            } else {
                              // featuretype attrs found !!
                              console.log('describeFeatureType result ', lResponse);
                              // fill all searchtemplate.namespace fields 
                              $.each(nsInputs, function(count, ns){
                                $(ns).val(lResponse.targetNamespace);
                              });
                              // fill all searchtemplate.localname options
                              $.each(attrSelects, function(count, attrSelect){
                                selectLocalName = formData.service_layers[index].featureType[0].searchTemplates[count].attribute_localname;
                                
                                // empty select first (remove existing options)
                                var len = attrSelect.length;
                                for (var i = 0; i < len ; i++) {
                                  attrSelect.remove(0);
                                }
                                // then fill options with the fields found
                                $.each(lResponse.options, function(count, obj) {   
                                  var option = document.createElement("option");
                                  option.text = obj.title;
                                  option.value = obj.name;
                                  attrSelect.add(option); 
                                  // set selectIndex if appropriate
                                  if (selectLocalName == obj.name){
                                    attrSelect.selectedIndex = count;
                                    console.log('ft attr select: ' + selected + ', index: ' + count);
                                  }
                                });
                              });
                            }
                        });
                      }                      
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
