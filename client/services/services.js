Template.services.helpers({
    
	services: function(){
        return Services.find();
    },
    isSelectedService: function () {
		return Session.equals("selectedServiceId", this._id);
	},
	
});


Template.services.events({
  'click .edit-service': function () { 
	  Session.set("selectedServiceId", this._id);
  },
  'click .insert-service': function () {
	  Session.set("selectedServiceId", null);
  }
});


