/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import '../legendGraphic/legendGraph.js';
import { Services } from '/imports/api/collections/services.js';
import { Layers, LayerSchema } from '/imports/api/collections/layers.js';

import './layer.html';
import '../i18n/layers/help.html';
import '../i18n/alerts/geoide-viewer.html';

Template.layer.helpers({
  /**
   * Retrieve a list of services options for a selectbox
   * @return {object} array of {label, value} 
   */
  services: function(){
    const serv = Services.find({},{fields:{name:1,_id:1}}).fetch();
    const servoptions = [];
    serv.forEach(function(entry) {
      servoptions.push({label:entry.name, value:entry._id});
    });
    return servoptions;
  },
  
  /**
   * Find a specific service
   * @return {object} all matching services as an Array.
   */
  service: function(thisid){
    const serv = Services.find({_id: thisid}).fetch();
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
  
  /**
   * Called in autoform type to determine if this is an insert or update form.
   * Depends on Session object.
   * @return {string} 'update' or 'insert'
   */
  formType: function () {
    if (Session.get('selectedLayerId')) {
        return 'update';
     } else {
        return 'insert';
     }
  },
  
  /**
   * Called in autoform doc to find the Layer object for the form
   * Depends on Session object.
   * @return {object} layer that was previously selected or null if new layer
   */
  layerDoc: function () {
    if (Session.get('selectedLayerId')) {
      return Layers.findOne({_id: Session.get('selectedLayerId')});
     } else {
        return null ;
     }
  },
  
  /**
   * Returns options for a selectbox with fixed values.
   * @return {object} options list
   */
  layerTypes: function () {
    return[{label: 'default', value: 'default'},
           {label: 'sql', value: 'cosurvey-sql'}];
  },

  /**
   * Determines if an administrator is logged in
   * @return {boolean} true if an administrator is logged in,
   *    false if no user or no administrator is logged in 
   */
  adminLoggedIn: function(){
    let admin = false; 
    if (Meteor.user()){
      // a user is logged in
      const name = Meteor.user().username;
      admin = _.isEqual(name, 'idgis-admin');
    }
    return admin;
  },
});

/**
 * set the mouse cursor to a waiting cursor
 */
const setCursorProgress = function() {
  $('body').css('cursor', 'wait');
};

/**
 * set the mouse cursor to default (arrow) cursor
 */
const setCursorNormal = function() {
  $('body').css('cursor', 'default');
};

Template.layer.events({
  /**
   *  When the Cancel button is pressed go to the layer list
   */
  'click #returnLayer': function () {
    Router.go('layers.list');
  },
  
  /**
   * Show help pop-up
   */
  'click #help': function () {
    // peppelg:bootstrap-3-modal
    Modal.show(i18n('layers.help.template'));
  },
  
  /**
   * Act on a select in the wms layer select list 
   * in order to fill the legendgraphic image and url.
   * 
   * Most interactivity of the layer form is coded in the layer schema.
   * This is coded here because it does not depend on full reactivity, 
   * but on a simple select.  
   * 
   * the cursor changes in a 'wait' cursor for the duration 
   * of finding a legendgraphic url in the wms 
   */
  'click select[name$=".nameInService"]' : function(e){
    setCursorProgress();
    // get name of  select box
    // depends on browser used:
    // Chrome
    let srcName = e.target.name;
    if (!srcName){
      // FF, IE
      srcName = e.target.parentElement.name;
    }
    const lyrName = e.target.value;

    // find service id from service selectbox
    const srvName = srcName.replace('nameInService', 'service');
    const $srvSelect = $('select[name="' + srvName + '"] ');
    const serviceId = $srvSelect[0].value;

    // find lg hidden input field 
    const lgName = srcName.replace('nameInService', 'legendGraphic');
    const $lg = $('input[name="' + lgName + '"] ');
    
    // find lg image field 
    const lgImgName = srcName.replace('nameInService', 'legendGraphic.img');
    const $lgImg = $('img[name="' + lgImgName + '"] ');
    
    /* 
     * retrieve url for GetLegendGraphic
     * and put it in hidden input field and in the image tag 
     * to show the image in the form
     */ 
    Meteor.call('getLegendGraphicUrl',
      serviceId,
      lyrName,
      function(lError, lResponse) {
        setCursorNormal();
        if (lError) {
          console.log('getLegendGraphicUrl Error ', lError);
          $lg[0].value = '';
          $lgImg[0].src = '/images/empty-legendgraphic.png';
        } else {
          // url found !!
          if (lResponse){
            $lg[0].value = lResponse;
            if (_.isEmpty(lResponse)){
              $lgImg[0].src = '/images/empty-legendgraphic.png';
            } else {
              $lgImg[0].src = lResponse;
            }
          } else {
            $lg[0].value = '';
            $lgImg[0].src = '/images/empty-legendgraphic.png';
          }
        }
    });
  }  
  
});

/**
 * Update the legendgraphic.
 * This will be called after the form has been rendered.
 * 
 */
Template.layer.onRendered(function(){
  /*
   * if image src is empty, fill it with an initial 'empty' png
   * Note:
   *  initially the src of the image is the url of 'edit-layer' route
   *  in this case also the image src is replace by an 'empty' png
   */
  const legendGraphicImage = this.$("img[name$='legendGraphic.img']");
  if ((legendGraphicImage[0].src) && 
      (_.isEmpty(legendGraphicImage[0].src) || 
        (legendGraphicImage[0].src.indexOf('/layer/'+this.data._id)>=0))){
    legendGraphicImage[0].src = '/images/empty-legendgraphic.png';
  }
});
/**/
 
AutoForm.addHooks('layerform',{
  /**
   * When the autoform is succesfully submitted, go to the layer list.
   * Before doing this, trigger the Geoide viewer that the configuration has changed.
   * When the viewer reload fails, alert the user.
   */
  onSuccess: function() {
    Meteor.call('triggerViewerReload', function(lError, lResponse) {
      if (lError) {
        Modal.show('alert-geoide-viewer-refresh');
        Router.go('layers.list');
      } else {
        // check op bepaalde inhoud van response of de refresh gelukt is
        if (lResponse.statusCode !== 200 ){
          Modal.show('alert-geoide-viewer-refresh');
        }
        Router.go('layers.list');
      }
    });
  },
  onError: function(formType, error){
    console.log('layer autoform error = ' + error);
  }
});
