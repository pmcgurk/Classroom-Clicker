function Prototype() {
    //console.log("Model Created");
    this.init = function () {
        console.log("init");
        $('#displaybuttons').click(this.displayButtons);
        $('.presetselect').click(this.preset);
    };

    this.displayButtons = function () {
        var data = JSON.parse($('#buttonjson').val());
        var buttonSource = $("#buttonTemplate").html(),
            buttonTemplate = Handlebars.compile(buttonSource),
            buttonHTML = "";
        for (var i = 0; i < data.length; i++) {
            var button = data[i];
            values = {
                "colour": button.colour,
                "value": button.value,
                "text": button.text
            }
            buttonHTML = buttonHTML + buttonTemplate(values);
        }
        $('#buttonDisplay').html(buttonHTML);
    };

    // function which takes a JSON of button information and returns the constructed HTML code.
    this.constructButtons = function (data) {
        var buttonSource = $("#buttonTemplate").html(),
            buttonTemplate = Handlebars.compile(buttonSource),
            buttonHTML = "";
        for (var i = 0; i < data.length; i++) {
            var button = data[i];
            values = {
                "colour": button.colour,
                "value": button.value,
                "text": button.text
            }
            buttonHTML = buttonHTML + buttonTemplate(values);
        }
        console.log("Button HTML code created: " + buttonHTML);
        return buttonHTML;
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
    var p = new Prototype();
    p.init();
});