
(function(){
    Vue.component("card", {
        template: "#card-popup",
        // props array for gaining acces to the info being passed
        // down by the parent
        props:["id"],
        data: function() {
            return {
                url: "",
                title: "",
                description: "",
                username: "",
                comments: [],
                component_user: "",
                component_comment: ""
            };
        },
        mounted: function() {
            const self = this;
            // getting image data
            // console.log(location.hash);
            axios.get(`/image/${this.id}`).then(function(result){
                // console.log(this);
                self.url = result.data.url;
                self.title = result.data.title;
                self.description = result.data.description;
                self.username = result.data.username;
                // console.log("This is the url:", self.url);
            }).catch(function(error){
                console.log("Error in axios GET:", error);
            });
            //getting comment data
            axios.get(`/comments/${this.id}`).then(function(result){
                // console.log("Comments:", result);
                self.comments = result.data;
            }).catch(function(error) {
                console.log("Error in comments:", error);
            });
        },
        methods: {
            // this method is closing the modal
            close: function() {
                this.$emit("close");
            },
            submitComment: function(){
                const self = this;
                // console.log(this.component_comment);
                axios.post("/comment", {imageId: this.id, username: this.component_user, comment: this.component_comment}).then(function(result) {
                    self.comments.unshift(result.data);
                }).catch(function(error){
                    console.log("Error in axios POST:", error);
                });
            }
        }

    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            // data properties that will store the value of input fileds
            title: "",
            description: "",
            username: "",
            file: null,
            // imageId: null,
            imageId: location.hash.length>1? location.hash.slice(1) : null
        },
        mounted: function() {
            // console.log(location.hash);
            var self = this;
            axios.get("/images").then(function(response) {
                self.images = response.data;
                // console.log("images",self.images);
            });

            window.addEventListener("hashchange", function(){
                console.log("It triggers!!!");
                self.imageId=location.hash.slice(1);
                
            });
            
            
        },
        methods: {
            myFunction: function() {
                console.log("Running!!!");
            },
            handleClick: function(e) {
                e.preventDefault(); // to ensure our url won't change
                // console.log("Properties in data are this:",this);

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
                }).finally(function() {
                    document.getElementById('file-label').innerText='Choose another file';
                });
            },
            handleChange: function(e) {
                // console.log("Handle change is running!");
                // console.log("File:", e.target.files[0]);
                this.file = e.target.files[0];
                // console.log("This after adding file to data", this);
                var label = document.getElementById("file-label");
                label.innerHTML = this.file.name;
            },
            setComponentimageId: function(id) {
                // console.log("This is id:", id);
                this.imageId = id;
            
            },
            closeOverlay: function() {
                // console.log("This in image:", imageId);
                this.imageId = null;
                // all your base are belong to us
                window.history.back();
            }
        }
    });
})();