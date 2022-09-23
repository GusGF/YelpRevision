const mongoose = require('mongoose');
const CGModel = require('../models/campground')
// Data imports
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const dbConn = mongoose.createConnection('mongodb://127.0.0.1:27017/yelpRevDB');

mongoose.connect('mongodb://127.0.0.1:27017/yelpRevDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check we have a good DB connection
dbConn.on('error', console.error.bind(console, 'connection error:'));
dbConn.once('open', () => {
  console.log('Database connected');
});

// Drop the DB
const dropDB = async () => {
  await dbConn.dropDatabase();
  console.log("Database dropped?!")
}

// const dropCollection = async () => {
//   try {
//     // #################################################################################
//     await db.dropCollection('CGModel');
//     console.log("Collection dropped?!");
//   } catch (e) {
//     console.log("Collection NOT dropped or it didn't exit?!");
//   }
// }

const getRandIndex = (theArray) => {
  return Math.floor(Math.random() * (theArray.length));
}

const seedDB = async () => {
  console.log('In the seeding function')
  for (let i = 1; i <= 3; i++) {
    // Setting location to city & place
    let aCity = cities[getRandIndex(cities)];
    let location = `${aCity.city}, ${aCity.state}`;

    // Making the title from the descriptor & place
    let aDescriptor = descriptors[getRandIndex(descriptors)];
    let aPlace = places[getRandIndex(places)];
    let title = `${aDescriptor} ${aPlace}`;

    // Getting a random price
    let rndPrice = Math.floor(Math.random() * 20);
    // #################################################################################
    myCampGround = new CGModel({
      title: title,
      location: location,
      description: "This is a great place to camp!!",
      price: rndPrice,
      image: 'https://source.unsplash.com/collection/483251'
    });
    await myCampGround.save();
  }
  console.log("seeding completed")
}

dropDB();
seedDB().then(() => {
  dbConn.close();
  console.log("DB Populated and connection closed");
}).catch((err) => { console.log(`Error encountered seeding DB: ${err}`) });