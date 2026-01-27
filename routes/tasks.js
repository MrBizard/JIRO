const express = require("express");
const router = express.Router();
const Task = require('../Model/task');

/**
 * GET /tasks
 * Liste de toutes les tâches
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();

    res.render('tasks', {
        title: 'liste des taches',
      tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement des tâches');
  }
});

/**
 * GET /tasks/:id
 * Détail d'une tâche
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();

    if (!task) {
      return res.status(404).send('Tâche introuvable');
    }

    res.render('taskdetail', {
        title: 'tache:'+task._id,
      task
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de la tâche');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    await Task.findByIdAndDelete(taskId);

    // Redirige vers la liste après suppression
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression de la tâche');
  }
});

module.exports = router;
