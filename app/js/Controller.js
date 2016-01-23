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
        if (localStorage.lastPage != null) {
            // loads last used page, mostly for testing
            this.switchView(localStorage.lastPage);
            //console.log(localStorage.lastPage);
        }

        //*** Buttons ***//
        // this uses a proxy to get the scope right within the button
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClass, this));
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLecture, this));
        $(document).on("click", ".refreshClasses", model.getClasses);
        $('.pageChangerButton').click(this.switchView)

        // debug methods, remove below //
        setUsername();
        model.setUserType("student");
        this.update();
        //setInterval(this.update, 500);
    };

    this.selectClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        view.setLectures(JSON.parse(lectures));
        this.switchView('studentLectures');
    }

    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("value"));
        view.setQuestions(JSON.parse(questions));
        this.switchView('studentQuestions');
    }

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
                    if (view == 'studentLecturesList' || view == 'studentQuestionList') {
                        localStorage.lastPage = divs[i].id;
                    }
                }
            }
        }
    };

    this.update = function () {
        //console.log('update');
        view.update(model.update());
    };
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});