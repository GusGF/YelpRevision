const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/deleteDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: String,
  age: Number
})
const User = mongoose.model('User', UserSchema)

const TweetSchema = new mongoose.Schema({
  text: String,
  likes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})
const Tweet = mongoose.model('Tweet', TweetSchema)

const makeTweets = async () => {
  // const user = new User({ username: 'Gus Fring', age: 57 })
  // user.save()
  const fring = await User.findOne({ name: 'Gus Fring' })
  const tweet = new Tweet({ text: "This is the body of my tweet", likes: 'Many', user: fring })
  // tweet.save()
  // Displays tweet incl the full user breakdown
  console.log(tweet)
  // Displays tweet and only the user's name
  console.log(await tweet.populate('user', 'username'))
}

makeTweets()