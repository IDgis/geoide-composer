import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import '../legendGraphic/legendGraph.js';
import { Services } from '/imports/api/collections/services.js';
import { Layers, LayerSchema } from '/imports/api/collections/layers.js';

import './layer.html';
import '../i18n/layers/help.html';

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
	           {label: "sql", value: "cosurvey-sql"}];
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
  
  "click #help": function () {
    var helpTemplate = i18n ('layers.help.template');
    console.log("clicked help", helpTemplate );
    Modal.show(helpTemplate);
  },
  
  /**
   * Act on a change of the wms layer select list:
   * fill legendgraphic 
   */
  'click select[name$=".nameInService"]' : function(e){
    console.log("change on wms layer select ");
    console.log(e);
    // get name of  select box
    var srcName = e.target.name;
//    console.log("Source: " + srcName);
    // get wms layer name 
    var srcSelect = $('select[name="' + srcName + '"] ');
    var lyrName = srcSelect[0].value;

    // find service id from service selectbox
    var srvName = srcName.replace("nameInService", "service");
    var srvSelect = $('select[name="' + srvName + '"] ');
    var serviceId = srvSelect[0].value;

    // find lg field 
    var lgName = srcName.replace("nameInService", "legendGraphic");
    var lg = $('input[name="' + lgName + '"] ');
    
    // find lg image field 
    var lgImgName = srcName.replace("nameInService", "legendGraphic.img");
    var lgImg = $('img[name="' + lgImgName + '"] ');
    
    console.log(serviceId);
    console.log(lyrName);
    // retrieve url for GetLegendGraphic
    // and put it in hidden field and image
    Meteor.call('getLegendGraphicUrl',
      serviceId,
      lyrName,
      function(lError, lResponse) {
        if (lError) {
          console.log('getLegendGraphicUrl Error ', lError);
        } else {
          // url found !!
          console.log('getLegendGraphicUrl result ', lResponse);
          if (lResponse){
            lg[0].value = lResponse;
            if (_.isEmpty(lResponse)){
              lgImg[0].src = '/images/empty-legendgraphic.png';
            } else {
              lgImg[0].src = lResponse;
            }
          }
        }
    });
  },  
  
  /**
   * Fill a selectbox with featuretype attributes 
   * 1. listen to change on selectbox nameInService,
   * 2. get the attributes from the describeFeatureType of the selected wfs service
   * 3. and put the attribute list in selectbox 'attribute localname'
   */
  'change select[name$="featureType.0.nameInWfsServiceXXXX"]' : function(e){
    console.log("change on featureType select ");
    console.log(e);
    // get name of ft select box
    var srcName = e.target.name;
    console.log("Source: " + srcName);
    // get featuretype name 
    var srcSelect = $('select[name="' + srcName + '"] ');
    var ftName = srcSelect[0].value;

    // find service id from service selectbox
    var srvName = srcName.replace("nameInWfsService", "service");
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
            // First element in list
            var option = document.createElement("option");
            option.text = i18n('collections.firstOption');
            option.value = '';
            attrSelect.add(option); 
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
});

/**
 * Update the legendgraphic.
 * This will be called after the form has been rendered.
 * 
 */
Template.layer.onRendered(function(){
  console.log("onRendered");
  console.log(this);
  /*
   * if image is empty, fill it with initial png
   * (initially the src of the image is the url of 'edit-layer' route)
   */
  var legendGraphicImage = this.$("img[name$='legendGraphic.img']");
  if (legendGraphicImage[0].src){
    if (_.isEmpty(legendGraphicImage[0].src) | 
        legendGraphicImage[0].src.indexOf("/layer/"+this.data._id)>0){
      legendGraphicImage[0].src = "/images/empty-legendgraphic.png";
    }
  }
  console.log('legendGraphicImage[0].src', legendGraphicImage[0].src);

});
/**/
 
AutoForm.addHooks('layerform',{
  /**
   * When the autoform is succesfully submitted, go to the layer list.
   * Before doing this, trigger the Geoide viewer that the configuration has changed.
   * When the viewer reload fails, alert the user.
   */
  onSuccess: function(formType, result) {
    console.log("submit layer autoform, goto list");
    Meteor.call('triggerViewerReload',
        function(lError, lResponse) {
      if (lError) {
        console.log('triggerViewerReload Error ', lError);
        alert(i18n('alert.viewerRefresh'));
        Router.go('layers.list');
      } else {
        console.log('triggerViewerReload Response ', lResponse);
        // check op bepaalde inhoud van response of refresh gelukt is
        if (lResponse.statusCode != '200' ){
          alert(i18n('alert.viewerRefresh'));
        }
        Router.go('layers.list');
      }
    });
  },
  onError: function(formType, error){
    console.log("layer autoform error = " + error);
  },
  onRendered: function(formType, error){
    console.log("layer autoform rendered= " + formType);
  }
});
