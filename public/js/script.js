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
                comment: "",
                username: "",
                // previousId: "",
                // nextId: "",
            };
        },
        watch: {
            imageId: function () {
                this.renderModal();
            },
        }, // used for clikcing next/back to access different image in modal mode
        mounted: function () {
            this.renderModal();
            const me = this;
            // To do this, you should modify the data retrieved by the ajax request your component makes so that it includes, in addition to all of the data for the current image, the id of the previous image and the id of the next image.
            // axios for get comments by id
            axios.get(`/comments/${this.imageId}`).then(function (response) {
                // console.log("res in GET axios /commentsid", response);
                me.comments = response.data;
                // console.log("me.comments GET axios /commentsid", me.comments);
            });
        },
        methods: {
            renderModal: function () {
                const me = this;
                console.log("the prop changed");
                axios
                    .get(`/images/${this.imageId}`)
                    .then(function (response) {
                        if (response.data) {
                            me.preview = response.data;
                        } else {
                            me.closeModal();
                        }
                        // me.preview = response.data;

                        // console.log("me.preview in component axios", response);
                    })
                    .catch(function (err) {
                        console.log("error in POST /images", err);
                    });
            },
            closeModal: function () {
                // console.log("closeModal runs and about to EMIT from component");
                this.$emit("close"); //
            },
            addComment: function (e) {
                e.preventDefault();
                console.log("addComment running");

                let newComment = {
                    comment: this.comment,
                    username: this.username,
                    id: this.imageId,
                };
                let me = this;
                axios
                    .post("/comment", newComment)
                    .then(function (response) {
                        console.log("comments response:", response);
                        if (
                            response.data.comment != "" &&
                            response.data.username != ""
                        ) {
                            me.comments.unshift(response.data);
                            me.comment = "";
                            me.username = "";
                            console.log("me.comments", me.comments);
                        }
                    })
                    .catch(function (err) {
                        console.log("error in axios POST /comment", err);
                    });
            },
            nextImage: function () {
                console.log("nextImage running");
                ///
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
                        // if (
                        //     (response.data.title != "" &&
                        //         response.data.username != "",
                        //     response.data.description != "")
                        // ) {
                        images.unshift(response.data);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        self.file = null;
                        // }
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
