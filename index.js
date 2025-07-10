const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Group = require('./models/Group');
const Session = require('./models/Session');
const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);
// Create Group
app.post('/groups', async (req, res) => {
  const group = new Group(req.body);
  await group.save();
  res.status(201).json(group);
});

// Create Session (activity type)
app.post('/sessions', async (req, res) => {
  const session = new Session(req.body);
  await session.save();
  res.status(201).json(session);
});

// Create Student
app.post('/students', async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
});

// Add or update score for a Student
app.post('/students/:id/scores', async (req, res) => {
  const { sessionId, points } = req.body;
  const student = await Student.findById(req.params.id);

  const existing = student.scores.find(s =>
    s.session.toString() === sessionId
  );

  
  if (existing) {
    // update points
    existing.points = points;
  } else {
    // add new
    student.scores.push({
      session: sessionId,
      points
    });
  }

  await student.save();
  res.json(student);
});

// Get all Students with Group and Session info
app.get('/students', async (req, res) => {
  const students = await Student.find()
    .populate('group')
    .populate('scores.session');
  res.json(students);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
