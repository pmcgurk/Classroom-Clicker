function Model() {
    this.init = function () {

    };

    this.login = function (data) {
        var response = $.getValues("php/login.php", data),
            url = "";
        this.goToApp(response);
    };

    this.checklogin = function () {
        this.goToApp(JSON.parse($.getValues("php/checksession.php", {})).isLecturer);
    };

    this.goToApp = function (data) {
        if (data == 1) {
            window.location = window.location + "/lecturer/";
            Materialize.toast("Logging in...", 2000);
        } else if (data == 0) {
            window.location = window.location + "/student/";
            Materialize.toast("Logging in...", 2000);
        } else {
            Materialize.toast("Error Logging In: " + response, 2000);
        }
    };

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