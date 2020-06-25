//console.log("Linked");

(function(){
    new Vue({
        el: "#main",
        data: {
            title: "",
            visible: true,
            images: []
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                self.images = response.data;
                console.log("images",self.images);
            });
        },
        methoods: {
            myFunction: function() {
                console.log("Running!!!");
            }
        }
    });
})();