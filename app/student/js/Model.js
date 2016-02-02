function Model() {
    var user = {},
        userQuestions = [];

    this.init = function () {
        //console.log("Model Init");
    };

    this.submitAnswer = function (data) {
        return $.getValues("php/submitAnswer.php", data);
    };

    this.getClasses = function () {
        return $.getValues("php/getClasses.php", null);
    };

    this.getLectures = function (cid) {
        return $.getValues("php/getLectures.php", {
            "cid": cid
        });
    };

    this.getQuestions = function (lid) {
        userQuestions = $.getValues("php/getQuestions.php", {
            "lid": lid
        });
        return userQuestions;
    };

    this.getUser = function () {
        user = $.getValues("../php/getUser.php", {});
        return JSON.parse(user);
    };

    this.logout = function () {
        $.getValues("../php/logout.php", {});
        window.location.href = '..';
    };

    this.getQuestion = function (qid) {
        var q = JSON.parse(userQuestions);
        for (var i = 0; i < q.length; i++) {
            if (q[i].qid == qid) {
                q[i].qnum = i + 1;
                try {
                    q[i].qnumn = q[i + 1].qid;
                    if (q[i + 1].isvisible == 0) {
                        q[i].qnumn = q[i + 2].qid;
                    }
                } catch (err) {
                    //console.log("last question, no next");
                }
                try {
                    q[i].qnump = q[i - 1].qid;
                    if (q[i - 1].isvisible == 0) {
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