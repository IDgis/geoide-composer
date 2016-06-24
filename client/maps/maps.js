Template.maplist.helpers({
	maps: function(){
	    return Maps.find();
	},
    isSelectedMap: function () {
		return Session.equals("selectedMapId", this._id);
	},
});

Template.maplist.events ({
  'click .edit-map': function () { 
	  Session.set("selectedMapId", this._id);
	  Router.go
  },
  'click .insert-map': function () {
	  Session.set("selectedMapId", null);
  },
  'click .delete-map': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder kaart " + this._id); 
	 Maps.remove({_id:this._id})
  },
});