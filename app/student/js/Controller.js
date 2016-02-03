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
        $(document).on("click touchstart", ".classSelectionButton", $.proxy(this.selectClass, this));
        $(document).on("click touchstart", ".lectureSelectionButton", $.proxy(this.selectLecture, this));
        $(document).on("click touchstart", ".questionSelectionButton", $.proxy(this.selectQuestion, this));
        $(document).on("click touchstart", ".submitAnswerButton", $.proxy(this.submitAnswer, this));
        $(document).on("click touchstart", ".backButton", this.backbutton);
        $(document).on("click touchstart", ".logoutButton", this.logout);
        $(document).on("click touchstart", ".refreshClasses", model.getClasses);
        $(document).on("click touchstart", '.pageChangerButton', view.switchView);
        $(document).on("click touchstart", ".joinClassButton", this.joinClassesDisplay);
        $(document).on("keyup", "#search", $.proxy(this.searchClasses, this))
    };

    this.setUser = function () {
        view.setUser(model.getUser());
    };

    this.joinClassesDisplay = function () {
        view.switchView('joinclass')
    };

    this.searchClasses = function (event) {
        if ($(event.currentTarget).val().length > 0) {
            $("#searchResultPreloader").show();
            var data = model.getClassSearchResult($(event.currentTarget).val());
            view.setClassSearchResult(JSON.parse(data));
            $("#searchResultPreloader").hide();
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

    this.selectQuestion = function (event) {
        var question = model.getQuestion($(event.currentTarget).attr("value"));
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