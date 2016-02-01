function Controller() {
    var model = new Model(),
        view = new View();

    this.init = function () {
        // console.log("Controller Init");
        model.init();
        view.init();
        this.debugMethods();
        this.pagesetup();
        this.setButtons();
        this.update();
    };

    this.debugMethods = function () {
        this.setUsername();
        this.setUserType();
    };

    this.pagesetup = function () {
        $('.button-collapse').sideNav({
            closeOnClick: true
        });
        $('select').material_select();

        this.switchView('home');
    };

    this.setButtons = function () {
        // this uses a proxy to get the scope right within the button
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClass, this));
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLecture, this));
        $(document).on("click", ".questionSelectionButton", $.proxy(this.selectQuestion, this));
        $(document).on("click", ".questionEditSaveButton", $.proxy(this.saveEditClass, this));
        $(document).on("click", "#addMoreQuestionsButton", $.proxy(view.addMoreEditQuestions, this));
        $(document).on("click", ".questionEditSaveButton", $.proxy(this.saveEditClass, this));
        $(document).on("click", ".submitAnswerButton", $.proxy(this.submitAnswer, this));
        $(document).on("click", ".getResponsesButton", $.proxy(this.getResponses, this));
        $(document).on("click", ".logoutButton", this.logout);
        $(document).on("click", ".refreshClasses", model.getClasses);
        
        // selects
        $(document).on("change", ".responseQuestionSelect", $.proxy(this.getResponsesSelect, this));
        $('.pageChangerButton').click(this.switchView);
        //$(document).on("click", ".presetselect", this.preset);

    };

    this.setUsername = function () {
        model.setUsername("Lecturer");
    };

    this.setUserType = function () {
        model.setUserType("lecturer");
    };

    this.submitAnswer = function (event) {
        var data = model.submitAnswer({
            'value': $(event.currentTarget).attr("value"),
            'qid': $(event.currentTarget).attr("qid")
        });
        view.submitAnswer(data);
    };

    this.saveEditClass = function () {
        model.saveEditClass(view.getEditClassInfo());
    };

    this.selectClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        view.setLectures(JSON.parse(lectures));
        this.switchView('lectures');
    };

    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("value"));
        view.setQuestions(JSON.parse(questions));
        this.switchView('questions');
    };

    this.selectQuestion = function (event) {
        var question = model.getQuestion($(event.currentTarget).attr("value"));
        view.setQuestion(JSON.parse(question));
        this.switchView('question');
    };

    this.getResponses = function (event) {
        this.switchView('responses');
        var responses = model.getResponses($(event.currentTarget).attr("value"));
        view.setResponses(JSON.parse(responses));
    };

    this.getResponsesSelect = function (event) {
        var responses = model.getResponses($(event.currentTarget).val());
        view.setResponses(JSON.parse(responses));
    };

    this.logout = function () {
        model.logout();
    };

    this.switchView = function (data) {
        var view = $(this).attr("value");
        if (typeof data == "string") {
            view = data
        }
        var divs = document.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].className.indexOf("page") > -1) {
                if (divs[i].id != view) {
                    $('#' + divs[i].id).hide();
                    //console.log("hiding " + divs[i].id);
                } else {
                    $('#' + divs[i].id).show();
                    //console.log("showing " + divs[i].id);
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