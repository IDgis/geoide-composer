/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import './legendGraph.css';
import './legendGraph.html';


Template.legendGraphTemplate.helpers({
  /**
   * Called whenever a legendgraphic image is uploaded
   * Used by packages:
   *   tomi:upload-jquery
   *   tomi:upload-server
   * 
   * Find the proper input and image tags
   *   Fill input value with name of the uploaded image
   *   Fill the image src with the url of the uploaded image
   * 
   * @see legendGraph.html where the template of the legendgraph GUI is defined
   */
  legendGraphicCallback: function() {
    return {
        finished: function(index, fileInfo, context) {
          /* 
           * Get the classname of the div surrounding the upload_bootstrap template
           * This name will have the form 'servicelayers.N.legendGraphic.uploadCtrl', 
           * where N is an index of the Nth control in the form.
           * 
           * From this name deduce the full name of the input and image tags
           * The initial values represent all instances of 
           * legendGraphic input and legendGraphic img in the form  
           * 
           */
          let legendGraphicInputName = 'legendGraphic'; 
          let legendGraphicImageName = 'legendGraphic.img';
          let uploadControlName = '';
          if ((context) && 
              (context.uploadControl) && 
              (context.uploadControl.context)){
            uploadControlName = context.uploadControl.context.className;
          }
          if (!_.isEmpty(uploadControlName)){
            /* 
             * find the properly indexed input and image
             *   e.g. when uploadControlName='servicelayers.1.legendGraphic.uploadCtrl',
             *   then img tag name becomes 'servicelayers.1.legendGraphic.img'
             * 
             */
            legendGraphicInputName = uploadControlName.replace('.uploadCtrl', '');
            legendGraphicImageName = uploadControlName.replace('.uploadCtrl', '.img');
          }
          // select the proper input and set its value
          const $legendGraphicInput = $('input[name$="'+legendGraphicInputName+'"]');
          $legendGraphicInput[0].value = fileInfo.name;

          // select the proper image and set its src
          const $legendGraphicImage = $('img[name$="'+legendGraphicImageName+'"]');
          $legendGraphicImage[0].src = fileInfo.url;
        }
    };
  },
  
  /**
   * Get the url of the uploaded image to be used as value of image.src
   * 
   * @param {string} url or file name of the uploaded image
   * @return {string} url of uploaded image
   *   by default returns an 'empty' png.
   *   when the image src contains http or https return it as is. 
   *   if the src of the image is only a file name, expand it into a full url. 
   */
  imgSrc: function(src){
    let result = '/images/empty-legendgraphic.png';
    if ((src) && 
      (!_.isEmpty(src))){
      if(src.indexOf('http') !== -1){
        result = src;
      } else {
      result = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/upload/' + src;
      }
    }
    return result;
  }
});

Template.legendGraphTemplate.events ({
  'click .delete-graphic': function () { 
    
    const $legendGraphic = $('input[name$=""+this.name+""]');
    $legendGraphic[0].value = '';
    const $legendGraphicImage = $('img[name$=""+this.name+".img"]');
    $legendGraphicImage[0].src = '/images/empty-legendgraphic.png';
  }
});
  
/**
 * This is the definition of a special autoform type for legendgraphic
 * Used in the Layer schema as follows:
 *    afFieldInput: {
 *       type: 'legendGraphicType'
 *     },
 * This field uses its own html template in legendGraph.html
 */
  AutoForm.addInputType('legendGraphicType', {
    template: 'legendGraphTemplate',
    valueOut: function () {
      return this.val();
    },
    valueConverters: {
      'stringArray': AutoForm.valueConverters.stringToStringArray,
      'number': AutoForm.valueConverters.stringToNumber,
      'numberArray': AutoForm.valueConverters.stringToNumberArray,
      'boolean': AutoForm.valueConverters.stringToBoolean,
      'booleanArray': AutoForm.valueConverters.stringToBooleanArray,
      'date': AutoForm.valueConverters.stringToDate,
      'dateArray': AutoForm.valueConverters.stringToDateArray
    },
    contextAdjust: function (context) {
      if (typeof context.atts.maxlength === 'undefined' && typeof context.max === 'number') {
        context.atts.maxlength = context.max;
      }
      return context;
    }
  });

