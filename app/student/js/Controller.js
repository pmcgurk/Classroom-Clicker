function Controller() {
    var model = new Model(),
        view = new View(),
        updateInterval,
        backButtonFunc,
        curID;

    this.init = function () {
        model.init();
        view.init();
        model.submitLog('initial', 'application loaded');
        this.pagesetup();
        this.setButtons();
        this.setUser();
        this.update();
        setInterval($.proxy(this.update, this), 1000);
    };

    this.pagesetup = function () {
        $('select').material_select();
        this.switchView('home');
    };

    this.setButtons = function () {
        // this uses a proxy to get the scope right within the button

        // classes page 
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClassEvent, this));
        $(document).on("click", ".joinClassButton", $.proxy(this.joinClassesDisplay, this));

        // lectures page
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLectureEvent, this));
        $(document).on("click", ".classLeaveButton", $.proxy(this.leaveClass, this));

        // questions page
        $(document).on("click", ".questionSelectionButton", $.proxy(this.selectQuestionEvent, this));
        $(document).on("click", ".updateQuestions", this.updateQuestions);

        // question page
        $(document).on("click", ".nextQuestionButton", $.proxy(this.nextQuestion, this));
        $(document).on("click", ".previousQuestionButton", $.proxy(this.previousQuestion, this));
        $(document).on("click", ".submitAnswerButton", $.proxy(this.submitAnswer, this));

        // join class page
        $(document).on("click", ".classResultJoinButton", $.proxy(this.joinClass, this));
        $(document).on("keyup", "#search", $.proxy(this.searchClassesEvent, this))
        $(document).on("change", "input[type=radio][name=group1]", $.proxy(this.changedSearch, this));

        // multipage buttons
        $(document).on("click", ".backButton", this.back);
        $(document).on("click", ".logoutButton", this.logout);
        $(document).on("click", ".update", this.update);
        $(document).on("click", '.pageChangerButton', $.proxy(this.switchViewButton, this));
    };

    /**************** CLASS METHODS ******************/
    this.selectClassEvent = function (event) {
        this.selectClass($(event.currentTarget).attr("cid"));
    }

    this.selectClass = function (cid) {
        model.setCurClass(cid);
        var lectures = model.getLectures(cid);
        view.setLectures(lectures);
        model.submitLog('User change', 'User selected class: ' + cid);
        this.switchView('lectures');
        this.setBackButton($.proxy(this.switchView, this), "home");
        updateInterval = setInterval($.proxy(this.updateClass, this), 250);
    };

    this.updateClass = function () {
        var lectures = model.getLectures(model.getCurClass());
        view.setLectures(lectures);
        //console.log("Updated Class");
    };

    this.leaveClass = function (event) {
        var data = model.leaveClass({
            'cid': $(event.currentTarget).attr("cid")
        });
        view.leaveClass(data);

        model.submitLog('User change', 'User left class: ' + $(event.currentTarget).attr("cid"));
        this.update();
        this.switchView("home");
    };

    this.joinClassesDisplay = function () {
        this.switchView('joinclass');
    };

    /**************** LECTURE METHODS ******************/
    this.selectLectureEvent = function (event) {
        this.selectLecture($(event.currentTarget).attr("value"));
    };

    this.selectLecture = function (lid) {
        this.switchView('questions');
        model.setCurLecture(lid);
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
        model.submitLog('User change', 'User selected lecture: ' + $(event.currentTarget).attr("value"));
        updateInterval = setInterval($.proxy(this.updateLecture, this), 250);
        this.setBackButton($.proxy(this.selectClass, this), model.getCurClass());
        this.updateQuestions();
    }

    this.updateLecture = function () {
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
        //console.log("Updated Lecture");
    };

    /**************** QUESTIONS METHODS ******************/
    this.selectQuestionEvent = function (event) {
        this.selectQuestion($(event.currentTarget).attr("value"));
    };

    this.selectQuestion = function (data) {
        try {
            var question = JSON.parse(model.getQuestion(data));
            question.responses = JSON.parse(model.getUsersResponses(data));
            view.setQuestion(question);
            model.submitLog('User change', 'User selected question: ' + data);
            this.setBackButton($.proxy(this.selectLecture, this), model.getCurLecture());
        } catch (err) {
            view.toast("Question not avaliable");
        }
        this.switchView('question');
    };

    this.updateQuestions = function () {
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
        model.submitLog('update', 'updated questions');
    };

    /**************** QUESTION METHODS ******************/
    this.submitAnswer = function (event) {
        var data = model.submitAnswer({
            'value': $(event.currentTarget).attr("value"),
            'qid': $(event.currentTarget).attr("qid")
        });
        view.submitAnswer(data, $(event.currentTarget).attr("value"));

        model.submitLog('User change', 'User submitted answer: ' + $(event.currentTarget).attr("value") + ' to question: ' + $(event.currentTarget).attr("qid"));
    };

    this.nextQuestion = function () {
        this.updateQuestions();
        model.getQuestions(model.getCurLecture());
        this.selectQuestion(model.getNextQuestion());
        model.submitLog('User change', 'User went to next question');
    };

    this.previousQuestion = function () {
        this.updateQuestions();
        model.getQuestions(model.getCurLecture());
        this.selectQuestion(model.getPreviousQuestion());
        model.submitLog('User change', 'User went to previous question');
    };

    /**************** JOIN CLASS METHODS ******************/
    this.changedSearch = function (event) {
        model.setSearchType($(event.currentTarget).val());
        model.setLastSearch("");
        this.searchClasses($('#search').val());
    };

    this.searchClassesEvent = function (event) {
        this.searchClasses($(event.currentTarget).val());
    };

    this.searchClasses = function (input) {
        if (input.length > 0) {
            var data = model.getClassSearchResult(input);
            view.setClassSearchResult(JSON.parse(data));
        } else {
            model.setLastSearch("");
            view.setClassSearchResult({});
        }
    };

    this.joinClass = function (event) {
        var data = model.joinClass({
            'cid': $(event.currentTarget).attr("value")
        });
        view.joinClass(data);
        this.update();

        model.submitLog('User change', 'User joined class: ' + data.cid);
    };

    /**************** MISC METHODS ******************/
    this.setUser = function () {
        var user = model.getUser();
        if (user) {
            view.setUser(user);
        } else {
            this.logout();
        }
    };

    this.logout = function () {
        model.submitLog('User change', 'User logged out');
        model.logout();
    };

    this.backbutton = function () {
        model.submitLog('button press', 'back button pressed');
        this.back();
    };

    this.back = function () {
        backButtonFunc(curID);
    };

    this.setBackButton = function (func, id) {
        backButtonFunc = func;
        curID = id;
    }

    this.update = function () {
        model.submitLog('update', 'view updated from model');
        view.update(model.update());
    };

    this.switchViewButton = function (event) {
        this.switchView($(event.currentTarget).attr("value"));
    };

    this.switchView = function (data) {
        view.switchView(data);
        model.submitLog('page change', data);
        clearInterval(updateInterval);
        console.log("Cleared Interval");
    }
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});