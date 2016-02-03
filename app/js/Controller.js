function Controller() {
    this.init = function () {
        $(document).on("click", "#loginButton", $.proxy(this.login, this));
        this.goToApp(JSON.parse($.getValues("php/checksession.php", {})).isLecturer);
    };

    this.login = function () {
        // takes data from login form and checks to see if it is a valid user.
        var response = $.getValues("php/login.php", {
            "username": $("#loginForm :input[id=username]").val(),
            "password": $("#loginForm :input[id=password]").val()
        });
        // goes to app depending on the response, which is the user type.
        this.goToApp(response);
    };

    // takes a boolean which redirects the user to the applicable app.
    this.goToApp = function (data) {
        if (data == 1) {
            window.location = window.location + "lecturer/";
        } else if (data == 0) {
            window.location = window.location + "student/";
        } else {
            Materialize.toast("Error Logging In: " + response, 2000);
        }
    };

    // a jquery extend for nicer ajax
    // modified from code from http://stackoverflow.com/a/3504020
    jQuery.extend({
        getValues: function (url, data) {
            var response = null;
            $.ajax({
                url: url,
                type: 'post',
                data: data,
                async: false,
                success: function (data) {
                    response = data;
                }
            });
            return response;
        }
    });
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});