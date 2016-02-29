function Controller() {
    var model = new Model(),
        view = new View(),
        responseUpdateInterval;

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
        this.switchView('home');
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
        $(document).on("click", ".classDeleteButton", $.proxy(this.removeClass, this));
        $(document).on("click", ".studentEnrolledRemoveButton", $.proxy(this.removeStudent, this));
        $(document).on("click", "#addLectureButton", $.proxy(this.addLecture, this));

        // lectures page
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLecture, this));

        // lecture edit page
        $(document).on("click", "#addMoreQuestionsButton", $.proxy(view.addMoreEditQuestions, this));
        $(document).on("click", ".addMoreButtonsButton", $.proxy(this.addMoreEditButtons, this));
        $(document).on("click", ".questionEditSaveButton", $.proxy(this.saveEditLecture, this));
        $(document).on("click", ".newLectureSaveButton", $.proxy(this.saveNewLecture, this));
        $(document).on("click", ".questionEditRemoveButton", $.proxy(this.removeQuestion, this));
        $(document).on("click", ".buttonCreationRemoveButton", $.proxy(this.removeButton, this));
        $(document).on("click", ".lectureRemoveButton", $.proxy(this.removeLecture, this));

        // questions page
        $(document).on("click", ".questionSelectionButton", $.proxy(this.selectQuestionEvent, this));
        $(document).on("click", ".getResponsesButton", $.proxy(this.getResponses, this));

        // question page
        $(document).on("click", ".nextQuestionButton", $.proxy(this.nextQuestion, this));
        $(document).on("click", ".previousQuestionButton", $.proxy(this.previousQuestion, this));

        //multipage buttons
        $(document).on("click", ".lectureEditButton", $.proxy(this.editLecture, this));
        $(document).on("click", '.pageChangerButton', $.proxy(this.switchViewButton, this));
        $(document).on("click", ".backButton", this.backbutton);
        $(document).on("click", ".logoutButton", this.logout);

        // misc / debug
        $(document).on("click", ".update", this.update);
        $(document).on("click", ".updateQuestions", this.updateQuestions);
        $(document).on("click", ".createButtonJSON", $.proxy(this.createButtonJSON, this));

    };

    /**************** CLASS METHODS ******************/
    this.selectClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        $('#classPageEditButton').attr("value", $(event.currentTarget).attr("value"));
        view.setLectures(lectures);
        this.switchView('lectures');
    };

    this.addClass = function (event) {
        view.setClassesEdit({});
        this.switchView('editClass');
    };

    this.editClass = function (event) {
        var lectures = model.getLectures($(event.currentTarget).attr("value"));
        var classData = model.getUserClassInfo($(event.currentTarget).attr("value"));
        var students = model.getEnrolledStudents({
            'cid': $(event.currentTarget).attr("value")
        });
        classData.lectures = lectures;
        classData.students = students;
        view.setClassesEdit(classData);
        this.switchView('editClass');
    };

    /**************** CLASS EDIT METHODS ******************/

    this.saveEditClass = function (event) {
        var data = view.getEditClassInfo();
        data.cid = $(event.currentTarget).attr("cid");
        model.saveClass(data);
        this.update();
        view.toast("Class Successfully Edited");
        this.switchView('home');
    };

    this.saveNewClass = function () {
        model.saveClass(view.getEditClassInfo());
        this.update();
        this.switchView('home');
    };

    this.removeClass = function (event) {
        var cid = $(event.currentTarget).attr("cid");
        view.toast(model.removeClass(event));
    };

    this.removeStudent = function (event) {
        var data = {
            "uid": $(event.currentTarget).attr("uid"),
            "cid": $(event.currentTarget).attr("cid")
        }
        view.toast(model.editStudent(data));
    };

    this.addLecture = function (event) {
        var data = {
            "cid": $(event.currentTarget).attr("cid")
        };
        view.setNewLecture(data);
        this.switchView('editLecture');
    };

    /**************** LECTURE METHODS ******************/
    this.selectLecture = function (event) {
        var questions = model.getQuestions($(event.currentTarget).attr("lid"));
        $('#lecturePageEditButton').attr("lid", $(event.currentTarget).attr("lid"));
        view.setQuestions(JSON.parse(questions));
        this.switchView('questions');
    };

    /**************** LECTURE EDIT METHODS ******************/
    this.removeButton = function (event) {
        view.removeButton($(event.currentTarget).attr("buttonID"));
    };

    this.editLecture = function (event) {
        var lectureInfo = model.getUserLectureInfo($(event.currentTarget).attr("lid"));
        var questions = JSON.parse(model.getQuestions($(event.currentTarget).attr("lid")));
        lectureInfo.questions = questions;
        view.setEditLecture(lectureInfo);
        this.switchView('editLecture');
    };

    this.addMoreEditButtons = function (event) {
        view.addMoreEditButtons($(event.currentTarget).attr("qnum"));
    };

    this.createButtonJSON = function (event) {
        model.createButtonJSON($(event.currentTarget).attr("qnum"));
    };

    this.removeLecture = function (event) {
        var lid = $(event.currentTarget).attr("lid");
        view.toast(model.removeLecture(event));
    };

    this.removeQuestion = function (event) {
        var qnum = $(event.currentTarget).attr("qnum");
        view.toast(model.removeQuestion(event))
    };

    this.saveEditLecture = function (event) {
        model.saveEditLecture(view.getEditLectureInfo($(event.currentTarget).attr("lid")));
        Materialize.toast("Lecture Edited.", 2000);
        this.update();
        this.switchView('home');
    };

    this.saveNewLecture = function (event) {
        var lectureInfo = view.getNewLectureInfo($(event.currentTarget).attr("cid"));
        console.log(lectureInfo);
        model.saveNewLecture(lectureInfo);
    };


    /**************** QUESTIONS METHODS ******************/
    this.updateQuestions = function () {
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
    };

    this.selectQuestionEvent = function (event) {
        this.selectQuestion($(event.currentTarget).attr("value"));
    };

    this.selectQuestion = function (data) {
        var question = model.getQuestion(data);
        view.setQuestion(JSON.parse(question));
        this.switchView('question');
    };

    this.getResponses = function (event) {
        this.switchView('responses');
        var responses = model.getResponses($(event.currentTarget).attr("value"));
        view.setResponses(JSON.parse(responses));
        this.startResponsesUpdate($(event.currentTarget).attr("value"));
    };

    this.getResponsesSelect = function (event) {
        var responses = model.getResponses($(event.currentTarget).val());
        view.setResponses(JSON.parse(responses));
    };

    /**************** RESPONSES METHODS *****************/
    this.startResponsesUpdate = function (data) {
        this.endUpdateResponses();
        console.log("Responses Update Started for Question: " + data);
        model.setCurrentResponseQuestion(data);
        responseUpdateInterval = setInterval($.proxy(this.updateResponses, this), 500);
    };

    this.endUpdateResponses = function () {
        console.log("Responses Update Ended");
        clearInterval(responseUpdateInterval);
        model.clearOldResponses();
    };

    this.updateResponses = function () {
        var oldResponses = model.getOldResponses();
        var updatedResponses = JSON.parse(model.getUpdatedResponses());
        if (oldResponses != undefined) {
            oldResponses = JSON.parse(oldResponses);
            console.log("Difference: " + (updatedResponses.length - oldResponses.length));
            view.updateResponses(updatedResponses, oldResponses);
        } else {
            console.log("No old responses");
        }
    };


    /**************** QUESTION METHODS ******************/
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

    this.switchViewButton = function (event) {
        this.switchView($(event.currentTarget).attr("value"));
    };

    this.switchView = function (data) {
        this.endUpdateResponses();
        view.switchView(data);
    }

    this.update = function () {
        view.update(model.update());
    };
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});