Router.configure({
    layoutTemplate: 'main'
});
Router.route('/', 'services');
Router.route('/services/:_id', function () {
    var service = Services.findOne({_id: this.params._id});
    this.render('service', {data: service});
}, {
    name: 'services.show'
});