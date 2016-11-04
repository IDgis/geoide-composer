import './legendGraph.css';
import './legendGraph.html';


Template.legendGraphTemplate.helpers({
  /**
   * Called whenever a legendgraphic image is uploaded
   */
  legendGraphicCallback: function() {
    return {
        finished: function(index, fileInfo, context) {
//          console.log("legendGraphicCallback this", this);
//          console.log("legendGraphicCallback index", index);
//          console.log("legendGraphicCallback fileInfo", fileInfo);
//          console.log("legendGraphicCallback context", context);
//          console.log("legendGraphicCallback className", context.uploadControl.context.className);

          // Get the classname of the div surrounding the upload control template
          // these initial values will get all instances of 
          // legendGraphic input and legendGraphic.img  
          let legendGraphicInputName = 'legendGraphic'; 
          let legendGraphicImageName = 'legendGraphic.img';
          let uploadControlName = '';
          if (context){
            if (context.uploadControl){
              if (context.uploadControl.context){
                if (context.uploadControl.context){
                  uploadControlName = context.uploadControl.context.className;
                }
              }
            }
          }
          if (!_.isEmpty(uploadControlName)){
            // this will find the proper indexed input and image from
            // e.g. uploadControlName='servicelayers.1.legendGraphic.uploadCtrl'
            legendGraphicInputName = uploadControlName.replace(".uploadCtrl", "");
            legendGraphicImageName = uploadControlName.replace(".uploadCtrl", ".img");
          }
          var legendGraphicInput = $("input[name$='"+legendGraphicInputName+"']");
          console.log("legendGraphicCallbacks getLegendGraphic Input",legendGraphicInput);
          legendGraphicInput[0].value = fileInfo.name;

          var legendGraphicImage = $("img[name$='"+legendGraphicImageName+"']");
          console.log("legendGraphicCallbacks getLegendGraphic Image",legendGraphicImage);
          legendGraphicImage[0].src = fileInfo.url;
        },
    }
  },
  imgSrc: function(src){
    var result = '/images/empty-legendgraphic.png';
    if (src){
      if (!_.isEmpty(src)){
        if(src.indexOf("http") !== -1){
        	result = src;
        } else {
    	  result = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/upload/" + src;
        }
      }
    }
    //console.log("imgSrc result",result);
    return result;
  },
});

Template.legendGraphTemplate.events ({
  'click .delete-graphic': function () { 
    console.log("delete-graphic", this.name); 
    
    var legendGraphic = $("input[name$='"+this.name+"']");
    legendGraphic[0].value = "";
    var legendGraphicImage = $("img[name$='"+this.name+'.img'+"']");
    legendGraphicImage[0].src = "/images/empty-legendgraphic.png";
  },
});
  
/**
 * This is a special autoform type for legendgraphic
 * Defined in the Layer schema:
 *    afFieldInput: {
 *       type: "legendGraphicType"
 *     },
 * This field uses its own html template
 */
  AutoForm.addInputType("legendGraphicType", {
    template: "legendGraphTemplate",
    valueOut: function () {
      return this.val();
    },
    valueConverters: {
      "stringArray": AutoForm.valueConverters.stringToStringArray,
      "number": AutoForm.valueConverters.stringToNumber,
      "numberArray": AutoForm.valueConverters.stringToNumberArray,
      "boolean": AutoForm.valueConverters.stringToBoolean,
      "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
      "date": AutoForm.valueConverters.stringToDate,
      "dateArray": AutoForm.valueConverters.stringToDateArray
    },
    contextAdjust: function (context) {
      if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
        context.atts.maxlength = context.max;
      }
      return context;
    }
  });

