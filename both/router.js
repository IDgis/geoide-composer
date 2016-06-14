Router.configure({
    layoutTemplate: 'main'
});
Router.route('/', 'serviceslist');
Router.route('/services/:_id', function () {
    var service = Services.findOne({_id: this.params._id});
    this.render('service', {data: service});
}, {
    name: 'services.show'
});
Router.route('/js-data', 'js-data');
Router.route('/reactive-data', 'reactive-data');
Router.route('/layer', 'layer');
Router.route('/servicelayer', 'servicelayer');
