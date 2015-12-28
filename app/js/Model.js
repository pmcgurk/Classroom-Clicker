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
        var classes = [{
            lecturer: "A. Lecturer",
            lectures: "test"
        }, {
            lecturer: "A. N. Another",
            lectures: "test2"
        }]
        return classes;
    }

    this.update = function () {
        var updateData = {
            "username": this.getUsername(),
            "usertype": this.getUserType(),
            "classes": this.getClasses()
        };
        return updateData;
    }
}