function Controller() {
    var model = new Model(),
        view = new View();
    //console.log("Controller Created");

    var setUsername = function () {
        model.setUsername("Paul");
    }

    this.init = function () {
        // console.log("Controller Init");
        model.init();
        view.init();
        $('.button-collapse').sideNav({
            closeOnClick: true
        });
        $('.pageChangerButton').click(this.switchView)
        if (localStorage.lastPage != null) {
            // loads last used page, mostly for testing
            this.switchView(localStorage.lastPage);
            //console.log(localStorage.lastPage);
        }

        // debug methods, remove below //
        setUsername();
        model.setUserType("student");
        this.update();
    };

    this.switchView = function (lastPage) {
        var view = $(this).attr("value");
        if (typeof lastPage == "string") {
            // if the lastPage object is a string, it comes from the localStorage onload.
            view = lastPage;
        }
        //console.log("Switching to: " + view);
        var divs = document.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].className.indexOf("page") > -1) {
                if (divs[i].id != view) {
                    $('#' + divs[i].id).hide();
                    // console.log("hiding " + divs[i].id);
                } else {
                    $('#' + divs[i].id).show();
                    // console.log("showing " + divs[i].id);
                    localStorage.lastPage = divs[i].id;
                }
            }
        }
    };

    this.update = function () {
        view.update(model.update());
    };
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});