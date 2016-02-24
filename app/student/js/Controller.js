function Controller() {
    var model = new Model(),
        view = new View();

    this.init = function () {
        model.init();
        view.init();
        this.pagesetup();
        this.setButtons();
        this.update();
        this.setUser();
    };

    this.pagesetup = function () {
        $('select').material_select();
        view.switchView('home');
    };

    this.setButtons = function () {
        // this uses a proxy to get the scope right within the button

        // classes page 
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClass, this));
        $(document).on("click", ".joinClassButton", this.joinClassesDisplay);

        // lectures page
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLecture, this));
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
        $(document).on("click", ".backButton", this.backbutton);
        $(document).on("click", ".logoutButton", this.logout);
        $(document).on("click", ".update", this.update);
        $(document).on("click", '.pageChangerButton', view.switchView);
    };

    /**************** CLASS METHODS ******************/
    this.selectClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("cid"));
        view.setLectures(lectures);
        view.switchView('lectures');
    };

    this.leaveClass = function (event) {
        var data = model.leaveClass({
            'cid': $(event.currentTarget).attr("cid")
        });
        view.leaveClass(data);
        this.update();
        view.switchView("home");
    };

    this.joinClassesDisplay = function () {
        view.switchView('joinclass')
    };

    /**************** LECTURE METHODS ******************/
    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("value"));
        view.setQuestions(JSON.parse(questions));
        view.switchView('questions');
    };

    /**************** QUESTIONS METHODS ******************/
    this.selectQuestionEvent = function (event) {
        this.selectQuestion($(event.currentTarget).attr("value"));
    };

    this.selectQuestion = function (data) {
        var question = model.getQuestion(data);
        view.setQuestion(JSON.parse(question));
        view.switchView('question');
    };

    this.updateQuestions = function () {
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
    };

    /**************** QUESTION METHODS ******************/
    this.submitAnswer = function (event) {
        var data = model.submitAnswer({
            'value': $(event.currentTarget).attr("value"),
            'qid': $(event.currentTarget).attr("qid")
        });
        view.submitAnswer(data);
    };

    this.nextQuestion = function () {
        this.updateQuestions();
        model.getQuestions(model.getCurLecture());
        this.selectQuestion(model.getNextQuestion());
    };

    this.previousQuestion = function () {
        this.updateQuestions();
        model.getQuestions(model.getCurLecture());
        this.selectQuestion(model.getPreviousQuestion());
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
    };

    /**************** MISC METHODS ******************/
    this.setUser = function () {
        view.setUser(model.getUser());
    };

    this.logout = function () {
        model.logout();
    };

    this.backbutton = function () {
        view.goBack();
    };

    this.update = function () {
        view.update(model.update());
    };
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});