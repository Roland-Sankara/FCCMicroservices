var express = require('express');
const bodyParser = require('body-parser');
var app = express();

console.log('Hello World');

// Middleware

// Parse the request body
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
  console.log(req);
  next();
})

// Create a time server
app.get('/now',(req,res,next)=>{
  req.time = new Date().toString();
  next();
},(req,res)=>{
  res.json({time: req.time});
})

app.use((req,res,next)=>{
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})


// Making assests available
app.use('/public',express.static(__dirname + "/public"));

// app.get('/',(req,res)=>{
//   res.send('Hello Express');
// })

// serving an HTML file 
app.get('/',(req,res)=>{
  let path = __dirname + "/views/index.html"
  res.sendFile(path)
})

// Serving JSOn data and use of env variables
app.get('/json',(req,res)=>{
  if(process.env.MESSAGE_STYLE === 'uppercase'){
    res.json({message:"Hello json".toUpperCase()});
  }else{
    res.json({message:"Hello json"});
  }
  
})

// Route parameter input from client
app.get('/:word/echo',(req,res)=>{
  res.json({echo: req.params.word});
})

// Query parameter input from client
// https://google.com/name?first=roland&last=sankara
app.get('/name',(req,res)=>{
  res.json({name: `${req.query.first} ${req.query.last}`});
})

// Post data using post request
app.post('/name',(req,res)=>{
  res.json({name:`${req.body.first} ${req.body.last}`});
})




 module.exports = app;
