require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{
    console.log('DB Connection Established . . .')
  })
  .catch((err)=>{
    console.log('DB Connection Failed . . ')
  })

// Create Person Schema

let personSchema = mongoose.Schema({
  name : {
    type: String,
    required: true    
  },
  age :{
    type: Number,
    required: true
  },
  favoriteFoods : [String]
});

// Create the Person Model
let Person = mongoose.model('Person',personSchema);



// Create a Person
const createAndSavePerson = (done) => {
  let newPerson = new Person({
    name: 'Roland',
    age: 20,
    favoriteFoods: ['chicken', 'Chips']
  });

  newPerson.save((err,data)=>{
    if(err){
      return done(err);
    }else{
      return done(null,data)
    }
  })
};

// Seed DB with Inital Data
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople,(err,data)=>{
    if(err)return done(err);
    return done(null,data);
  })
};


// Find by Given Name
const findPeopleByName = (personName, done) => {
  Person.find({name:personName},(err,data)=>{
    if(err)return done(err);
    return done(null,data);
  })
};
// Search by food
const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods:food}, (err,data)=>{
    if(err) return done(err);
    return done(null,data);
  })
};

// Find by id
const findPersonById = (personId, done) => {
  Person.findById({_id:personId},(err,data)=>{
    if(err)return done(err);
    return done(null, data);
  })
};

// update food Array
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({_id:personId},(err,data)=>{
    if(err)return console.log(err);
    else{
      let newPerson = data;
      newPerson.favoriteFoods.push(foodToAdd);
      newPerson.save((err,data)=>{
        if(err)return done(err);
        return done(null,data);
      })  
    }
  })
};
// Update a single document by name
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name:personName},{age:ageToSet},{new: true},(err,data)=>{
    if(err)return done(err);
    return done(null,data);
  })
};

// Delete by ID
const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id:personId},(err,data)=>{
    if(err)return done(err);
    return done(null,data)
  })
};

// Remove many
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name:nameToRemove},(err,data)=>{
    if(err)return done(err);
    return done(null,data);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch})
  .sort('name')
  .limit(2)
  .select('name favoriteFoods')
  .exec((err,data)=>{
    if(err)return done(err)
    return done(null,data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
