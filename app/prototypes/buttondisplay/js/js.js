function Model() {
    //console.log("Model Created");
    this.init = function () {
        console.log("init");
        $('#displaybuttons').click(this.displayButtons);
        $('.presetselect').click(this.preset);
    };

    this.displayButtons = function () {
        var buttonSource = $("#buttonTemplate").html(),
            buttonTemplate = Handlebars.compile(buttonSource);

        var buttonjson = JSON.parse($('#buttonjson').val());
        console.log(buttonjson);
        var buttonHTML = "";
        for (var i = 0; i < buttonjson.length; i++) {
            var button = buttonjson[i];
            data = {
                "colour": button.colour,
                "value": button.value,
                "text": button.text
            };
            buttonHTML = buttonHTML + buttonTemplate(data);
        }
        $('#buttonDisplay').html(buttonHTML);
    };

    this.preset = function () {
        var truefalsejson = [{
            "text": "True",
            "colour": "green",
            "value": "true"
        }, {
            "text": "False",
            "colour": "red",
            "value": "false"
        }];

        var ABCDjson = [{
            "text": "A",
            "colour": "red",
            value: "A"
        }, {
            "text": "B",
            "colour": "green",
            value: "B"
        }, {
            "text": "C",
            "colour": "blue",
            value: "C"
        }, {
            "text": "D",
            "colour": "yellow darken-1",
            value: "D"
        }]

        var numjson = [{
            "text": "1",
            "colour": "red",
            value: "1"
        }, {
            "text": "2",
            "colour": "green",
            value: "2"
        }, {
            "text": "3",
            "colour": "blue",
            value: "3"
        }, {
            "text": "4",
            "colour": "yellow darken-1",
            value: "4"
        }]
        var presets = [truefalsejson, ABCDjson, numjson];
        $('#buttonjson').val(JSON.stringify(presets[$(this).attr("value")]));

    };

}

$(document).ready(function () {
    var model = new Model();
    model.init();
});