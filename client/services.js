Template.services.helpers({
    services: function(){
        return Services.find();
    }
})


Template.registerHelper("wmsVersions", function() {
    return [
        {label: "1", value: 1},
        {label: "2", value: 2},
        {label: "3", value: 3}
    ];
});
Template.registerHelper("wfsVersions", function() {
  return [
      {label: "4", value: 4},
      {label: "5", value: 5},
      {label: "6", value: 6}
  ];
});
Template.registerHelper("tmsVersions", function() {
  return [
      {label: "7", value: 7},
      {label: "8", value: 8},
      {label: "9", value: 9}
  ];
});