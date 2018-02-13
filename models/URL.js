const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/')
const db = mongoose.connection
const Schema = mongoose.Schema

/**
 * establish and check db connection
 */
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => { console.log('db connection established') })

/**
 * create URL mongoose schema
 */
const URLSchema = mongoose.Schema({
  id: { type: Number, default: 0, required: true },
  newURL: {type: String, default: '', required: true},
  originalURL: { type: String, default: '', required: true }
})

/**
 * save a new url database entry
 * @param  {string} url url to be saved
 * @return {exception} throws an exception if there was en error inserting the url into the database
 */
URLSchema.methods.createURL = function() {
  this.save(function(err, url) {
    if (err) return console.error(err)
  })
}

module.exports = mongoose.model('URL', URLSchema)
