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
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClass, this));
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLecture, this));
        $(document).on("click", ".questionSelectionButton", $.proxy(this.selectQuestionEvent, this));
        $(document).on("click", ".nextQuestionButton", $.proxy(this.nextQuestion, this));
        $(document).on("click", ".previousQuestionButton", $.proxy(this.previousQuestion, this));
        $(document).on("click", ".submitAnswerButton", $.proxy(this.submitAnswer, this));
        $(document).on("click", ".backButton", this.backbutton);
        $(document).on("click", ".logoutButton", this.logout);
        $(document).on("click", ".update", this.update);
        $(document).on("click", ".updateQuestions", this.updateQuestions);
        $(document).on("click", '.pageChangerButton', view.switchView);
        $(document).on("click", ".joinClassButton", this.joinClassesDisplay);
        $(document).on("click", ".classResultJoinButton", $.proxy(this.joinClass, this));
        $(document).on("click", ".classLeaveButton", $.proxy(this.leaveClass, this));
        $(document).on("keyup", "#search", $.proxy(this.searchClasses, this))
    };

    this.setUser = function () {
        view.setUser(model.getUser());
    };

    this.updateQuestions = function () {
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
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


    this.joinClassesDisplay = function () {
        view.switchView('joinclass')
    };

    this.joinClass = function (event) {
        var data = model.joinClass({
            'cid': $(event.currentTarget).attr("value")
        });
        view.joinClass(data);
        this.update();
    };

    this.leaveClass = function (event) {
        var data = model.leaveClass({
            'cid': $(event.currentTarget).attr("value")
        });
        view.leaveClass(data);
        this.update();
    };

    this.searchClasses = function (event) {
        if ($(event.currentTarget).val().length > 0) {
            var data = model.getClassSearchResult($(event.currentTarget).val());
            view.setClassSearchResult(JSON.parse(data));
        } else {
            model.setLastSearch("");
            view.setClassSearchResult({});
        }
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
        view.switchView('lectures');
    };

    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("value"));
        view.setQuestions(JSON.parse(questions));
        view.switchView('questions');
    };

    this.selectQuestionEvent = function (event) {
        this.selectQuestion($(event.currentTarget).attr("value"));
    };

    this.selectQuestion = function (data) {
        var question = model.getQuestion(data);
        view.setQuestion(JSON.parse(question));
        view.switchView('question');
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