var switchView = function () {
    var view = $(this).attr("value");
    //console.log("Switching to: " + view);
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].className.indexOf("page") > -1) {
            if (divs[i].id != view) {
                $('#' + divs[i].id + '').hide();
                // console.log("hiding " + divs[i].id);
            } else {
                $('#' + divs[i].id + '').show();
                // console.log("showing " + divs[i].id);
            }
        }
    }
};

$(document).ready(function () {
    $('.button-collapse').sideNav({
        closeOnClick: true
    });
    $('.pageChangerButton').click(switchView)
});