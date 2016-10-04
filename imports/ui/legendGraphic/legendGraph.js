import './legendGraph.css';
import './legendGraph.html';


Template.legendGraphTemplate.helpers({
  /**
   * Called whenever a legendgraphic image is uploaded
   */
  legendGraphicCallback: function() {
    return {
        finished: function(index, fileInfo, context) {
          console.log("legendGraphicCallback this", this);
          console.log("legendGraphicCallback index", index);
          console.log("legendGraphicCallback fileInfo", fileInfo);
          console.log("legendGraphicCallback context", context);
          console.log("legendGraphicCallback className", context.uploadControl.context.className);

          let legendGraphicName = context.uploadControl.context.className;
          legendGraphicName = legendGraphicName.replace(".uploadCtrl", "");
          var legendGraphic = $("input[name$='"+legendGraphicName+"']");
          console.log("legendGraphicCallbacks getLegendGraphic Input",legendGraphic);
          legendGraphic[0].value = fileInfo.url;

          let legendGraphicImgName = context.uploadControl.context.className;
          legendGraphicImgName = legendGraphicImgName.replace(".uploadCtrl", ".img");
          var legendGraphicImage = $("img[name$='"+legendGraphicImgName+"']");
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


  Template.customUpload.created = function() {
    Uploader.init(this);
  };

  Template.customUpload.rendered = function () {
    Uploader.render.call(this);
  };

  Template.customUpload.events({
    'click .start': function (e) {
      Uploader.startUpload.call(Template.instance(), e);
    }
  });

  Template.customUpload.helpers({
    'infoLabel': function() {
      var instance = Template.instance();

      // we may have not yet selected a file
      var info = instance.info.get()
      if (!info) {
        return;
      }

      var progress = instance.globalInfo.get();

      // we display different result when running or not
      return progress.running ?
        info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
        info.name + ' - ' + info.size + 'B';
    },
    'progress': function() {
      return Template.instance().globalInfo.get().progress + '%';
    }
  });  