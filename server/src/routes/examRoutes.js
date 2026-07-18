const express = require('express');
const {
  createExamSchedule,
  getRevisionPlan,
  getStudyTasks,
  updateTaskStatus,
  setReminder,
} = require('../controllers/examController');

const router = express.Router();

// Schedule management
router.post('/:dnaId/schedule', createExamSchedule);

// Revision plan
router.get('/:dnaId/revision-plan', getRevisionPlan);

// Study tasks
router.get('/:dnaId/study-tasks', getStudyTasks);
router.patch('/:dnaId/tasks/:taskId', updateTaskStatus);

// Reminders
router.post('/:dnaId/reminders', setReminder);

module.exports = router;
