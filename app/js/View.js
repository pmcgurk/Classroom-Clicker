function View() {
    //console.log("View Created");

    this.init = function () {
        //console.log("View Init");
    };

    this.setUsername = function (data) {
        // console.log(data);
        $(".usernameDisplay").text(data);
    };

    this.setUserType = function (data) {
        $(".userTypeDisplay").text(data);
    }

    this.setClasses = function (data) {
        //console.log(data);
        var classes = "";
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            classes = classes + "Lecturer: " + data[i].lecturer + "<br>Lectures: " + data[i].lectures + "<br>";
            // TODO change to template
        }
        $(".studentClasses").html(classes);
    };

    this.update = function (data) {
        this.setUsername(data.username);
        this.setClasses(data.classes);
        this.setUserType(data.usertype);
    };
}