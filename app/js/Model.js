function Model() {
    
    this.init = function() {
        
    };
    
    this.login = function (data) {  
        var response = $.getValues("php/login.php", data),
            url = "";
        if (response == 1) {
            window.location = window.location + "/lecturer/";
        } else if (response == 0) {
            window.location = window.location + "/student/";
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