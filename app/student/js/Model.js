function Model() {
    var user = {},
        userClasses = [],
        userLectures = [],
        userQuestions = [],
        curQuestion,
        curLecture,
        searchType = "",
        lastSearch = "";

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

    // adds current user to class specified
    this.joinClass = function (data) {
        return $.ajaxPOST("php/joinClass.php", data);
    };

    // removes current user from class specified
    this.leaveClass = function (data) {
        return $.getValues("php/leaveClass.php", data);
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

    this.getCurLecture = function () {
        return curLecture;
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

    // returns the current saved user questions
    this.getUserQuestions = function () {
        return userQuestions;
    };

    // submits answers for question
    this.submitAnswer = function (data) {
        return $.getValues("php/submitAnswer.php", data);
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

    /**************** SEARCH METHODS ******************/
    // retrieves info about classes searched for with value
    this.getClassSearchResult = function (data) {
        if (data != this.getLastSearch()) {
            this.setLastSearch(data);
            console.log(this.getSearchType());
            var searchData = {};
            switch (this.getSearchType()) {
            case "name":
                searchData.name = data;
                break;
            case "lecturer":
                searchData.lecturer = data;
                break;
            default:
                searchData.code = data;
                break;
            }
            console.log(searchData);
            return $.getValues("php/searchClasses.php", searchData);
        }
    };

    // returns the last search text
    this.getLastSearch = function () {
        return lastSearch;
    };

    // sets the last search text
    this.setLastSearch = function (data) {
        lastSearch = data;
    };

    // sets the type of search i.e. code, lecturer etc
    this.setSearchType = function (data) {
        searchType = data;
    }

    // gets the type of search i.e. code, lecturer etc
    this.getSearchType = function () {
        return searchType;
    }

    /**************** MISC METHODS ******************/
    // retrieves info about current user using SESSION ID in php
    this.getUser = function () {
        user = $.getValues("php/getUser.php", {});
        return JSON.parse(user);
    };

    // simple log out function
    this.logout = function () {
        // setting the php session ID to null
        $.getValues("../php/logout.php", {});
        // moving the user to the login page.
        window.location.href = '..';
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
}