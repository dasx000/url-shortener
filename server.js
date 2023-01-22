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
  const short = req.body.shorturl;
  console.log(short);
  console.log(typeof short);
  if (short.length > 40) return res.redirect('/');
  if (shortUrl == null) {
    await ShortUrl.create({ full: req.body.fullUrl, short: short });
    return res.redirect('/');
  } else {
    return res.redirect('/');
  }
});
app.get('/shortUrls', async (req, res) => {
  // find the shortUrl with the same shortUrl
  const shortUrl = await ShortUrl.findOne({ short: req.query.short });
  console.log(shortUrl);
  if (shortUrl == null) {
    await ShortUrl.create({ full: req.query.full, short: req.query.short });
    // return json
    return res.json({
      status: 200,
      shortUrl: 'https://' + req.get('host') + '/' + req.query.short,
      fullUrl: req.query.full,
    });
  } else {
    return res.json({
      status: 404,
    });
  }
});
app.get('/del/:short', async (req, res) => {
  // find the shortUrl with the same shortUrl
  const shortUrl = await ShortUrl.findOne({ short: req.params.short });
  if (shortUrl != null) {
    // delete data from params
    await ShortUrl.deleteOne({ short: req.params.short });
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
