const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

//import data models
const User = require('./models/user');
const Exercise = require('./models/exercise');

// Api Routes | Endpoints | Middleware
app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Create a new user
app.post('/api/users',(req,res)=>{
  const newUser = new User({
    username:req.body.username
  })
  newUser.save()
  .then(result=>{
    return res.json({username:result.username,_id:result._id});
  })
  .catch(error=>{
    return res.json(error)
  })
})

// Get all the users
app.get('/api/users',(req,res)=>{
  User.find({},'username _id')
  .then(result=>{
    if(result.length){
      return res.json(result)
    }else{
      return res.json({error:'No users Found'})
    }
  })
})

// Post user Exercise
app.post('/api/users/:_id/exercises',(req,res)=>{
  let date = new Date();
  const [year,month,day] = [date.getFullYear(),date.getMonth()+1,date.getDate()]

  User.findOne({_id:req.params._id},'username _id')
  .then((result)=>{
    // console.log('Testing--',req.body.date,`${year}-${month}-${day}`)
    const newExercise = new Exercise({
      username:result.username,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date || `${year}-${month}-${day}`,
      userID: req.params._id
    })

    newExercise.save()
    .then(result=>{
      return res.json({
        username:result.username,
        description: result.description,
        duration: result.duration,
        date: new Date(result.date).toDateString(),
        _id:result.userID
      });
    })
    .catch(error=>{
      return res.json({error:'Something went wrong . . .'})
    })

  })
  .catch(error=>{
    return res.json({error:'Failed to add exercise'})
  })
})

// Get Exercise logs for user
app.get('/api/users/:_id/logs',(req,res)=>{
  let {dateTo,dateFrom,limit} = req.query;
  let dateRegex = /\d{4}-\d{2}-\d{2}/;

  Exercise.find({userID:req.params._id}).limit(parseInt(limit)|| 1000).where('date').gte((dateRegex.test(dateFrom) && dateFrom) || 0 ).lte((dateRegex.test(dateTo) && dateTo) || '3000-01-01')
  
  .then(result=>{
    // console.log('result',result);
    if(result.length){
      let data = {
        username:result[0].username,
        count:result.length,
        _id:result[0].userID,
        log:result.map((data)=>({
          description:data.description,
          duration:data.duration,
          date:new Date(data.date).toDateString()
        }))
      }
      console.log('running 1',data);
      return res.status(200).json(data)

    }else{
      console.log('running 2')
      return res.status(404).json({error:'No logs found for this user'})
    }
  
  })
  .catch(error=>{
    console('failure --')
    return res.status(404).json({error:'Failed to get logs'})
  })
})

// Database Connection
let DB_URI = "mongodb+srv://FCC4:rolandDB21@fcc-data.rgopo.mongodb.net/ExerciseTracker?retryWrites=true&w=majority";

mongoose.connect(DB_URI)
.then(response=>{
  console.log('DB Connection Establised . . .');
})
.catch(error=>{
  console.log('DB Connection Failed . . .');
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
