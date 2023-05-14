// importing modules
const express = require('express')
const mongoose = require('mongoose')
const bodyParser=require('body-parser')

//Starting the app
let app = express()

//Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Connection
mongoose
    .connect("mongodb://0.0.0.0:27017/ElearningPlatform")
    .then(console.log('DB is connected.'))
    .catch(err => { console.log(err) })

//Creating Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: String,
    phone:String
})
const levelSchema = new mongoose.Schema({
    level: Number,
    semester:Number
})
const materialSchema = new mongoose.Schema({
    Matcode: String,
    Matname: String
})

//Creating model
let studentModel =new mongoose.model('students', studentSchema)
let levelModel = new mongoose.model('levels', levelSchema)
let materialModel = new mongoose.model('materials', materialSchema)

//Welcome message
app.get('/', async (req, res) => {
  res.send('Welcome to my Server')
})

//Creating GET request
app.get('/students', async (req, res) => {
    let allStudents = await studentModel.find()
    res.status(200)
    res.json(allStudents)
})

app.get('/levels', async (req, res) => {
    let allLevels = await levelModel.find()
    res.status(200)
    res.json(allLevels)
})

app.get('/materials', async (req, res) => {
    let allMaterials = await materialModel.find()
    res.status(200)
    res.json(allMaterials)
})
//Creating POST request
app.post('/students', async (req, res) => {
    try {
        const student = new studentModel({
            name: req.body.name,
            age: req.body.age,
            phone:req.body.phone
        });
      await student.save();
        res.send(`${student.name} added successfully.`);
        console.log(req);
    } catch (err) {
      console.error('Error adding student:', err);
      res.status(500).send('Error inserting student');
    }
})

app.post('/materials', async (req, res) => {
  try {
      const material = new materialModel({
          Matcode: req.body.Matcode,
          Matname: req.body.Matname
      });
    await material.save();
      res.send(`${material.Matname} added successfully.`);
      console.log(req);
  } catch (err) {
    console.error('Error adding material:', err);
    res.status(500).send('Error inserting material');
  }
})

app.post('/levels', async (req, res) => {
  try {
      const level = new levelModel({
          level: req.body.level,
          semester: req.body.semester
      });
    await level.save();
      res.send(`level ${level.level} added successfully.`);
      console.log(req);
  } catch (err) {
    console.error('Error adding level:', err);
    res.status(500).send('Error inserting level');
  }
})

// Creating updated request
// update for students
app.put('/students/:id', async (req, res) => {
    try {
      const student = await studentModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name,
            age: req.body.age,
            phone: req.body.phone
          }
        },
        { new: true }
      )
      if (!student) {
        return res.status(404).json({ error: 'Student not found' })
      }
      res.status(200).json(student)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
})
// update for materials
app.put('/materials/:Matcode', async (req, res) => {
  try {
    const material = await materialModel.findOneAndUpdate(
      { Matcode: req.params.Matcode },
      {
        $set: {
        Matcode: req.body.Matcode,
        Matname: req.body.Matname
      }
      },
      { new: true }
    )
    if (!material) {
      return res.status(404).json({ error: 'Material not found' })
    }
    res.status(200).json(material)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
// update for levels
app.put('/levels/:id', async (req, res) => {
  try {
    const level = await levelModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          level: req.body.level,
          semester: req.body.semester
        }
      },
      { new: true }
    )
    if (!level) {
      return res.status(404).json({ error: 'Level not found' })
    }
    res.status(200).json(level)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})


//Starting the server
app.listen(3030, function () { console.log('Server is working.') })