function Model() {
    
    this.init = function() {
        
        
    };
    
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