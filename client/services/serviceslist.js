Session.setDefault("autoSaveMode", false);

Template.serviceslist.helpers({
    
	
	services: function(){
        return Services.find();
    },
    autoSaveMode: function () {
    	return Session.get("autoSaveMode") ? true : false;
    },
  
  selectedServiceDoc: function () {
    return Services.findOne(Session.get("selectedServiceId"));
  },
  isSelectedService: function () {
    return Session.equals("selectedServiceId", this._id);
  },
  formType: function () {
    if (Session.get("selectedServiceId")) {
      return "update";
    } else {
      return "disabled";
    }
  },
  disableButtons: function () {
    return !Session.get("selectedServiceId");
  }
});

Template.serviceslist.events({
  'click .edit-service': function () { 
    Session.set("selectedServiceId", this._id);
  },
  'click .delete': function() {
	  console.log('hallo'); 
  },
  'change .autosave-toggle': function () {
	  console.log("ook hallo");
    Session.set("autoSaveMode", !Session.get("autoSaveMode"));
  }
});