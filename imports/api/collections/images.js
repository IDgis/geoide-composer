import { Mongo } from 'meteor/mongo';

export const Images = new Mongo.Collection("images");
 
Images.allow({
	  insert: function(userId, doc) {
	    // only allow posting if you are logged in
	    return !! userId; 
	  },
	  update: function(userId, doc) {
	    // only allow posting if you are logged in
	    return !! userId; 
	  },
	  remove: function(userId, doc) {
	    // only allow posting if you are logged in
	    return !! userId; 
	  }
});