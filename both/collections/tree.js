Tree = new Mongo.Collection("tree");


Tree.attachSchema(new SimpleSchema({
	text: {
		type: String,
	}, 
	children: {
		type: [Object]
	}, 
	'children.$.id': {
        type: String,
    },
    'children.$.text': {
        type: String
    },
    'children.$.children': {
        type: [Object],
        optional: true
    },
    'children.$.type': {
    	 type: String
    },
    'children.$.children.$.id': {
         type: String,
     },
	'children.$.children.$.text': {
	     type: String
	  },
	'children.$.children.$.type': {
		 type: String
	 },
	'children.$.children.$.children.$.id': {
	     type: String,
	 },
	 'children.$.children.$.children.$.text': {
	     type: String
	  },
	'children.$.children.$.children.$.type': {
		 type: String
	 }
}));

Tree.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})