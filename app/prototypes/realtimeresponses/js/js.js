function Prototype() {
    //console.log("Model Created");
    var data = [],
        chart,
        colours = ["#4caf50", "#f44336", "#2196f3", "#ffeb3b"];

    this.init = function () {
        console.log("init");
        this.getDummyDataInit();
        this.setResponses(data);
        setInterval($.proxy(this.update, this), 2000);
    };

    this.getDummyDataInit = function () {
        for (var i = 0; i < 1; i++) {
            var dummyData = {};
            dummyData.qid = 1;
            dummyData.value = "value" + this.getRandomInt();
            data.push(dummyData);
        }
        return data;
    };

    this.addDummyData = function () {
        var dummyData = {};
        dummyData.qid = 1;
        dummyData.value = "value" + this.getRandomInt();
        data.push(dummyData);
        console.log(data);
    };

    this.update = function () {
        var oldDataLength = data.length;
        this.addDummyData();
        if (oldDataLength != data.length) {
            for (var i = oldDataLength; i < data.length; i++) {
                var newLabel = this.getIsNewLabel(data[i].value);
                console.log(newLabel);
                if (newLabel) {
                    console.log("New Label");
                    chart.addData({
                        value: 1,
                        color: colours[chart.segments.length],
                        label: data[i].value
                    })
                } else {
                    for (var e = 0; e < chart.segments.length; e++) {
                        if (chart.segments[e].label == data[i].value) {
                            chart.segments[e].value = chart.segments[e].value + 1;
                            console.log("Existing label, label: " + chart.segments[e].label + ", value: " + chart.segments[e].value);
                        }
                    }
                }
            }
        }
        $('#js-legend').html(chart.generateLegend());
        $('#responsesNumber').html("Responses: " + chart.total);
        console.log(chart);
        chart.update();
    };

    this.getIsNewLabel = function (data) {
        for (var i = 0; i < chart.segments.length; i++) {
            if (chart.segments[i].label == data) {
                return false;
            }
        }
        return true;
    };

    this.getRandomInt = function () {
        return Math.floor((Math.random() * 3) + 1);
    };

    this.setResponses = function (data) {
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
                "color": colours[i]
            });
        }
        chart = new Chart(ctx).Pie(cdata, {
            segmentShowStroke: false,
            animateRotate: false,
            animateScale: false,
            tooltipTemplate: "<%= value %>%"

        });
        $('#js-legend').html(chart.generateLegend());
        $('#responsesNumber').html("Responses: " + chart.segments.length);
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

}

$(document).ready(function () {
    var p = new Prototype();
    p.init();
});