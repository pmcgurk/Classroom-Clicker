function Model() {
    //console.log("Model Created");
    var username = "",
        userType = "",
        userQuestions = [];

    this.init = function () {
        //console.log("Model Init");
    };

    this.getUsername = function () {
        //console.log("Username is: " + username);
        return username;
    };

    this.setUsername = function (newUsername) {
        username = newUsername;
        //console.log("Username set to: " + username);
    };

    this.getUserType = function () {
        //console.log("UserType is: " + userType);
        return userType;
    };

    this.setUserType = function (newUserType) {
        userType = newUserType;
        //console.log("UserType set to: " + userType);
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

    this.saveEditClass = function (data) {
        console.log("Editing class: " + data.cid);
        console.log(data);
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
            "username": this.getUsername(),
            "usertype": this.getUserType(),
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