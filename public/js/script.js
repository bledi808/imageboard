// const { a } = require("aws-sdk");

// IIFY
(function () {
    Vue.component("my-component", {
        template: "#template",
        props: ["imageId"],
        // id: [""],
        data: function () {
            return { preview: "" };
        },
        mounted: function () {
            //  make an axios request to the server to get info about the image the user clicked on (get url, title, description, username, created_at)

            console.log("this in component mounted", this);
            const me = this;
            // console.log("this:", this);
            // console.log("this.imageId:", this.imageId);
            axios
                .get(`/images/${this.imageId}`)
                .then(function (response) {
                    me.preview = response.data;
                    // selectedImage = response.data; // works
                    console.log("GET axious response ", me.preview);
                })
                .catch(function (err) {
                    console.log("error in POST /images", err);
                });
        },
        methods: {
            closeModal: function () {
                console.log("closeModal runs and about to EMIT from component");
                this.$emit("close"); //
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            //data properties that will store values of input fields
            title: "",
            description: "",
            username: "",
            file: null,
            // display: 10,
            imageId: null,
        },
        mounted: function () {
            const me = this;
            axios
                .get("/images")
                .then(function (response) {
                    me.images = response.data; // works
                    // console.log(me.images);
                    // console.log("GET axious response", response);
                })
                .catch(function (err) {
                    console.log("error in POST /images", err);
                });
        },
        methods: {
            sayHello: function () {
                console.log("hellooo image no:", this.imageId);
            },
            imagePopup: function (e) {
                console.log("id of image clicked", e);
                this.imageId = e;
            },
            closeModal: function () {
                // e.stopPropogation();
                this.imageId = null;
            },
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
                        console.log(
                            "response.data.rows[0]",
                            response.data.rows[0]
                        );
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
})();
