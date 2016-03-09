function Controller() {
    var model = new Model(),
        view = new View(),
        responseUpdateInterval,
        updateInterval,
        backButtonFunc,
        curID;

    this.init = function () {
        model.init();
        view.init();
        this.pagesetup();
        this.setButtons();
        this.setUser();
        this.update();
        this.debug();
        setInterval($.proxy(this.update, this), 250);
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
        $(document).on("click", ".classSelectionButton", $.proxy(this.selectClassEvent, this));
        $(document).on("click", ".classEditButton", $.proxy(this.editClass, this));
        $(document).on("click", "#addClassButton", $.proxy(this.addClass, this));

        // class edit page
        $(document).on("click", ".classEditSaveButton", $.proxy(this.saveEditClass, this));
        $(document).on("click", ".classNewSaveButton", $.proxy(this.saveNewClass, this));
        $(document).on("click", ".classDeleteButton", $.proxy(this.removeClass, this));
        $(document).on("click", ".studentEnrolledRemoveButton", $.proxy(this.removeStudent, this));
        $(document).on("click", "#addLectureButton", $.proxy(this.addLecture, this));
        $(document).on("click", ".visibilityChanger", $.proxy(this.changeVisibility, this));

        // lectures page
        $(document).on("click", ".lectureSelectionButton", $.proxy(this.selectLectureEvent, this));

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
        $(document).on("click", ".getResponsesButton", $.proxy(this.getResponsesEvent, this));

        // question page
        $(document).on("click", ".nextQuestionButton", $.proxy(this.nextQuestion, this));
        $(document).on("click", ".previousQuestionButton", $.proxy(this.previousQuestion, this));

        //multipage buttons
        $(document).on("click", ".lectureEditButton", $.proxy(this.editLecture, this));
        $(document).on("click", '.pageChangerButton', $.proxy(this.switchViewButton, this));
        $(document).on("click", ".backButton", this.back);
        $(document).on("click", ".logoutButton", this.logout);

        //responses 
        $(document).on("change", "#selectQuestions", $.proxy(this.getResponsesSelect, this));

        // misc / debug
        $(document).on("click", ".update", this.update);
        $(document).on("click", ".updateQuestions", this.updateQuestions);
        $(document).on("click", ".createButtonJSON", $.proxy(this.createButtonJSON, this));

    };

    /**************** CLASS METHODS ******************/
    this.selectClassEvent = function (event) {
        this.selectClass($(event.currentTarget).attr("value"));
    };

    this.changeVisibility = function (event) {
        var data = {
            "cid": $(event.currentTarget).attr("cid"),
            "lid": $(event.currentTarget).attr("lid"),
            "qid": $(event.currentTarget).attr("qid"),
            "isvisible": this.booleanConvert(!event.target.checked)
        };
        if (event.target.checked) {
            $("label[for='" + $(event.currentTarget).attr("id") + "']").html("<i class='material-icons'>lock_outline</i>");
        } else {
            $("label[for='" + $(event.currentTarget).attr("id") + "']").html("<i class='material-icons'>lock_open</i>");
        }
        model.changeVisibility(data);
    };

    this.selectClass = function (cid) {
        model.setCurClass(cid);
        var lectures = model.getLectures(cid);
        $('#classPageEditButton').attr("value", cid);
        view.setLectures(lectures);
        this.setBackButton($.proxy(this.switchView, this), "home");
        this.switchView('lectures');
        updateInterval = setInterval($.proxy(this.updateClass, this), 250);
        this.setBackButton($.proxy(this.selectClass, this), model.getCurClass());
    };

    this.updateClass = function () {
        var lectures = model.getLectures(model.getCurClass());
        view.setLectures(lectures);
        //console.log("Updated Class");
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
        var response = model.saveClass(data);
        if (response.valid) {
            this.update();
            this.switchView('home');
        } else {

        }
        view.toast(response.response);
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
    this.selectLectureEvent = function (event) {
        this.selectLecture($(event.currentTarget).attr("lid"));
    };

    this.selectLecture = function (lid) {
        var questions = model.getQuestions(lid);
        $('#lecturePageEditButton').attr("lid", lid);
        view.setQuestions(JSON.parse(questions));
        this.switchView('questions');
        updateInterval = setInterval($.proxy(this.updateLecture, this), 250);
        this.setBackButton($.proxy(this.selectClass, this), model.getCurClass());
    };

    this.updateLecture = function () {
        var questions = model.getQuestions(model.getCurLecture());
        view.setQuestions(JSON.parse(questions));
        //console.log("Updated Lecture");
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
        var response = model.saveEditLecture(view.getEditLectureInfo($(event.currentTarget).attr("lid")));
        if (response) {
            if (response.valid) {
                this.update();
                this.switchView('home');
            }
            view.toast(response.message);
        } else {
            this.update();
            this.switchView('home');
        }
    };

    this.saveNewLecture = function (event) {
        var lectureInfo = view.getNewLectureInfo($(event.currentTarget).attr("cid"));
        //console.log(lectureInfo);
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
        this.setBackButton($.proxy(this.selectLecture, this), model.getCurLecture());
    };

    this.getResponsesEvent = function (event) {
        this.getResponses($(event.currentTarget).attr("value"));
    };

    this.getResponses = function (qid) {
        this.switchView('responses');
        var responses = model.getResponses(qid),
            questionNumber = model.getQuestionNumber(qid);
        view.setResponses(JSON.parse(responses), questionNumber);
        this.startResponsesUpdate(qid);
    };

    this.getResponsesSelect = function (event) {
        var responses = model.getResponses($(event.currentTarget).val());
        view.setResponses(JSON.parse(responses));
    };

    /**************** RESPONSES METHODS *****************/
    this.startResponsesUpdate = function (data) {
        this.endUpdateResponses();
        //console.log("Responses Update Started for Question: " + data);
        model.setCurrentResponseQuestion(data);
        responseUpdateInterval = setInterval($.proxy(this.updateResponses, this), 2000);
    };

    this.endUpdateResponses = function () {
        //console.log("Responses Update Ended");
        clearInterval(responseUpdateInterval);
        model.clearOldResponses();
    };

    this.updateResponses = function () {
        var oldResponses = model.getOldResponses();
        var updatedResponses = JSON.parse(model.getUpdatedResponses());
        if (oldResponses != undefined) {
            oldResponses = JSON.parse(oldResponses);
            if (updatedResponses.length - oldResponses.length > 0) {
                view.updateResponses(updatedResponses, oldResponses);
            } else {
                //console.log("Not changed");
            }
        } else {
            //console.log("No old responses");
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
        var user = model.getUser();
        if (user) {
            view.setUser(user);
        } else {
            this.logout();
        }
    };

    this.logout = function () {
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

    this.switchViewButton = function (event) {
        this.switchView($(event.currentTarget).attr("value"));
    };

    this.switchView = function (data) {
        clearInterval(updateInterval);
        this.endUpdateResponses();
        view.switchView(data);
    }

    this.update = function () {
        view.update(model.update());
    };

    // converts true/false into PHP friendly 1 or 0
    this.booleanConvert = function (boolean) {
        if (boolean) return 1
        else return 0;
    }
}

$(document).ready(function () {
    var controller = new Controller();
    controller.init();
});