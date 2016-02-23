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
        this.debug();
    };

    this.debug = function () {

    };

    this.pagesetup = function () {
        $('select').material_select();
        view.switchView('home');
    };

    this.setButtons = function () {
        // this uses a proxy to get the scope right within the button

        // classes page 
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClass, this));
        $(document).on("click", ".classEditButton", $.proxy(this.editClass, this));
        $(document).on("click", "#addClassButton", $.proxy(this.addClass, this));

        // class edit page
        $(document).on("click", ".classEditSaveButton", $.proxy(this.saveEditClass, this));
        $(document).on("click", ".classNewSaveButton", $.proxy(this.saveNewClass, this));

        // lectures page
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLecture, this));

        // lecture edit page
        $(document).on("click", "#addMoreQuestionsButton", $.proxy(view.addMoreEditQuestions, this));
        $(document).on("click", ".addMoreButtonsButton", $.proxy(this.addMoreEditButtons, this));
        $(document).on("click", ".questionEditSaveButton", $.proxy(this.saveEditLecture, this));
        $(document).on("click", ".questionEditRemoveButton", $.proxy(this.removeQuestion, this));
        $(document).on("click", ".buttonCreationRemoveButton", $.proxy(this.removeButton, this));

        // questions page
        $(document).on("click", ".questionSelectionButton", $.proxy(this.selectQuestionEvent, this));
        $(document).on("click", ".getResponsesButton", $.proxy(this.getResponses, this));

        // question page
        $(document).on("click", ".nextQuestionButton", $.proxy(this.nextQuestion, this));
        $(document).on("click", ".previousQuestionButton", $.proxy(this.previousQuestion, this));


        //multipage buttons
        $(document).on("click", ".lectureEditButton", $.proxy(this.editLecture, this));
        $(document).on("click", '.pageChangerButton', view.switchView);
        $(document).on("click", ".backButton", this.backbutton);
        $(document).on("click", ".logoutButton", this.logout);

        // misc / debug
        $(document).on("click", ".update", this.update);
        $(document).on("click", ".updateQuestions", this.updateQuestions);
        $(document).on("click", ".createButtonJSON", $.proxy(this.createButtonJSON, this));

    };

    this.setUser = function () {
        view.setUser(model.getUser());
    };

    this.removeButton = function (event) {
        view.removeButton($(event.currentTarget).attr("buttonID"));
    };

    this.addMoreEditButtons = function (event) {
        view.addMoreEditButtons($(event.currentTarget).attr("qnum"));
    };

    this.createButtonJSON = function (event) {
        model.createButtonJSON($(event.currentTarget).attr("qnum"));
    }

    this.removeQuestion = function (event) {
        var qnum = $(event.currentTarget).attr("qnum");
        view.toast(model.removeQuestion(qnum, event))
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

    this.saveEditClass = function (event) {
        var data = view.getEditClassInfo();
        data.cid = $(event.currentTarget).attr("cid");
        model.saveClass(data);
    };

    this.saveNewClass = function () {
        model.saveClass(view.getEditClassInfo());
    };

    this.saveEditLecture = function () {
        model.saveEditLecture(view.getEditLectureInfo());
        Materialize.toast("Lecture Edited.", 2000);
        this.update();
        view.switchView('home');
    };

    this.addClass = function (event) {
        view.setClassesEdit({});
        view.switchView('editClass');
    };

    this.editClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        var classData = model.getUserClassInfo($(event.currentTarget).attr("value"));
        classData.lectures = JSON.parse(lectures);
        view.setClassesEdit(classData);
        view.switchView('editClass');
    };

    this.editLecture = function (event) {
        var questions = JSON.parse(model.getQuestions($(event.currentTarget).attr("lid")));
        questions.lid = $(event.currentTarget).attr("lid");
        view.setEditLecture(questions);
        view.switchView('editLecture');
    };

    this.selectClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        $('#classPageEditButton').attr("value", $(event.currentTarget).attr("value"));
        view.setLectures(JSON.parse(lectures));
        view.switchView('lectures');
    };

    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("lid"));
        $('#lecturePageEditButton').attr("lid", $(event.currentTarget).attr("lid"));
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