function View() {
    //console.log("View Created");

    this.init = function () {
        //console.log("View Init");
    }

    this.setUsername = function (username) {
        // console.log(username);
        $(".usernameDisplay").text(username);
    }
}