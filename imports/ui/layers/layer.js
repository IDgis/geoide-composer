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
      }
      return admin;
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
        + "</option>";
    $('#layerselect').append(layerOption);
  });
};

Template.layer.events({
  /**
   *  When the Cancel button is pressed go to the layer list
   */
  'click #returnLayer': function () {
    Router.go('layers.list');
  },
  
  "click #help": function () {
    var helpTemplate = i18n ('layers.help.template');
    Modal.show(helpTemplate);
  },
  
  /**
   * Act on a change of the wms layer select list:
   * fill legendgraphic 
   */
  'click select[name$=".nameInService"]' : function(e){
    setCursorProgress();
    // get name of  select box
    var srcName = e.target.name; //chrome
    if (!srcName){
      srcName = e.target.parentElement.name; // FF, IE
    }
    console.log("Source name ", srcName);
    var lyrName = e.target.value;

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
    
    // retrieve url for GetLegendGraphic
    // and put it in hidden field and image
    Meteor.call('getLegendGraphicUrl',
      serviceId,
      lyrName,
      function(lError, lResponse) {
        setCursorNormal();
        if (lError) {
          console.log('getLegendGraphicUrl Error ', lError);
          lg[0].value = '';
          lgImg[0].src = '/images/empty-legendgraphic.png'; //error-legendgraphic.png ??
        } else {
          // url found !!
          if (lResponse){
            lg[0].value = lResponse;
            if (_.isEmpty(lResponse)){
              lgImg[0].src = '/images/empty-legendgraphic.png';
            } else {
              lgImg[0].src = lResponse;
            }
          } else {
            lg[0].value = '';
            lgImg[0].src = '/images/empty-legendgraphic.png';//undefined-legendgraphic.png ??
          }
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
  /*
   * if image is empty, fill it with initial png
   * (initially the src of the image is the url of 'edit-layer' route)
   */
  var legendGraphicImage = this.$("img[name$='legendGraphic.img']");
  if (legendGraphicImage[0].src){
    if (_.isEmpty(legendGraphicImage[0].src) | 
        legendGraphicImage[0].src.indexOf("/layer/"+this.data._id)>=0){
      legendGraphicImage[0].src = "/images/empty-legendgraphic.png";
    }
  }
});
/**/
 
AutoForm.addHooks('layerform',{
  /**
   * When the autoform is succesfully submitted, go to the layer list.
   * Before doing this, trigger the Geoide viewer that the configuration has changed.
   * When the viewer reload fails, alert the user.
   */
  onSuccess: function(formType, result) {
    Meteor.call('triggerViewerReload',
        function(lError, lResponse) {
      if (lError) {
        console.log('triggerViewerReload Error ', lError);
        alert(i18n('viewerRefresh.alert'));
        Router.go('layers.list');
      } else {
        // check op bepaalde inhoud van response of refresh gelukt is
        if (lResponse.statusCode !== '200' ){
          alert(i18n('viewerRefresh.alert'));
        }
        Router.go('layers.list');
      }
    });
  },
  onError: function(formType, error){
    console.log("layer autoform error = " + error);
  },
  onRendered: function(formType, error){
  }
});
