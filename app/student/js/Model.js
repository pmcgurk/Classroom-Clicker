function Model() {
    var user = {},
        userQuestions = [],
        lastSearch = "";

    this.init = function () {
        //console.log("Model Init");
    };

    this.joinClass = function (data) {
        return $.getValues("php/joinClass.php", data);
    };

    this.leaveClass = function (data) {
        return $.getValues("php/leaveClass.php", data);
    };

    // submits answers for question
    this.submitAnswer = function (data) {
        return $.getValues("php/submitAnswer.php", data);
    };

    // retrieves classes that the user enrols in
    this.getClasses = function () {
        return $.getValues("php/getClasses.php", null);
    };

    // retrieves lectures for class cid from database
    this.getLectures = function (cid) {
        return $.getValues("php/getLectures.php", {
            "cid": cid
        });
    };

    // retrieves questions for lecture lid from database
    this.getQuestions = function (lid) {
        userQuestions = $.getValues("php/getQuestions.php", {
            "lid": lid
        });
        return userQuestions;
    };

    // retrieves info about current user using SESSION ID in php
    this.getUser = function () {
        user = $.getValues("../php/getUser.php", {});
        return JSON.parse(user);
    };

    // retrieves info about classes searched for with value
    // TODO search for class code, name, lecturer, etc.
    this.getClassSearchResult = function (data) {
        if (data != this.getLastSearch()) {
            this.setLastSearch(data);
            return $.getValues("php/searchClasses.php", {
                "value": data
            });
        }
    };

    this.getLastSearch = function () {
        return lastSearch;
    };

    this.setLastSearch = function (data) {
        lastSearch = data;
    };

    // simple log out function
    this.logout = function () {
        // setting the php session ID to null
        $.getValues("../php/logout.php", {});
        // moving the user to the login page.
        window.location.href = '..';
    };

    // takes a qid and returns information about the question in a presentable manner
    // TODO test for visibility issues with using trys.
    this.getQuestion = function (qid) {
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
            "classes": JSON.parse(this.getClasses())
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
}