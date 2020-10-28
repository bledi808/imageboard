// const { a } = require("aws-sdk");

console.log("sanity");

// IIFY

Vue.component("some-component", {});

new Vue({
    el: "#main",
    data: {
        images: [],
        //data properties that will store values of input fields
        title: "",
        description: "",
        username: "",
        file: null,
    },
    mounted: function () {
        const me = this;
        axios
            .get("/images")
            .then(function (response) {
                me.images = response.data; // works
                console.log(me.images);
                console.log("GET axious response", response);
            })
            .catch(function (err) {
                console.log("error in POST /images", err);
            });
    },
    methods: {
        handleClick: function (e) {
            e.preventDefault();
            console.log("handleClick running");
            // console.log("this", this); // this referes to the object we are inside of (i.e. will show us what is inside data)
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);

            const self = this;
            let images = self.images;
            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log("response.data.rows[0]", response.data.rows[0]);
                    images.unshift(response.data.rows[0]);
                })
                .catch(function (err) {
                    console.log("error in POST /upload", err);
                });
        },
        handleChange: function (e) {
            console.log("handleChange running");
            console.log("file: ", e.target.files[0]); // location of the selected file and  access to the file
            this.file = e.target.files[0]; // grab the selected file
        },
    },
});
