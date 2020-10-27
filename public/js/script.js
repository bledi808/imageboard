// const { a } = require("aws-sdk");

console.log("sanity");

// IIFY

new Vue({
    el: "#container",
    data: {
        images: [],
        //data properties that will store vlaues of input fields
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
                // console.log(me.images);
            })
            .catch(function (err) {
                console.log("error in POST /images", err);
            });
    },
    method: {
        handleClick: function (e) {
            e.preventDefault();
            // console.log("this", this); // this referes to the object we are inside of (i.e. will show us what is inside data)
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);

            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log("reponse from POST /upload", response);
                })
                .catch(function (err) {
                    console.log("error in POST /upload", err);
                });
        },
        handleChange: function (e) {
            console.log("handleChangeRunning");
            console.log("file: ", e.target.files(0)); // location of the selected file and  access to the file
            this.file = e.target.files(0); // grab the selected file
        },
    },
});

// new Vue({
//     el: "#main",
//     data: {
//         name: "pimento",
//         seen: false,
//         cities: [],
//         restuarants: [],
//     },
//     methods: {
//         myFancyMethod: function (cityName) {
//             console.log("my function is fancy", cityName);
//         },
//     },
//     mounted: function () {
//         console.log("mounted!!!");
//         console.log("this.name", this.name);
//         console.log("this.cities", this.cities);
//         // axios is a library used to make http requests
//         const me = this;
//         axios.get("/cities").then(function (response) {
//             console.log("response", response);
//             // this.cities = response.data// reference of this changes to window when inside a nested function
//             me.cities = response.data; // works
//         });

//         this.restaurants = [
//             {
//                 fastFood: "kfc",
//                 fineDining: "mcdonals",
//             },
//         ]; // can populate empty array in the mounted functiom
//     },
// });
