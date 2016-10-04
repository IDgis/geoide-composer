import './legendGraph.css';
import './legendGraph.html';


Template.legendGraphTemplate.helpers({
  /**
   * Called whenever a legendgraphic image is uploaded
   */
  legendGraphicCallback: function() {
    return {
        finished: function(index, fileInfo, context) {
          console.log("legendGraphicCallback index", index);
          console.log("legendGraphicCallback fileInfo", fileInfo);
          console.log("legendGraphicCallback context", context);

          var legendGraphic = $("input[name$='legendGraphic']");
          console.log("legendGraphicCallbacks getLegendGraphic Input",legendGraphic);
          legendGraphic[0].value = fileInfo.url;

          var legendGraphicImage = $("img[name$='legendGraphic.img']");
          console.log("legendGraphicCallbacks getLegendGraphic Image",legendGraphicImage);
          legendGraphicImage[0].src = fileInfo.url;
        },
    }
  },
  imgSrc: function(src){
//    console.log("imgSrc src",src);
    var result = '/images/empty-legendgraphic.png';
    if (src){
      if (!_.isEmpty(src)){
        result = src;
      }
    }
//    console.log("imgSrc result",result);
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


  