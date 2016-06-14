
Categories = new Mongo.Collection("categories");

Categories.attachSchema(new SimpleSchema({
    node: {
        type: [Object],
        optional: true,
        label: 'Category'
    },
    'node.$.id': {
        type: String,
        autoValue: function() {
            if (!this.isSet) {
                return new Meteor.Collection.ObjectID()._str;;
            }
        },
        autoform: {
            type: "hidden",
            label: false
        }  
    },
    'node.$.text': {
        type: String
    },
    'node.$.children': {
        type: [Object],
        optional: true
    },
    'node.$.children.$.id': {
        type: String,
        autoValue: function() {
            if (!this.isSet) {
                return new Meteor.Collection.ObjectID()._str;;
            }
        },
        autoform: {
            type: "hidden",
            label: false
        } 
    },
    'node.$.children.$.text': {
        type: String
    },
    'node.$.children.$.children': {
        type: [Object],
        optional: true
    },
    'node.$.children.$.children.$.id': {
        type: String,
        autoValue: function() {
            if (!this.isSet) {
                return new Meteor.Collection.ObjectID()._str;;
            }
        },
        autoform: {
            type: "hidden",
            label: false
        } 
    },
    'node.$.children.$.children.$.text': {
        type: String
    }
}))