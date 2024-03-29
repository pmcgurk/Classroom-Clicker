function Controller() {
    this.init = function () {
        $(document).on("click", "#loginButton", $.proxy(this.login, this));
        $(document).on("click", "#registerButton", $.proxy(this.registerButton, this));
        $(document).on("click", "#registerConfirm", $.proxy(this.registerConfirm, this));
        $(document).on("click", "#registerCancel", $.proxy(this.registerCancel, this));
        try {
            this.goToApp($.getValues("php/checksession.php", {}).isLecturer);
        } catch (err) {
            $('#loginscreen').show();
        }
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
            Materialize.toast("Error Logging In: " + data, 2000);
        }
    };

    this.registerButton = function () {
        $('#registerForm').show();
        $('#loginForm').hide();
        $('#loginButton').hide();
        $('#registerButton').hide();
        $('#registerCancel').show();
        $('#registerConfirm').show();
    };

    this.registerCancel = function () {
        $('#registerForm').hide();
        $('#loginForm').show();
        $('#loginButton').show();
        $('#registerButton').show();
        $('#registerCancel').hide();
        $('#registerConfirm').hide();
    };

    this.registerConfirm = function () {
        // takes data from login form and checks to see if it is a valid user.
        var data = {
            "realname": $("#registerForm :input[id=realname]").val(),
            "username": $("#registerForm :input[id=registerusername]").val(),
            "password": $("#registerForm :input[id=registerpassword]").val()
        };
        var response = $.getValues("php/register.php", data);
        Materialize.toast(response.message, 2000);
        if (!response.error) {
            this.registerCancel();
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