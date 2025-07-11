const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Group = require('./models/Group');
const Session = require('./models/Session');
const Student = require('./models/Student');

const app = express();
app.use(cors({
  origin: ["https://camp-score-champ-hub.vercel.app"],
}));
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

// Get all Groups
app.get('/groups', async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});
// Get all Sessions
app.get('/sessions', async (req, res) => {
  const sessions = await Session.find();
  res.json(sessions);
});
// Get all Students with scores
app.get('/students', async (req, res) => {
  const students = await Student.find()
    .populate('group')
    .populate('scores.session');

  const transformed = students.map(s => {
    const sessionScores = {};
    let totalScore = 0;
    s.scores.forEach(score => {
      if (score.session) {
        sessionScores[score.session._id] = score.points;
        totalScore += score.points;
      }
    });

    return {
      _id: s._id,
      name: s.name,
      group: s.group ? s.group._id : null,
      sessionScores,
      totalScore
    };
  });

  res.json(transformed);
});


// Delete a Student
app.delete('/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.status(204).send();
    }
);
// Delete a Group
app.delete('/groups/:id', async (req, res) => {
  await Group.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
// Delete a Session
app.delete('/sessions/:id', async (req, res) => {
  await Session.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Update a Student
app.put('/students/:id', async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const updatedStudent = await Student.findById(req.params.id)
        .populate('group')
        .populate('scores.session');
    res.json(updatedStudent);
});

// Assign session to group
app.post('/groups/:id/assign-session', async (req, res) => {
  const groupId = req.params.id;
  const { sessionId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  if (!group.sessionIds.includes(sessionId)) {
    group.sessionIds.push(sessionId);
    await group.save();
  }

  res.json(group);
});

// Remove session from group
app.post('/groups/:id/remove-session', async (req, res) => {
  const groupId = req.params.id;
  const { sessionId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  group.sessionIds = group.sessionIds.filter(id => id.toString() !== sessionId);
  await group.save();

  res.json(group);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
