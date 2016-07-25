import { Accounts } from 'meteor/accounts-base';
import { UserSchema } from '/imports/api/collections/users.js';

Meteor.methods({
  'createUpdateViewerAdmin' : function(doc) {

    check(doc, UserSchema);
    
    console.log("doc: ",doc);
    
    var user = Meteor.users.findOne({username: doc.username});
    console.log("user: ",user);
    if (!user){
      user = Accounts.createUser({username:doc.username, password:'koffie'});
    }
    console.log("user: ",user);
    Meteor.users.update(user, {$set: {role: doc.role}});
  }
});