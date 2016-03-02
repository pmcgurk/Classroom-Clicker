function Model() {
    var user = {},
        userClasses = [],
        userLectures = [],
        userQuestions = [],
        curQuestion,
        curLecture,
        currentResponseQuestion,
        lastResponses = [];

    this.init = function () {
        //console.log("Model Init");
    };

    /**************** CLASS METHODS ******************/
    // returns current saved user classes of cid
    this.getUserClassInfo = function (cid) {
        for (var i = 0; i < userClasses.length; i++) {
            if (userClasses[i].cid == cid) {
                return userClasses[i];
            }
        }
        return null;
    };

    // returns current saved user classes
    this.getUserClasses = function () {
        return userClasses;
    };

    // retrieves classes that the user enrols in
    this.getClasses = function () {
        userClasses = JSON.parse($.getValues("php/getClasses.php", null));
        return userClasses;
    };

    this.removeClass = function (event) {
        var cid = $(event.currentTarget).attr("cid");
        var removed = $('input.classEditRemove[cid="' + cid + '"]')[0].checked;
        $('input.classEditRemove[cid="' + cid + '"]')[0].checked = !removed;
        if (removed) {
            $(event.currentTarget).html("MARK CLASS FOR DELETION");
            return "Class unset for Removal.";
        } else {
            $(event.currentTarget).html("UNMARK CLASS FOR DELETION");
            return "Class set for Removal. Save to confirm.";
        }
    }

    // compiles the edit classes interfaces JSON and sends to database
    this.saveClass = function (data) {
        if (data.code != "" && data.name != "") {
            console.log($.ajaxPOST("php/editClass.php", data));
        } else {
            console.log("Invalid Class Name/code");
        }
    };

    this.getEnrolledStudents = function (data) {
        return JSON.parse($.getValues("php/getEnrolled.php", data));
    }

    this.editStudent = function (data) {
        var checked = !($("a.studentEnrolledRemoveButton[uid=" + data.uid + "]").attr("removed") === 'true');
        $("a.studentEnrolledRemoveButton[uid=" + data.uid + "]").attr("removed", "" + checked);
        if (checked) {
            $("a.studentEnrolledRemoveButton[uid=" + data.uid + "]").html("<i class='material-icons'>undo</i>");
            return "Removed Student";
        } else {
            $("a.studentEnrolledRemoveButton[uid=" + data.uid + "]").html("<i class='material-icons'>remove_circle</i>");
            return "Readded Student";
        }
        return $.ajaxPOST("php/editEnrolled.php", data);
        //TODO MVC
    }

    this.removeLecture = function (event) {
        var lid = $(event.currentTarget).attr("lid");
        var removed = $('input.lectureEditRemove[lid="' + lid + '"]')[0].checked;
        $('input.lectureEditRemove[lid="' + lid + '"]')[0].checked = !removed;
        if (removed) {
            $(event.currentTarget).html("MARK LECTURE FOR DELETION");
            return "Lecture unset for Removal.";
        } else {
            $(event.currentTarget).html("UNMARK LECTURE FOR DELETION");
            return "Lecture set for Removal. Save to confirm.";
        }
    };

    /**************** LECTURE METHODS ******************/
    // gets information on saved user lecture with specified lid
    this.getUserLectureInfo = function (lid) {
        for (var i = 0; i < userLectures.length; i++) {
            if (userLectures[i].lid == lid) {
                return userLectures[i];
            }
        }
        return null;
    };

    // returns the current saved user lectures
    this.getUserLectures = function () {
        return userLectures;
    };

    // retrieves lectures for class cid from database
    this.getLectures = function (cid) {
        userLectures = JSON.parse($.getValues("php/getLectures.php", {
            "cid": cid
        }));
        return userLectures;
    };

    this.removeQuestion = function (event) {
        var qnum = $(event.currentTarget).attr("qnum");
        var removed = $('input.removeQuestionSwitch[qnum="' + qnum + '"]')[0].checked;
        $('input.removeQuestionSwitch[qnum="' + qnum + '"]')[0].checked = !removed;
        if (removed) {
            $(event.currentTarget).html("Remove");
            return "Question set for Removal.";
        } else {
            $(event.currentTarget).html("Undo");
            return "Question unset for Removal.";
        }
    };

    // compiles the edit classes interfaces JSON and sends to database
    this.saveEditLecture = function (data) {
        console.log(data);
        console.log($.ajaxPOST("php/editLecture.php", data));
        for (var i = 0; i < data.questions.length; i++) {
            data.questions[i].lid = data.lid;
            var response = $.getValues("php/editQuestion.php", data.questions[i]);
        }
    };

    this.saveNewLecture = function (data) {
        console.log($.ajaxPOST("php/editLecture.php", data));
    };

    this.createButtonJSON = function (qnum) {
        var buttons = [];
        for (var i = 0; i < $('.createButtonJSONForm[qnum="' + qnum + '"]').length; i++) {
            var button = {
                "value": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[name="buttonvalue"]')[i].value,
                "colour": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('select[name="buttoncolour"]')[i].value,
                "text": $('.createButtonJSONForm[qnum="' + qnum + '"]').find('input[name="buttontext"]')[i].value
            }
            buttons.push(button);
        }
    };


    /**************** QUESTION METHODS ******************/
    // retrieves questions for lecture lid from database
    this.getQuestions = function (lid) {
        curLecture = lid;
        userQuestions = $.getValues("php/getQuestions.php", {
            "lid": lid
        });
        return userQuestions;
    };

    this.getUserQuestions = function () {
        return userQuestions;
    };

    // retrieves info about current user using SESSION ID in php
    this.getUser = function () {
        user = $.getValues("php/getUser.php", {});
        return JSON.parse(user);
    };

    // retrieves responses for question qid from database
    this.getResponses = function (qid) {
        return responses = $.getValues("php/getResponses.php", {
            "qid": qid
        });
    };

    /********************* RESPONSES METHODS *******************/
    this.getUpdatedResponses = function () {
        var responses = $.getValues("php/getResponses.php", {
            "qid": this.getCurrentResponseQuestion()
        });
        lastResponses = responses;
        return responses;
    };

    this.getRandomInt = function () {
        return Math.floor((Math.random() * 4) + 1);
    };

    this.addDummyData = function () {
        var dummyAnswer = (this.getRandomInt() == 1);
        var data = {
            'value': dummyAnswer,
            'qid': 1
        };
        return $.getValues("php/submitAnswer.php", data);
    };

    this.getOldResponses = function () {
        if (lastResponses == "") {
            return undefined;
        }
        return lastResponses;
    };

    this.clearOldResponses = function () {
        lastResponses = "";
    };

    this.getCurrentResponseQuestion = function () {
        return currentResponseQuestion;
    };

    this.setCurrentResponseQuestion = function (data) {
        currentResponseQuestion = data;
    };

    this.getCurLecture = function () {
        return curLecture;
    };

    // simple log out function
    this.logout = function () {
        // setting the php session ID to null
        $.getValues("../php/logout.php", {});
        // moving the user to the login page.
        window.location.href = '..';
    };

    this.getNextQuestion = function () {
        var uQ = JSON.parse(userQuestions);
        for (var i = 0; i < uQ.length; i++) {
            if (uQ[i].qid == curQuestion) {
                for (var e = i + 1; e < uQ.length; e++) {
                    if (uQ[e].isvisible == 1) {
                        //console.log("Next Question: " + uQ[e].qid);
                        return uQ[e].qid;
                    }
                }
            }
        }
    };

    this.getPreviousQuestion = function () {
        var uQ = JSON.parse(userQuestions);
        for (var i = 0; i < uQ.length; i++) {
            if (uQ[i].qid == curQuestion) {
                for (var e = i - 1; e >= 0; e--) {
                    if (uQ[e].isvisible == 1) {
                        //console.log("Previous Question: " + uQ[e].qid);
                        return uQ[e].qid;
                    }
                }
            }
        }
    };

    // takes a qid and returns information about the question in a presentable manner
    // TODO test for visibility issues with using trys.
    this.getQuestion = function (qid) {
        curQuestion = qid;
        // parses var containing questions of last lecture clicked on.
        var q = JSON.parse(userQuestions);
        for (var i = 0; i < q.length; i++) {
            if (q[i].qid == qid) {
                // qid != qnum, so qnum is taken array index
                q[i].qnum = i + 1;
                try {
                    // sets "qnumn" (question number next) to i + 1
                    // try here if it is the last question.
                    q[i].qnumn = q[i + 1].qid;
                    if (q[i + 1].isvisible == 0) {
                        // next question is invisible, make the qnumn + 2
                        q[i].qnumn = q[i + 2].qid;
                    }
                } catch (err) {
                    //console.log("last question, no next");
                }
                try {
                    // sets "qnump" (question number previous) to i + 1
                    // try here if it is the first question.
                    q[i].qnump = q[i - 1].qid;
                    if (q[i - 1].isvisible == 0) {
                        // previous question is invisible, make the qnumn - 2
                        q[i].qnump = q[i - 2].qid;
                    }
                } catch (err) {
                    //console.log("first question, no previous");
                }
                return JSON.stringify(q[i]);
            }
        }
    };


    //*** Update Function ***//
    this.update = function () {
        var updateData = {};
        updateData = {
            "classes": this.getClasses()
        };
        return updateData;
    }

    // a jquery extend for nicer ajax
    // modified from code from http://stackoverflow.com/a/3504020
    jQuery.extend({
        getValues: function (url, data) {
            var response = null;
            $.ajax({
                url: url,
                type: 'get',
                data: data,
                async: false,
                success: function (data) {
                    response = data;
                }
            });
            return response;
        }
    });

    jQuery.extend({
        ajaxPOST: function (url, data) {
            var response = null;
            $.ajax({
                url: url,
                type: 'post',
                data: data,
                async: false,
                success: function (data) {
                    response = data;
                }
            });
            return response;
        }
    });
}