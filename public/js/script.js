
(function(){
    // connection our html to our vue component
    // it must be equal to our script tag
    //Vue.component("first-component", {
    //    template: "#template",
    //    data: function() {
    //        return {
    //            name: "Andrea"
    //        };
    //    }
    //});
    // for part3 we're passing image id from parent to a child(kebab-case in html)

    var memes = Vue.component("memes", {
       
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            // data properties that will store the value of input fileds
            title: "",
            description: "",
            username: "",
            file: null
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                self.images = response.data;
                console.log("images",self.images);
            });
        },
        methods: {
            myFunction: function() {
                console.log("Running!!!");
            },
            handleClick: function(e) {
                e.preventDefault(); // to ensure our url won't change
                console.log("Properties in data are this:",this);

                // sending data
                var formData = new FormData();
                // we're only using formdata because We are working with a file
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                
                // sending data to server via axios
                var self = this;
                axios.post("/upload", formData).then(function(response){
                    self.images.unshift(response.data);
                    self.title = "";
                    self.description = "";
                    self.username = "";
                    self.file = "";
                }).catch(function(error) {
                    console.log("Error in post:", error);
                });
            },
            handleChange: function(e) {
                console.log("Handle change is running!");
                console.log("File:", e.target.files[0]);
                this.file = e.target.files[0];
                console.log("This after adding file to data", this);
                var label = document.getElementById("file-label");
                label.innerHTML = this.file.name;
            }
        }
    });
})();