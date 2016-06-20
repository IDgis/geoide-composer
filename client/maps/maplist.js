Template.maplist.helpers({
	maps: function(){
	    return Maps.find();
	}
});

Template.maplist.events ({
  'click .delete': function() {
	  //zie https://github.com/aldeed/meteor-delete-button
	 console.log("verwijder kaart " + this._id); 
	 Maps.remove({_id:this._id})
  },

});