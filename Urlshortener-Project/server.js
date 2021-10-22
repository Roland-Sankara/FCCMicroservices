require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const {URL} = require('url');
const app = express();
//Import Url model
const Url = require('./Models/urlModel.js');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Post url to Database
app.post('/api/shorturl', function(req,res){
  try{
    // check if url is start with http or https
    let urlRegex = /^(http|https)/;
    if(!urlRegex.test(req.body.url)){
      return res.json({ error: 'invalid url' });
    }

    let hostname = new URL(req.body.url).hostname;
    dns.lookup(hostname,(err,address,family)=>{
      if(err){
        return res.json({ error: 'invalid url' });
      }
    })

    // check if url already exists
    Url.find({'originalUrl':req.body.url})
    .then(result=>{
      if(result.length){
        return res.json({error: `Url already exists with shortcode: ${result[0].shortUrl}`});
      }else{
        // else post the Url
        postUrl();
      }
    })
    .catch(err=>{
      return res.json(err)
    })

    function postUrl(){
      Url.find()
      .then(result=>{
        let randomChar = null;
        result.length?randomChar = result.length: randomChar = 1;
        const newUrl = new Url({
          originalUrl:req.body.url,
          shortUrl: randomChar
        })

        // Save to Database
        newUrl.save()
        .then(result=>{
          return res.json({original_url:result.originalUrl,short_url:result.shortUrl});
        })
        .catch(err=>{
          return res.json(err);
        })

      })
      .catch(err=>{
        return res.json(err)
      })
    }
  }
  catch(err){
    return res.json({ error: 'invalid url' })
  }
})


// Access the Url by shortcode
app.get('/api/shorturl/:code',(req,res)=>{
  Url.find({'shortUrl':req.params.code})
  .then(result=>{
    if(result.length){
      res.redirect(result[0].originalUrl)
    }
    else{
      res.json({error:"Link doesn't exist"})
    }
  })
  .catch(err=>{
    res.json({error: 'invalid url'})
  })

})

const DBURL = 'mongodb+srv://Sankara:testDB@fcc-data.rgopo.mongodb.net/Short-URL?retryWrites=true&w=majority';

// Connect to the Database
mongoose.connect(DBURL,{useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>{
  console.log('Connection Established . . .')
})
.catch((error)=>{
  console.log('Failed to Connect . . .',error.message)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
