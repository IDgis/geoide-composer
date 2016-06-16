Template.maplist.helpers({
	maps: function(){
	    return Tree.find();
	}
});

Template.maplist.events ({
  'click .edit-map': function () { 
	  console.log("wijzig kaart " + this._id);
	  Session.set("selectedMapId", this._id);
   },
  'click .delete': function() {
	 console.log("verwijder kaart " + this._id); 
	 Tree.remove({_id:this._id})
  },
});