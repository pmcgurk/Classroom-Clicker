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
        $(document).on("click", "#addMoreQuestionsButton", $.proxy(view.addMoreEditQuestions, this));
        $(document).on("click", ".questionEditSaveButton", $.proxy(this.saveEditLecture, this));
        $(document).on("click", ".getResponsesButton", $.proxy(this.getResponses, this));
        $(document).on("click", ".classEditButton", $.proxy(this.editClass, this));
        $(document).on("click", ".lectureEditButton", $.proxy(this.editLecture, this));
        $(document).on("click", ".questionEditRemoveButton", $.proxy(this.removeQuestion, this));
        $(document).on("click", ".update", this.update);
        $(document).on("click", ".updateQuestions", this.updateQuestions);
        $(document).on("click", ".backButton", this.backbutton);
        $(document).on("click", ".logoutButton", this.logout);
        $(document).on("click", '.pageChangerButton', view.switchView);
    };

    this.setUser = function () {
        view.setUser(model.getUser());
    };

    this.removeQuestion = function (event) {
        console.log("Remove");
        $(event.currentTarget).html("Undo");
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

    this.saveEditClass = function () {
        model.saveEditClass(view.getEditClassInfo());
    };

    this.saveEditLecture = function () {
        model.saveEditLecture(view.getEditLectureInfo());
        Materialize.toast("Lecture Edited.", 2000);
        this.update();
        view.switchView('home');
    };

    this.editClass = function (event) {
        view.switchView('editClass');
    };

    this.editLecture = function (event) {
        var questions = JSON.parse(model.getQuestions($(event.currentTarget).attr("lid")));
        questions.lid = $(event.currentTarget).attr("lid");
        view.setEditLecture(questions);
        console.log(questions);
        view.switchView('editLecture');
    };

    this.selectClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        view.setLectures(JSON.parse(lectures));
        view.switchView('lectures');
    };

    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("lid"));
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

    this.getResponses = function (event) {
        view.switchView('responses');
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