import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session} from 'meteor/session';

import { Maps, MapSchema } from '/imports/api/collections/maps.js';
import { Layers } from '/imports/api/collections/layers.js';

import'./map.html';

Template.map.helpers({
  /**
   * Mapscollection
   */
  maps : function() {
    return Maps;
  },
  /**
   * Maps schema
   */
  mapSchema : function() {
    return MapSchema;
  },
  formType : function() {
    if (Session.get("selectedMapId")) {
      return "update";
    } else {
      return "insert";
    }
  },
  mapDoc : function() {
    if (Session.get("selectedMapId")) {
      return this;
    } else {
      return null;
    }
  },

});

Template.map.events({
  'click #return' : function() {
    console.log("clicked cancel mapform");
    Router.go('maps.list');
  },

  'submit #mapForm' : function(event) {
    console.log("submit map " + this._id);
    // Router.go('map');
  },

  'click .jstree' : function() {
    console.log("click .jstree");
  },

  'click #save-tree' : function() {
    console.log($.jstree.reference('.tree').get_json('#')[0].children)
    console.log("save tree " + this._id);
    var err = Maps.update({
      _id : this._id
    }, {
      $set : {
        // text: this.text,
        children : $.jstree.reference('.tree').get_json('#')[0].children
      }
    }, function(error) {
      console.log("Error save-tree: " + error.message)
    });

  },

  'click #reset-tree' : function(eventObj) {
    console.log("click #reset-tree");
  },

  'click #createlayer' : function() {
    var ref = $.jstree.reference('.maptree'), sel = ref.get_top_selected();

    if (!sel) {
      return false;
    }

    var layerLabel = $('#layerselect option:selected').text();
    var layerId = $('#layerselect option:selected').val();
    sel = ref.create_node(sel, {
      "type" : "layer",
      "text" : layerLabel,
      "data" : {
        "layerid" : layerId
      },
    // "children": [{"type":"servicelayer", "text": "<img
    // src='/images/afdelingen.png'>", "a_attr":{class: "no_checkbox"}}],
    });

    if (sel) {
      ref.edit(sel);
    }
  },

  'click #creategroup' : function() {
    var ref = $.jstree.reference('.maptree'), sel = ref.get_top_selected();

    if (!sel) {
      return false;
    }
    sel = ref.create_node(sel, {
      "type" : "group",
      "state" : {
        checked : false
      }
    });
    if (sel) {
      ref.edit(sel);
    }
  },

  'click #renamenode' : function() {
    var ref = $.jstree.reference('.maptree'), sel = ref.get_selected();
    if (!sel.length) {
      return false;
    }
    sel = sel[0];
    ref.edit(sel);
  },

  'click #removenode' : function() {
    var ref = $.jstree.reference('.maptree'), sel = ref.get_selected();
    if (!sel.length || ref.get_type(sel) === "map") {
      return false;
    }
    ref.delete_node(sel);
  },

  'keyup #search-tree' : function() {
    var v = $('#search-tree').val();
    $.jstree.reference('.maptree').search(v);
  }
});

Template.map.rendered = function() {

  fillLayerSelect();

  var mapId = Session.get("selectedMapId");
  var map;
  if (mapId) {
    map = Maps.find({
      _id : mapId
    }).fetch()[0];
    map.a_attr = {
      class : "no_checkbox"
    };
  } else {
    map = {
      text : 'Nieuwe kaart',
      type : 'map',
      'children' : [],
      'a_attr' : {
        class : "no_checkbox"
      }
    };
  }
  if (map.children) {
    styleChildren(map.children);
  }

  console.log(map);
  // map = {text: 'Afdelingen', type:'map', 'children': [{text: 'Topografie
  // groep',children: [{ text: 'luchtfoto', type: 'layer'}, {text: 'top10
  // nl',type: 'layer'}], type: 'default' }, { text: 'percelen', type: 'layer'
  // }],type: 'map'};
  $('.maptree').jstree({
    core : {
      data : [ map ],
      check_callback : true,
    },
    types : {
      "#" : {
        "max_children" : 1,
        "max_depth" : 4,
        "valid_children" : [ "map" ]
      },
      map : {
        "icon" : "glyphicon glyphicon-tree-deciduous",
        "valid_children" : [ "group", "layer" ],
      },
      group : {
        "icon" : "glyphicon glyphicon-duplicate",
        "valid_children" : [ "group", "layer" ]
      },
      layer : {
        "icon" : "glyphicon glyphicon-file",
        "valid_children" : [ "servicelayer" ],
      },
      servicelayer : {
        "icon" : "null",
        "valid_children" : [],
      }
    },
    checkbox : {
      three_state : false,
      tie_selection : false,
      whole_node : false
    },
    plugins : [ "dnd", "search", "state", "types", "checkbox" ]

  })

  .on("loaded.jstree", function() {
    $('.maptree').jstree('open_all');
  });
}

$('.maptree').jstree

fillLayerSelect = function() {
  var layers = Layers.find({}, {
    fields : {
      name : 1,
      _id : 1
    }
  }).fetch();
  layers.forEach(function(entry) {
    var layerOption = "<option value=" + entry._id + ">" + entry.name
        + "</option>"
    $('#layerselect').append(layerOption);
  });
};

styleChildren = function(children) {
  children.forEach(function(child) {
    if (child.type === "servicelayer") {
      child.a_attr = {
        class : "no_checkbox"
      };
    }
    ;
    if (child.children) {
      styleChildren(child.children);
    }
    ;
  });
};

/**
 * when the autoform is succesfully submitted, then go to the map list
 */
AutoForm.addHooks('mapForm', {
  onSuccess : function(formType, result) {
    console.log("submit map autoform, goto list");
    Router.go('maps.list');
  },
  onError : function(formType, error) {
    console.log("map autoform error = " + error);
  }
});
