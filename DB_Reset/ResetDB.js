const mongoose = require('mongoose');
// Design the schema for the collection
const CGSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title cannot be blank'] },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  location: { type: String, required: true },
  image: { type: String, required: false }
});
// Model for interacting with our DB
// #################################################################################
const CGModel = mongoose.model('Campground', CGSchema);

// Data imports
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
// Connect and create if necessary to our DB 
// #################################################################################
mongoose.connect('mongodb://localhost:27017/yelpCampRev', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check we have a good DB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const dropDB = async () => {
  await db.dropDatabase();
  console.log("Database dropped?!")
}

const dropCollection = async () => {
  try {
    // #################################################################################
    await db.dropCollection('CGModel');
    console.log("Collection dropped?!");
  } catch (e) {
    console.log("Collection NOT dropped or it didn't exit?!");
  }
}

const getRandIndex = (theArray) => {
  return Math.floor(Math.random() * (theArray.length));
}

const seedDB = async () => {
  for (let i = 0; i <= 5; i++) {
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
}


// dropCollection();
dropDB();
seedDB().then(() => {
  db.close();
  console.log("DB Populated and connection closed");
}).catch((err) => { console.log(`Error encountered seeding DB: ${err}`) });
