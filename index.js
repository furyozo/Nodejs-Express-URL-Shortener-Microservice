const express = require('express')
const app = express();

const URL = require('./models/URL.js')

app.use(express.static('public'))

/**
 * save a new url
 */
app.get('/new/*', (req, res) => {

  var baseURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  baseURL = baseURL.replace(req.originalUrl, '')

  const regex = /https?\:\/\/(www\.)?[a-zA-Z0-9]{1,}\.[a-zA-z]{1,}(\:[0-9]{1,})?$/
  var url = req.originalUrl.substring(5)

  // if the url format is incorrect, return an error
  if (!regex.test(url)) {
    res.send( {error: 'URL formatting error'} )
    res.end()
    return
  }

  // else create a new db url entry
  URL.count({}, function(err, count) {
    if (err) console.error(err)
    if (count === 0) {
      var urlobj = new URL({ id: 0, originalURL: url, newURL: baseURL + '/' + 0})
    }
    else {
      URL.findOne().sort('-id').exec(function(err, item) {
        if (err) console.error(err)
        var urlobj = new URL({ id: item.id+1, originalURL: url, newURL: baseURL + '/' + item.id})
        urlobj.createURL()
        res.send( {original_url: urlobj.originalURL, short_url: urlobj.newURL} )
        res.end()
      })
    }
  })

})

/**
 * all other routes return null
 */
app.get('*', (req, res) => {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  URL.findOne({newURL: url}, function(err, url) {
    if (err) return console.error(err)
    if (url) res.redirect(url.originalURL)
    else     res.send(null)
  })
})

app.listen(3000)
