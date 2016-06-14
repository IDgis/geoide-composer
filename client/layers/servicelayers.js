Template.servicelayers.helpers({
    servicelayers: function(){
        return Serviceslayers.find();
    }
})

Template.registerHelper("services", function() {
	var serv = Services.find({},{fields:{label:1,_id:1}}).fetch();
	var servoptions = [];
	serv.forEach(function(entry) {
		servoptions.push({label:entry.label, value:entry._id});
	});
	return servoptions;
});