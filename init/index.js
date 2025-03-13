// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// async function main() {
//     await mongoose.connect(MONGO_URL);
// }
// main()
//     .then(() => {
//         console.log("connected to the DB");
//     })
//     .catch((err) => {
//         console.log(err);
//     });



// const initDB = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({...obj, owner: "67cbd5af0226a6cf0436b6be"}));
//     const data = await Listing.insertMany(initData.data);
//     console.log(data);
//     console.log("data was initialized");
// }

// initDB();


const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken  ="pk.eyJ1IjoidGFyYWsxOCIsImEiOiJjbTd3bjhzcnQwNm45MmxzNzdxNWZydGxyIn0.PTnv_5-D4MjquIJUwrjD0w";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function response(listing) {
  let res = await geocodingClient
    .forwardGeocode({
      query: listing.location,
      limit: 1,
    })
    .send();
  return res.body.features[0].geometry;
}

async function initDataFunction() {
  await Listing.deleteMany({});
  for (let obj of initData.data) {
    obj.geometry = await response(obj); // Awaiting the response properly
    obj.owner = "67cbd5af0226a6cf0436b6be";
  }

  await Listing.insertMany(initData.data);
  let listings =await Listing.find({});
  console.log(listings)
  console.log("Data was initialized");
}

initDataFunction();