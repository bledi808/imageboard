// const { a } = require("aws-sdk");

console.log("sanity");

// IIFY

new Vue({
    el: "#container",
    data: {
        images: [],
    },
    mounted: function () {
        const me = this;
        axios.get("/images").then(function (response) {
            me.images = response.data; // works
            console.log(me.images);
        });
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
