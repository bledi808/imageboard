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
        watch: {
            id: function () {
                console.log("the prop changed");
                // axios request here to get the info for the new ImageId (you can copy and paste everything in mounted here - better would be to store this axios in a function outside and call the function here and below - more dry - i.e. add a method to vue.component for the axios and call this method in watch and in mounted)
                //when calling method: this.methodName()

                //handle case of user putting in an id that doesnt exist in our DB -
                //if we get back a response from the server with no image id (as the ID requested by user doesnt exist in DB), easiest thing to do is close the modal
            },
        }, // used for clikcing next/back to access different image in modal mode
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
            title: "",
            description: "",
            username: "",
            file: null,
            imageId: location.hash.slice(1),
        },
        mounted: function () {
            const me = this;

            addEventListener("hashchange", function () {
                console.log("hash has changed successfully");
                me.imageId = location.hash.slice(1);
                console.log("ImageId", me.imageId);
            });

            axios
                .get("/images")
                .then(function (response) {
                    me.images = response.data; // works
                    console.log("me.images in axios /GET", me.images);
                })
                .catch(function (err) {
                    console.log("error in POST /images", err);
                });
        },
        methods: {
            uploadImage: function (e) {
                e.preventDefault();
                console.log("uploadImage running");

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
                        // console.log(
                        //     "response.data.rows[0]",
                        //     response.data.rows[0]
                        // );
                        images.unshift(response.data.rows[0]);
                    })
                    .catch(function (err) {
                        console.log("error in axios POST /upload", err);
                    });
            },
            loadMore: function () {
                console.log("LoadMore running");
                const self = this;
                let images = self.images;
                axios
                    .get("/more")
                    .then(function (response) {
                        console.log("response.data.rows", response.data);
                        images.push(response.data);
                        // images.unshift(response.data.rows); //determine what is sent here, probably mutliple rows, not a signle one - ie. response.data.rows
                    })
                    .catch(function (err) {
                        console.log("error in axios POST /more", err);
                    });
            },
            selectImage: function (e) {
                console.log("selectImage running");
                // console.log("file: ", e.target.files[0]); // location of the selected file and  access to the file
                this.file = e.target.files[0]; // grab the selected file
            },
            imagePopup: function (e) {
                console.log("id of image clicked", e);
                this.imageId = e;
            },
            closeModal: function () {
                location.hash = "";
            },
        },
    });
})();
