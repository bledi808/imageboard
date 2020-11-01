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
                nextId: "",
                previousId: "",
            };
        },
        watch: {
            imageId: function () {
                this.renderModal();
                this.displayComments();
            },
        }, // used for clikcing next/back to access different image in modal mode
        mounted: function () {
            this.renderModal();
            this.displayComments();
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
                            me.nextId = response.data.nextId;
                            me.previousId = response.data.previousId;
                        } else {
                            me.closeModal();
                        }
                    })
                    .catch(function (err) {
                        console.log("error in POST /images", err);
                    });
            },
            displayComments: function () {
                const me = this;
                axios
                    .get(`/comments/${this.imageId}`)
                    .then(function (response) {
                        me.comments = response.data;
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
                this.imageId = this.nextId;
            },
            previousImage: function () {
                this.imageId = this.previousId;
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

                if (this.title == "" || this.username == "") {
                    console.log("empty empty");
                    return;
                }

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
                        images.unshift(response.data);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        // self.file = null;
                        self.file.name = "";
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
                let labelName = this.file.name;
                // var inputs = document.querySelectorAll(".input-file");
                var inputs = document.querySelectorAll(".input-file");
                Array.prototype.forEach.call(inputs, function (input) {
                    var label = input.nextElementSibling,
                        labelVal = labelName;
                    var fileName = "";
                    if (fileName) {
                        label.querySelector("span").innerHTML = fileName;
                    } else {
                        label.innerHTML = labelVal;
                    }
                });
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
