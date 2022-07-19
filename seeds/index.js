const mongoose = require('mongoose');
const CGModel = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelpScratch', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => { console.log('Database connected'); });

const seedDB = async () => {
  await CGModel.deleteMany();
  for (let i = 0; i < 5; i++) {
    const campsite = new CGModel({
      title: descriptors[1] + ' ' + places[i],
      price: "£22.00",
      location: cities[i].city,
      description: "This is a great place to go camping"
    });
    await campsite.save();
    // console.log(descriptors[i] + ' ' + places[i] + ', ' + cities[i].city);
  }
  // await myCampGround.save();
}

seedDB();