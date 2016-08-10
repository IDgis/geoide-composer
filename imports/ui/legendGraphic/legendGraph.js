import './legendGraph.css';
import './legendGraph.html';


Template.legendGraphTemplate.helpers({
  legendGraphicCallback: function() {
    return {
        finished: function(index, fileInfo, context) {
          console.log("legendGraphicCallback index", index);
          console.log("legendGraphicCallback fileInfo", fileInfo);

          /*
           * 1. getImage from upload url
           */
          var imgResponse = Meteor.call('getImage', url, {});
          console.log('legendGraphicCallback imgResponse', imgResponse);

          /*
           * 2. put it in Mongo GLG collection
           * Get image_id
           */
          
          /*
           * 3. change fileinfo url 
           * from: 
           * url/upload_path/image_Name (e.g. http/localhost:3000/upload/MyImage.png)
           * to:
           * Metero.absoluteUrl()/GetLegendGraphic_Route/image_id
           * (e.g. http://123.456.0.0/GetLegendGraphic/Xdsf5jHghj676h8J3XgtyY) 
           */
          
          var legendGraphic = $("input[name$='legendGraphic']");
//          console.log("legendGraphicCallbacks getLegendGraphic Input",legendGraphic);
          legendGraphic[0].value = fileInfo.url;

          var legendGraphicImage = $("img[name$='legendGraphic.img']");
//          console.log("legendGraphicCallbacks getLegendGraphic Image",legendGraphicImage);
          legendGraphicImage[0].src = fileInfo.url;
        },
    }
  },
});


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


  