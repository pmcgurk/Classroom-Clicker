function View() {
    var chart,
        lastpage = [],
        curpage;

    this.init = function () {
        //console.log("View Init");
    };


    //** Display Altering **/
    this.setUser = function (data) {
        $(".usernameDisplay").text(data.username);
        $(".userTypeDisplay").text(data.isLecturer);
    };

    // submit answer response display
    this.submitAnswer = function (data) {
        // shows a toast with the response i.e. correct
        Materialize.toast(data, 1000);
    };

    // toast function
    this.toast = function (message) {
        // shows a toast with the response i.e. correct
        Materialize.toast(message, 2000);
    };

    // uses handlebar templates to display list of classes
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
        $(".classes").html(HTML);
        $('.className').html(data[0].code + ": " + data[0].name);
    };

    // uses handlebar templates to display list of lectures
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
                HTML = HTML + template(data[i]);
            }
        }
        $(".lecturesList").html(HTML);
        $('.lectureTitle').html(data[0].title);

    };

    // uses handlebar templates to display list of questions
    this.setQuestions = function (data) {
        var source = $("#questionsTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "",
            selectHTML = "";
        $(".responseQuestionSelect").html("");
        for (var i = 0; i < data.length; i++) {
            data[i].buttonHTML = this.constructButtons(JSON.parse(data[i].buttontype));
            data[i].qnum = i + 1; // gets question number
            if (data[i].isvisible == 0) {
                data[i].greyed = true;
            }
            HTML = HTML + template(data[i]);
            selectHTML = selectHTML + " <a class='btn getResponsesButton' value='" + data[i].qid + "'>Q" + data[i].qnum + "</a> ";
        }
        if (HTML == "") {
            HTML = "No Questions.";
        }
        $(".responseQuestionSelect").html(selectHTML);
        $(".questionList").html(HTML);
    };

    this.removeButton = function (data) {
        $(".createButtonJSONWrapper[buttonID=" + data + "]").empty();
    }

    // uses handlebar templates to display new button form
    this.addMoreEditButtons = function (data) {
        var source = $("#buttonCreationTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        HTML = template({
            "qnum": data
        });
        $('.buttonCreationForm[qnum="' + data + '"]').append(HTML);
        $('select').material_select();
    };

    // uses handlebar templates to display new button form
    this.addMoreEditButtonsInit = function (data) {
        var source = $("#buttonCreationTemplate").html(),
            template = Handlebars.compile(source);
        return template(data);
    };

    // uses handlebar templates to display new question form
    this.addMoreEditQuestions = function () {
        var source = $("#questionEditTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";

        var data = {
            "qnum": $('.questionForm').length + 1
        };
        HTML = template(data);
        $("#questionsEditList").append(HTML);
        $('select').material_select();
    };

    this.setEditLecture = function (data) {
        var source = $("#questionEditTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "",
            lid = data.lid;
        $('#questionsEditLectureTitle').text(lid);
        $("#questionsEditList").html("");
        for (var i = 0; i < data.length; i++) {
            data[i].qnum = i + 1;
            data[i].checked = (data[i].isvisible == 0);
            var buttons = JSON.parse(data[i].buttontype),
                buttonsHTML = "";
            for (var e = 0; e < buttons.length; e++) {
                buttons[e].qnum = data[i].qnum;
                buttons[e].bID = buttons[e].qnum + "-" + e;
                buttonsHTML = buttonsHTML + this.addMoreEditButtonsInit(buttons[e]);
            }
            // console.log(buttonsHTML);
            data[i].buttonsHTML = buttonsHTML;
            HTML = template(data[i]);
            $("#questionsEditList").append(HTML);
            this.setColourSelect(buttons);
            $('select').material_select();
        }
        $('.questionEditSaveButton').attr("lid", lid);
    }

    this.setColourSelect = function (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            $('.createButtonJSONWrapper[buttonID="' + buttons[i].bID + '"]').find("select").val(buttons[i].colour);
        }
    };

    // uses handlebar templates to display current question
    this.setQuestion = function (data) {
        var source = $("#questionTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        data.buttonHTML = this.constructButtons(JSON.parse(data.buttontype), data.qid);
        HTML = HTML + template(data);
        $("#question").html(HTML);
    };

    // creates a Chart.js chart from data provided from responses database
    this.setResponses = function (data) {
        //$(".responsesDisplay").text(JSON.stringify(data));
        $(".responsesDisplayHeader").html("Question ID: " + data[0].qid + "<br>Question number: " + "NA");
        $("#canvasWrapper").empty();
        $("#canvasWrapper").append("<canvas id='responsesCanvas' class='responseDisplay center-align'></canvas>");
        var ctx = $("#responsesCanvas").get(0).getContext("2d");
        var values = [],
            labels = [],
            cdata = [],
            colours = ["#4caf50", "#f44336", "#2196f3", "#ffeb3b"];
        for (var i = 0; i < data.length; i++) {
            values.push(data[i].value);
            labels.push(data[i].value);
        }
        labels = this.uniqueValues(values);
        for (var i = 0; i < labels.length; i++) {
            cdata.push({
                "value": this.countValues(values, labels[i]),
                "label": labels[i],
                "color": colours[i]
            });
        }
        chart = new Chart(ctx).Pie(cdata, {});
        //var myRadarChart = new Chart(ctx).PolarArea(cdata, {});
    };

    this.clearCanvas = function () {

    };

    this.updateResponses = function (data) {

    };

    // counts appearances of a value in array
    this.countValues = function (array, value) {
        var total = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                total++;
            }
        }
        return total;
    };

    // returns array of unique labels from array
    this.uniqueValues = function (array) {
        var newArray = [];
        for (var i = 0, j = array.length; i < j; i++) {
            if (newArray.indexOf(array[i]) == -1)
                newArray.push(array[i]);
        }
        return newArray;
    }

    this.getButtonInfo = function (qnum) {
        var buttons = [];
        for (var e = 0; e < $('.createButtonJSONForm[qnum="' + qnum + '"]').length; e++) {
            var button = {
                "value": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[name="buttonvalue"]')[e].value,
                "colour": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('select[name="buttoncolour"]')[e].value,
                "text": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[name="buttontext"]')[e].value
            }
            buttons.push(button);
        }
        return JSON.stringify(buttons);
    };

    //** GUI info getters **/
    // takes the data from the edit class divs and constructs a JSON
    this.getEditLectureInfo = function () {
        //TODO get class visibility, name etc changes.
        var lectureEdited = {},
            questions = [];
        for (var i = 0; i < $('.questionForm').length; i++) {
            var question = {},
                buttons = [];
            question.invisible = $('.questionForm').find('input[name="switch"]')[i].checked;
            question.text = $('.questionForm').find('textarea[name="text"]')[i].value;
            question.qid = $('.questionForm').find('textarea[name="qid"]')[i].value;
            question.removed = $('.questionForm').find('input[name="remove"]')[i].checked;
            question.buttons = this.getButtonInfo(i + 1);
            questions.push(question);
        }
        lectureEdited.questions = questions;
        lectureEdited.lid = $('.questionEditSaveButton').attr("lid");
        return lectureEdited;
    }

    // takes the data from the edit class divs and constructs a JSON
    this.getEditClassInfo = function () {
        return "WIP";
    }

    // uses handlebar templates to contruct answer buttons from JSON
    this.constructButtons = function (data, qid) {
        var buttonSource = $("#buttonTemplate").html(),
            buttonTemplate = Handlebars.compile(buttonSource),
            buttonHTML = "";
        for (var i = 0; i < data.length; i++) {
            var button = data[i];
            button.qid = qid;
            values = {
                "colour": button.colour,
                "value": button.value,
                "text": button.text,
                "qid": button.qid
            }
            buttonHTML = buttonHTML + buttonTemplate(data[i]);
        }
        return buttonHTML;
    };

    // back button, using array of lastpage
    this.goBack = function () {
        if (lastpage[0] != null || lastpage.length > 0) {
            this.switchView(lastpage.pop());
            lastpage.pop();
        }
    };

    // switches current view to provided new view
    this.switchView = function (data) {
        if (data != undefined) {
            var view = $(this).attr("value");
            if (typeof data == "string") {
                view = data
            }
            var divs = document.getElementsByTagName('div');
            for (var i = 0; i < divs.length; i++) {
                if (divs[i].className.indexOf("page") > -1) {
                    if (divs[i].id != view) {
                        $('#' + divs[i].id).hide();
                        //console.log("hiding " + divs[i].id);
                    } else {
                        if ($('#' + divs[i].id).is(':visible')) {
                            // console.log("already on it");
                        } else {
                            if (curpage != undefined) {
                                lastpage.push(curpage);
                            }
                            curpage = divs[i].id;
                            $('#' + divs[i].id).show();
                        }
                        //console.log("showing " + divs[i].id);
                        //console.log("lastpage:" + lastpage);
                    }
                }
            }
            if (lastpage.length > 0) {
                $(".backButton").show();
            } else {
                $(".backButton").hide();
            }
        }
    };

    this.update = function (data) {
        this.setClasses(data.classes);
    };
}