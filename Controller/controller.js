const Task = require('../Model/task');

/**
 * GET /tasks
 */
const getTasks = async (req, res) => {
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
};

/**
 * GET /tasks/:id
 */
const getCurrentTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();

    if (!task) {
      return res.status(404).send('Tâche introuvable');
    }

    res.render('taskdetail', {
      title: 'tache:' + task._id,
      task
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de la tâche');
  }
};

/**
 * DELETE /tasks/:id
 */
const suppTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la suppression de la tâche');
  }
};

/**
 * POST /tasks
 */
const addTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.redirect('/');
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err.message });
  }
};

/**
 * PUT /tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.redirect('/' + req.params.id);
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err.message });
  }
};

/**
 * POST /tasks/:id/subtasks
 */
const getCurrentSubTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    task.subTasks.push({ title });
    await task.save();

    res.redirect('/' + req.params.id);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * PUT /tasks/:id/subtasks/:subId
 */
const updateCurrentSubtask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) {
      return res.status(404).json({ message: 'Sous-tâche non trouvée' });
    }

    if (title !== undefined) subTask.title = title;
    if (completed !== undefined) subTask.completed = completed;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * DELETE /tasks/:id/subtasks/:subId
 */
const suppCurrentSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const subTask = task.subTasks.id(req.params.subId);
    if (!subTask) {
      return res.status(404).json({ message: 'Sous-tâche non trouvée' });
    }

    subTask.deleteOne();
    await task.save();

    res.json({ message: 'Sous-tâche supprimée avec succès', task });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

/**
 * POST /tasks/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const { author, message } = req.body;

    if (!author || !message) {
      return res.status(400).json({ message: "Auteur et message requis" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const comment = {
      author,
      message,
      date: new Date()
    };

    task.comments.push(comment);
    await task.save();

    res.json({ message: 'Commentaire ajouté', comment });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  getTasks,
  getCurrentTask,
  suppTask,
  addTask,
  updateTask,
  getCurrentSubTask,
  updateCurrentSubtask,
  suppCurrentSubtask,
  addComment
};