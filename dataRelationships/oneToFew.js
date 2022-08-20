const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/deleteDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const personSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    { street: String, city: String, state: String, country: String }
  ]
})

const person = mongoose.model('Person', personSchema)

const makeUser = async () => {
  const andy = person({
    first: 'Andy', last: 'Parsons',
    addresses: [{ street: "27 The Demesne", city: "Dublin", state: "Leinster", country: "Ireland" }]
  })
  andy.addresses.push({ street: "56 Vernon Ave", city: "Dublin", state: "Leinster", country: "Ireland" })
  const outcome = await andy.save();
  console.log(outcome)
}

makeUser();