const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
// const url = 'mongodb://127.0.0.1:27017/diky';
const url = `mongodb+srv://diky:diky@cluster0.rgl53hn.mongodb.net/shortUrl?retryWrites=true&w=majority&ssl=true`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', {
    shortUrls: shortUrls,
    baseUrl: 'https://' + req.get('host') + req.originalUrl,
    // baseUrl: req.protocol + 'https://' + req.get('host') + req.originalUrl,
  });
});

app.post('/shortUrls', async (req, res) => {
  // find the shortUrl with the same shortUrl
  const shortUrl = await ShortUrl.findOne({ short: req.body.shorturl });
  console.log(shortUrl);
  if (shortUrl == null) {
    await ShortUrl.create({ full: req.body.fullUrl, short: req.body.shorturl });
    return res.redirect('/');
  } else {
    return res.redirect('/');
  }
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
console.log('Server is running on port 5000');
