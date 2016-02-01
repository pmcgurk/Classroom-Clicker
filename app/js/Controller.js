function Controller() {
    var model = new Model(),
        view = new View();

    this.init = function () {
        // console.log("Controller Init");
        model.init();
        view.init();
        this.pagesetup();
        this.setButtons();
    };

    this.pagesetup = function () {
        $('.button-collapse').sideNav({
            closeOnClick: true
        });
    };

    this.setButtons = function () {
        // this uses a proxy to get the scope right within the button
        $('.pageChangerButton').click(this.switchView);
        $('#loginButton').click(this.login);
        //$(document).on("click", ".presetselect", this.preset);

    };

    this.login = function () {
        console.log("hello");
        model.login(view.getLogin());
    };

    this.switchView = function (data) {
        var view = $(this).attr("value");
        if (typeof data == "string") {
            view = data
        }
        var divs = document.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].className.indexOf("page") > -1) {
                if (divs[i].id != view) {
                    $('#' + divs[i].id).hide();
                    //console.log("hiding " + divs[i].id);
                } else {
                    $('#' + divs[i].id).show();
                    //console.log("showing " + divs[i].id);
                }
            }
        }
    };

    this.update = function () {
        //console.log('update');
        view.update(model.update());
    };
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});