Template.servicelayer.helpers({
	
	servicelayer: function (){
		return ServiceLayers.find();
	},
	
	selectedServicelayerDoc: function(){
	    return ServiceLayers.findOne(Session.get("selectedServiceLayerId"));
	},
	
	formType: function () {
		if (Session.get("selectedServiceLayerId")) {
		  return "update";
		} else {
		  return "insert";
		}
	},
	
	services: function(){
		var serv = Services.find({},{fields:{label:1,_id:1}}).fetch();
		var servoptions = [];
		serv.forEach(function(entry) {
			servoptions.push({label:entry.label, value:entry._id});
		});
		return servoptions;
	},
	
});

Template.servicelayerlist.events({
	'click .submit': function () { 
		console.log("haalo");
		Session.set("subvisible", false);

	 },

});

