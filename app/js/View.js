function View() {
    //console.log("View Created");

    this.init = function () {
        //console.log("View Init");
    };

    this.setUsername = function (data) {
        // console.log(data);
        $(".usernameDisplay").text(data);
    };

    this.setUserType = function (data) {
        $(".userTypeDisplay").text(data);
    }

    this.setClasses = function (data) {
        var HTML = "No Classes";
        if (data != {}) {
            var source = $("#classesTemplate").html(),
                template = Handlebars.compile(source);
            HTML = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].isvisible == 0) {
                    data[i].greyed = true;
                }
                HTML = HTML + template(data[i]);
            }
        }
        $(".studentClasses").html(HTML);
        $('.className').html(data[0].code + ": " + data[0].name);
    };

    this.setLectures = function (data) {
        var HTML = "No Lectures";
        if (data != {}) {
            var source = $("#lecturesTemplate").html(),
                template = Handlebars.compile(source);
            HTML = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].isvisible == 0) {
                    data[i].greyed = true;
                }
                console.log(data[i]);
                HTML = HTML + template(data[i]);
            }
        }
        $(".studentLecturesList").html(HTML);
        $('.lectureTitle').html(data[0].title);

    };

    this.setQuestions = function (data) {
        var source = $("#questionsTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        for (var i = 0; i < data.length; i++) {
            data[i].buttonHTML = this.constructButtons(JSON.parse(data[i].buttontype));
            data[i].qnum = i + 1; // gets question number
            if (data[i].isvisible == 0) {
                data[i].greyed = true;
            }
            HTML = HTML + template(data[i]);
        }
        if (HTML == "") {
            HTML = "No Questions.";
        }
        $(".studentQuestionList").html(HTML);
    };

    this.addMoreEditQuestions = function () {
        var source = $("#questionEditTemplate").html(),
            template = Handlebars.compile(source),
            data = {"qnum": 1},
            HTML = template(data);
        $("#questions").append(HTML);
        $('select').material_select();
    };

    this.setQuestion = function (data) {
        var source = $("#questionTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        data.buttonHTML = this.constructButtons(JSON.parse(data.buttontype));
        HTML = HTML + template(data);
        $("#studentQuestion").html(HTML);
    };

    // takes the data from the edit class divs and constructs a JSON
    this.getEditClassInfo = function () {
        //TODO get class visibility, name etc changes.
        var classEdited = {},
            questions = [];
        for (var i = 0; i < $('.questionForm').length; i++) {
            var question = {};
            question.visible = $('.questionForm').find('input[name="switch"]')[i].checked;
            question.text = $('.questionForm').find('textarea[name="text"]')[i].value;
            question.buttons = $('.questionForm').find('div[name="buttons"]')[i].innerText;
            questions.push(question);
        }
        classEdited.questions = questions;
        classEdited.cid = 1;
        classEdited.visibile = 1;
        classEdited.name = "Embedded Systems";
        return classEdited;
    }

    this.constructButtons = function (data) {
        var buttonSource = $("#buttonTemplate").html(),
            buttonTemplate = Handlebars.compile(buttonSource),
            buttonHTML = "";
        for (var i = 0; i < data.length; i++) {
            var button = data[i];
            values = {
                "colour": button.colour,
                "value": button.value,
                "text": button.text
            }
            buttonHTML = buttonHTML + buttonTemplate(data[i]);
        }
        return buttonHTML;
    };

    this.update = function (data) {
        this.setUsername(data.username);
        this.setClasses(data.classes);
        this.setUserType(data.usertype);
    };
}