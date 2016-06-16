Template.maplist.helpers({
	maps: function(){
	    return Tree.find();
	}
});

Template.maplist.events ({
  'click .delete': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder kaart " + this._id); 
	 Tree.remove({_id:this._id})
  },
});