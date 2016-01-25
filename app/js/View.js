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
        var HTML = "No Lectures";;
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

    this.setQuestion = function (data) {
        var source = $("#questionTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        data.buttonHTML = this.constructButtons(JSON.parse(data.buttontype));
        HTML = HTML + template(data);
        $("#studentQuestion").html(HTML);
    };

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