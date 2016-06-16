Tree = new Mongo.Collection("tree");


Tree.attachSchema(new SimpleSchema({
	text: {
		type: String,
	}, 
	state: {
		type: Object
	},
	type: {
		type: String,
		defaultValue: 'map'
	},
	children: {
		type: [Object]
	}, 
	//visible
	'state.checked': {
		type: Boolean,
		optional: true
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