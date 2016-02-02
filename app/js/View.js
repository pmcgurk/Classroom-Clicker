function View() {
    this.init = function () {
        //console.log("View Init");
    };

    this.getLogin = function () {
        var details = {};
        details.username = $("#loginForm :input[id=username]").val();
        details.password = $("#loginForm :input[id=password]").val();
        return details;
    };
}