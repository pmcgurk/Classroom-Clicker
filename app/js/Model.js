function Model() {
    //console.log("Model Created");
    var username = "",
        userType = "";

    this.init = function () {
        //console.log("Model Init");
    };

    this.getUsername = function () {
        //console.log("Username is: " + username);
        return username;
    };

    this.setUsername = function (newUsername) {
        username = newUsername;
        //console.log("Username set to: " + username);
    };

    this.getUserType = function () {
        //console.log("UserType is: " + userType);
        return userType;
    };

    this.setUserType = function (newUserType) {
        userType = newUserType;
        //console.log("UserType set to: " + userType);
    };

    this.getClasses = function () {
        return $.getValues("php/getClasses.php", null);
    };

    this.getLectures = function (cid) {
        return $.getValues("php/getLectures.php", {
            "cid": cid
        });
    };

    this.getQuestions = function (lid) {
        return $.getValues("php/getQuestions.php", {
            "lid": lid
        });
    };

    //*** Update Function ***//
    this.update = function () {
        var updateData = {};
        updateData = {
            "username": this.getUsername(),
            "usertype": this.getUserType(),
            "classes": JSON.parse(this.getClasses())
        };
        return updateData;
    }

    jQuery.extend({
        getValues: function (url, data) {
            var response = null;
            $.ajax({
                url: url,
                type: 'get',
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