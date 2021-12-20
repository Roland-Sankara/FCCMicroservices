var express = require('express');
var cors = require('cors');
const multer = require('multer');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/uploads',express.static('uploads'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

const storage = multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,'./uploads');
  },
  filename:(req,file,callback)=>{
    callback(null,file.originalname);
  }
})

const upload = multer({storage});

app.post('/api/fileanalyse',upload.single('upfile'),(req,res)=>{
  let file = {
    name:req.file.originalname,
    type:req.file.mimetype,
    size:req.file.size
  }
  console.log(file)
  res.status(200).send(file);
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
