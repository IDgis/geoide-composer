Template.servicelayerlist.helpers({

	servicelayers: function(){
    	return ServiceLayers.find({},{fields:{label:1}});
    },
    
    subtemplate: function () {
    	var visible = Session.get("subvisible");
    	if(visible){
    		return Template["servicelayer"];
    	} else {
    		return null;
    	}
	},
})

Template.servicelayerlist.events({
	'click .insert-servicelayer': function () { 
		Session.set("subvisible", true);
		Session.set("selectedServiceLayerId", null);
	 },
	 'click .update-servicelayer': function () {
		Session.set("selectedServiceLayerId", this._id);
		Session.set("subvisible", true);
	 },
});