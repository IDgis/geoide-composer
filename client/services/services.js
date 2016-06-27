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
	  Router.go('service.edit', {_id: this._id});
  },
  'click .insert-service': function () {
	  Session.set("selectedServiceId", null);
	  Router.go('service.insert');
  },
  'click .delete-service': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder service " + this._id); 
	 Services.remove({_id:this._id})
  },
});



