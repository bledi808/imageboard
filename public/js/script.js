// const { a } = require("aws-sdk");

// IIFY
(function () {
    Vue.component("my-component", {
        template: "#template",
        props: ["imageId"],
        // id: [""],
        data: function () {
            return {
                preview: "",
                comments: [],
            };
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
            const me = this;
            axios
                .get(`/images/${this.imageId}`)
                .then(function (response) {
                    me.preview = response.data;
                })
                .catch(function (err) {
                    console.log("error in POST /images", err);
                });

            // axios for get comments by id
            axios.get(`/comments/${this.imageId}`).then(function (response) {
                console.log("res in GET axios /commentsid", response);
                me.comments = response.data;
                console.log("me.comments GET axios /commentsid", me.comments);
            });
        },
        methods: {
            closeModal: function () {
                // console.log("closeModal runs and about to EMIT from component");
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
            more: true,
        },
        mounted: function () {
            const me = this;

            addEventListener("hashchange", function () {
                // console.log("hash has changed successfully");
                me.imageId = location.hash.slice(1);
            });

            axios
                .get("/images")
                .then(function (response) {
                    me.images = response.data; // works
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
                        images.unshift(response.data.rows[0]);
                    })
                    .catch(function (err) {
                        console.log("error in axios POST /upload", err);
                    });
            },
            loadMore: function (e) {
                e.preventDefault();
                console.log("LoadMore running");
                let me = this;
                let lowestId = this.images[this.images.length - 1].id;
                axios
                    .get(`/more/${lowestId}`)
                    .then(function (response) {
                        for (let i = 0; i < response.data.length; i++) {
                            me.images.push(response.data[i]);
                        }
                        if (
                            response.data[response.data.length - 1].id <=
                            response.data[0].lowestId
                        ) {
                            me.more = null;
                        }
                    })
                    .catch(function (err) {
                        console.log("error in axios POST /more", err);
                    });
            },
            selectImage: function (e) {
                console.log("selectImage running");

                this.file = e.target.files[0]; // grab the selected file
            },
            imagePopup: function (e) {
                this.imageId = e;
            },
            closeModal: function () {
                location.hash = "";
            },
        },
    });
})();
