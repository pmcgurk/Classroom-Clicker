function View() {
    var chart,
        lastpage = [],
        curpage,
        oldClassData,
        oldLectureData,
        oldQuestionsData;

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
        if (JSON.stringify(data) != JSON.stringify(oldClassData)) {
            $(".classes").html(HTML);
            $('.className').html(data[0].code + ": " + data[0].name);
        }
        oldClassData = data;
    };

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
            if (JSON.stringify(oldLectureData) != JSON.stringify(data)) {
                $(".lecturesList").html(HTML);
                $('.classTitle').html(data[0].name);
                $('.classLeaveButton').attr("cid", data[0].cid);
            }
            oldLectureData = data;
        }
    };

    /**************** QUESTIONS METHODS ******************/
    // uses handlebar templates to display list of questions
    this.setQuestions = function (data) {
        var source = $("#questionsTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "",
            correctanswers = 0,
            notanswered = 0,
            incorrectanswers = 0;
        for (var i = 0; i < data.length; i++) {
            data[i].buttonHTML = this.constructButtons(JSON.parse(data[i].buttontype));
            data[i].qnum = i + 1; // gets question number
            if (data[i].isvisible == 0) {
                data[i].greyed = true;
            }
            if (data[i].responses.total < 1) {
                data[i].notanswered = true;
                notanswered++;
            } else if (data[i].responses.correctresponses > 0) {
                data[i].correctanswer = true;
                correctanswers++;
            } else {
                data[i].incorrectanswer = true;
                incorrectanswers++;
            }
            HTML = HTML + template(data[i]);
        }
        if (HTML == "") {
            HTML = "No Questions.";
        }
        if (JSON.stringify(oldQuestionsData) != JSON.stringify(data)) {
            $(".questionList").html(HTML);
            $('.lectureTitle').html(data[0].title);
        }
        oldQuestionsData = data;
        $("#correct").html(correctanswers);
        $("#incorrect").html(incorrectanswers);
        $("#notanswered").html(notanswered);
        $("#percentage").html(correctanswers / data.length * 100);
    };

    /**************** QUESTION METHODS ******************/
    // uses handlebar templates to display current question
    this.setQuestion = function (data) {
        var source = $("#questionTemplate").html(),
            template = Handlebars.compile(source),
            HTML = "";
        console.log(data.responses);
        data.buttonHTML = this.constructButtons(JSON.parse(data.buttontype), data.qid);
        if (data.responses.total < 1) {
            data.notanswered = true;
        } else if (data.responses.correctresponses > 0) {
            data.correctanswer = true;
        } else {
            data.incorrectanswer = true;
        }
        //data.correctanswer = true;
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
                "colour": button.colour,
                "value": button.value,
                "text": button.text,
                "qid": button.qid
            }
            buttonHTML = buttonHTML + buttonTemplate(data[i]);
        }
        return buttonHTML;
    };

    /**************** SEARCH METHODS ******************/
    // uses handlebar templates to display list of results
    this.setClassSearchResult = function (data) {
        if (data != "") {
            var HTML = "No Classes";
            if (data != {}) {
                var source = $("#classesResultTemplate").html(),
                    template = Handlebars.compile(source);
                HTML = "";
                for (var i = 0; i < data.length; i++) {
                    if (data[i].isvisible == 0) {
                        data[i].greyed = true;
                    }
                    HTML = HTML + template(data[i]);
                }
            }
            $(".searchResult").html(HTML);
        } else {
            $(".searchResult").empty();
        }
    };
    /**************** MISC METHODS ******************/

    // sets user to specified data
    this.setUser = function (data) {
        $(".usernameDisplay").text(data.realname);
        $(".userTypeDisplay").text(data.isLecturer);
    };

    // join class response display
    this.joinClass = function (data) {
        // shows a toast with the response
        Materialize.toast(data, 1000);
    };

    // leave class response display
    this.leaveClass = function (data) {
        // shows a toast with the response
        Materialize.toast(data, 1000);
    };

    // submit answer response display
    this.submitAnswer = function (data, value) {
        if (data.response == "correct") {
            $('#buttonDiv').html('<div class="container"><div class="green card white-text"> <br><h5 class="logo">Correct!</h5><h5>The answer was ' + data.value + '</h5><br></div></div>');
        } else if (data.response == "incorrect") {
            $('#buttonDiv').html('<div class="container"><div class="red card white-text"> <br><h5 class="logo">Incorrect!</h5><h5>The answer was ' + data.value + '</h5><br></div></div>');
        } else {
            Materialize.toast("Problem submitting answer, question may be closed.", 2000);
        }
    };

    // toast message display function
    //TODO move all of above into this
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