function Model() {
    //console.log("Model Created");
    var username = "";
    this.init = function () {
        //console.log("Model Init");
    }

    this.getUsername = function () {
        //console.log("Username is: " + username);
        return username;
    }

    this.setUsername = function (newUsername) {
        username = newUsername;
        //console.log("Username set to: " + username);
    }
}