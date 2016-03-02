function View() {
    var chart,
        lastpage = [],
        curpage,
        data = [],
        colours = [{
                "name": "green",
                "value": "#4caf50"
            },
            {
                "name": "red",
                "value": "#f44336"
            },
            {
                "name": "blue",
                "value": "#2196f3"
            },
            {
                "name": "yellow darken-2",
                "value": "#fbc02d"
            },
            {
                "name": "purple darken-1",
                "value": "#8e24aa"
            },
            {
                "name": "orange",
                "value": "ff9800"
            },
            {
                "name": "pink",
                "value": "#e91e63"
            },
            {
                "name": "indigo",
                "value": "#3f51b5"
            }
                  ];


    this.init = function () {
        //console.log("View Init");
    };


    /**************** CLASS METHODS ******************/
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

    /**************** CLASS EDIT METHODS ******************/
    // uses handlebar templates to display list of classes
    this.setClassesEdit = function (data) {
        var source = $("#classEditTemplate").html(),
            template = Handlebars.compile(source);
        HTML = "";
        if (data.lectures) {
            data.lecturesHTML = this.getLecturesHTML(data.lectures);
        }
        if (data.students) {
            data.studentHTML = this.getStudentHTML(data.students);
        }

        HTML = template(data);
        $("#editClassInfo").html(HTML);
        $('.collapsible').collapsible({
            accordion: false
        });
    };

    // constructs lecture HTML for class edit display
    this.getLecturesHTML = function (data) {
        var source = $("#classEditLectureTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        for (var i = 0; i < data.length; i++) {
            HTML = HTML + template(data[i]);
        }
        return HTML;
    };

    this.getStudentHTML = function (data) {
        var source = $("#classEditStudentTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        for (var i = 0; i < data.length; i++) {
            HTML = HTML + template(data[i]);
        }
        return HTML;
    }

    // takes the data from the edit class divs and constructs a JSON
    this.getEditClassInfo = function () {
        // get all the inputs into an array.
        var $inputs = $('#classEditForm :input');
        var values = {};
        values.code = $inputs[0].value;
        values.name = $inputs[1].value;
        values.description = $inputs[2].value;
        values.isvisible = this.booleanConvert($inputs[3].checked);
        values.joinable = this.booleanConvert($inputs[4].checked);
        values.removed = $inputs[5].checked;
        //TODO credit and fix this
        return values;
    }

    /**************** LECTURE METHODS ******************/
    // uses handlebar templates to display list of lectures
    this.setLectures = function (data) {
        var HTML = "No Lectures";
        if (data.length > 0) {
            var source = $("#lecturesTemplate").html(),
                template = Handlebars.compile(source);
            HTML = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].isvisible == 0) {
                    data[i].greyed = true;
                }
                HTML = HTML + template(data[i]);
            }
            $(".lecturesList").html(HTML);
            $('.lectureTitle').html(data[0].title);
        }
    };

    /**************** LECTURE EDIT METHODS ******************/
    this.setNewLecture = function (data) {
        var source = $("#lectureEditTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        HTML = template(data);
        $('#editLectureInfo').html(HTML);
    };

    // sets the edit lecture page up with current data
    this.setEditLecture = function (data) {
        var source = $("#lectureEditTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";

        if (data.isvisible == 0) {
            data.invisible = true;
        }

        HTML = template(data);
        $('#editLectureInfo').html(HTML);
        this.setEditLectureQuestions(data);
    };

    // sets the edit lecture page questions up with current data
    this.setEditLectureQuestions = function (data) {
        var source = $("#questionEditTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        for (var i = 0; i < data.questions.length; i++) {
            data.questions[i].qnum = i + 1;
            if (data.questions[i].isvisible == 1) {
                data.questions[i].checked = true;
            }

            var buttons = JSON.parse(data.questions[i].buttontype),
                buttonsHTML = "";
            for (var e = 0; e < buttons.length; e++) {
                if (buttons[e].value == data.questions[i].answer) {
                    buttons[e].isAnswer = true;
                }
                buttons[e].qnum = data.questions[i].qnum;
                buttons[e].bID = buttons[e].qnum + "-" + e;
                buttons[e].colour = colours[e].name;
                buttonsHTML = buttonsHTML + this.addMoreEditButtonsInit(buttons[e]);
            }
            console.log(data);
            data.questions[i].buttonsHTML = buttonsHTML;
            HTML = template(data.questions[i]);
            $("#questionsEditList").append(HTML);
            //this.setColourSelect(buttons);
            $('select').material_select();
        }
        $('.questionEditSaveButton').attr("lid", data.lid);
    };

    // sets the button form's select to the correct colour
    this.setColourSelect = function (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            $('.createButtonJSONWrapper[buttonID="' + buttons[i].bID + '"]').find("select").val(buttons[i].colour);
        }
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

    // uses handlebar templates to display new button form
    this.addMoreEditButtons = function (data) {
        var source = $("#buttonCreationTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        HTML = template({
            "qnum": data,
            "colour": colours[$(".buttonCreationForm[qnum='" + data + "'] > .createButtonJSONWrapper").length].name
        });
        $('.buttonCreationForm[qnum="' + data + '"]').append(HTML);
        $('select').material_select();
    };

    // uses handlebar templates to display new button form
    this.addMoreEditButtonsInit = function (data) {
        //TODO combine with above
        var source = $("#buttonCreationTemplate").html(),
            template = Handlebars.compile(source);
        return template(data);
    };

    // removes specified button constructor form
    this.removeButton = function (data) {
        $(".createButtonJSONWrapper[buttonID=" + data + "]").empty();
    };

    // takes data from edit class button divs and constructs a JSON
    this.getButtonInfo = function (qnum) {
        var buttons = [];
        for (var e = 0; e < $('.createButtonJSONForm[qnum="' + qnum + '"]').length; e++) {
            var button = {
                "value": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[name="buttontext"]')[e].text,
                "colour": colours[e].name
            }
            buttons.push(button);
        }
        return JSON.stringify(buttons);
    };

    this.getAnswerButton = function (qnum) {
        var buttons = [];
        for (var e = 0; e < $('.createButtonJSONForm[qnum="' + qnum + '"]').length; e++) {
            var isAnswer = $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[value="buttonanswer"]')[e].checked
            if (isAnswer) {
                return $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[name="buttontext"]')[e].value
            }
        }
    };

    // takes the data from the edit class divs and constructs a JSON
    this.getEditLectureInfo = function (lid) {
        var questions = [],
            $inputs = $('#lectureEditForm :input'),
            values = {};
        values.lid = lid;
        values.name = $inputs[0].value;
        values.date = $inputs[1].value;
        values.description = $inputs[2].value;
        values.isvisible = this.booleanConvert($inputs[3].checked);
        values.removed = $inputs[4].checked;
        for (var i = 0; i < $('.questionForm').length; i++) {
            var question = {},
                buttons = [];
            question.isvisible = this.booleanConvert($('.questionForm').find('input[name="visibleQuestionSwitch"]')[i].checked);
            question.text = $('.questionForm').find('textarea[name="text"]')[i].value;
            question.qid = $('.questionForm').find('textarea[name="qid"]')[i].value;
            question.removed = $('.questionForm').find('input[class="removeQuestionSwitch"]')[i].checked;
            question.buttons = this.getButtonInfo(i + 1);
            question.answer = this.getAnswerButton(i + 1);
            questions.push(question);
        }
        values.questions = questions;
        return values;
    };

    this.getNewLectureInfo = function (data) {
        var questions = [],
            $inputs = $('#lectureEditForm :input'),
            values = {};
        values.cid = data;
        values.name = $inputs[0].value;
        values.date = $inputs[1].value;
        values.description = $inputs[2].value;
        values.isvisible = this.booleanConvert($inputs[3].checked);
        return values;
    }

    /**************** QUESTIONS METHODS ******************/
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

    /**************** QUESTION METHODS ******************/
    // uses handlebar templates to display current question
    this.setQuestion = function (data) {
        var source = $("#questionTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        data.buttonHTML = this.constructButtons(JSON.parse(data.buttontype), data.qid);
        HTML = HTML + template(data);
        $("#question").html(HTML);
    };

    // uses handlebar templates to contruct answer buttons from JSON
    this.constructButtons = function (data, qid) {
        var buttonSource = $("#buttonTemplate").html(),
            buttonTemplate = Handlebars.compile(buttonSource),
            buttonHTML = "";
        for (var i = 0; i < data.length; i++) {
            var button = data[i];
            button.qid = qid;
            values = {
                "colour": colours[i].name,
                "value": button.value,
                "text": button.text,
                "qid": button.qid
            }
            buttonHTML = buttonHTML + buttonTemplate(values);
        }
        return buttonHTML;
    };

    /**************** RESPONSES METHODS ******************/
    // creates a Chart.js chart from data provided from responses database
    this.setResponses = function (ndata) {
        data = ndata;
        //$(".responsesDisplay").text(JSON.stringify(data));
        $(".responsesDisplayHeader").html("Question ID: " + data[0].qid + "<br>Question number: " + "NA");
        $("#canvasWrapper").empty();
        $("#canvasWrapper").append("<canvas id='responsesCanvas' class='responseDisplay center-align'></canvas>");
        var ctx = $("#responsesCanvas").get(0).getContext("2d");
        var values = [],
            labels = [],
            cdata = [];
        for (var i = 0; i < data.length; i++) {
            values.push(data[i].value);
            labels.push(data[i].value);
        }
        labels = this.uniqueValues(values);
        for (var i = 0; i < labels.length; i++) {
            cdata.push({
                "value": this.countValues(values, labels[i]),
                "label": labels[i],
                "color": colours[i].value
            });
        }
        chart = new Chart(ctx).Pie(cdata, {
            segmentShowStroke: false,
            animateRotate: false,
            animateScale: false,
            tooltipTemplate: "<%= value %>%",
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%><%if(segments[i].value){%> - <%=segments[i].value%><%}%></li><%}%></ul>"

        });
        $('#js-legend').html(chart.generateLegend());
        $('#responsesNumber').html("Responses: " + chart.segments.length);
        //var myRadarChart = new Chart(ctx).PolarArea(cdata, {});
    };

    this.getRandomInt = function () {
        return Math.floor((Math.random() * 3) + 1);
    };

    this.getIsNewLabel = function (data) {
        for (var i = 0; i < chart.segments.length; i++) {
            if (chart.segments[i].label == data) {
                return false;
            }
        }
        return true;
    };

    this.addDummyData = function () {
        var dummyData = {};
        dummyData.qid = 1;
        dummyData.value = "value" + this.getRandomInt();
        data.push(dummyData);
        console.log(data);
    };

    this.updateResponses = function (data, oldData) {
        var oldDataLength = oldData.length;
        if (oldDataLength != data.length) {
            for (var i = oldDataLength; i < data.length; i++) {
                var newLabel = this.getIsNewLabel(data[i].value);
                //console.log(newLabel);
                if (newLabel) {
                    //console.log("New Label");
                    chart.addData({
                        value: 1,
                        color: colours[chart.segments.length].value,
                        label: data[i].value
                    })
                } else {
                    for (var e = 0; e < chart.segments.length; e++) {
                        if (chart.segments[e].label == data[i].value) {
                            chart.segments[e].value = chart.segments[e].value + 1;
                            //console.log("Existing label, label: " + chart.segments[e].label + ", value: " + chart.segments[e].value);
                        }
                    }
                }
            }
        }
        $('#js-legend').html(chart.generateLegend());
        $('#responsesNumber').html("Responses: " + chart.total);
        chart.update();
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

    /**************** MISC METHODS ******************/

    // sets user to specified data
    this.setUser = function (data) {
        $(".usernameDisplay").text(data.realname);
        $(".userTypeDisplay").text(data.isLecturer);
    };

    // toast message display function
    this.toast = function (message) {
        // shows a toast with the response i.e. correct
        Materialize.toast(message, 2000);
    };

    // back button, using array of lastpage
    this.goBack = function () {
        if (lastpage[0] != null || lastpage.length > 0) {
            this.switchView(lastpage.pop());
            lastpage.pop();
        }
    };

    // converts true/false into PHP friendly 1 or 0
    this.booleanConvert = function (boolean) {
        if (boolean) return 1
        else return 0;
    }

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