const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateLisitng} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync (listingController.index))  // index route
    .post(isLoggedIn, upload.single("listing[image]"), validateLisitng, wrapAsync (listingController.createListing));  // create route
    
// new route
router.get("/new", isLoggedIn, (listingController.renderNewForm));


router  
    .route("/:id")
    .get(wrapAsync (listingController.showListing))   // show route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateLisitng, wrapAsync (listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing)); // delete route

    
// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

module.exports = router;