const express = require("express");
const router = express.Router();
const controller = require("../Controller/controller");

/**
 * GET /tasks
 * Liste de toutes les tâches
 */
router.get('/', controller.getTasks);

/**
 * GET /tasks/:id
 * Détail d'une tâche
 */
router.get('/:id', controller.getCurrentTask);

router.post('/delete/:id', controller.suppTask);

router.post('/tasks/new', controller.addTask);

router.post('/put/:id', controller.updateTask);

router.post('/:id/subtasks', controller.getCurrentSubTask);

// PUT /tasks/:id/subtasks/:subId : modifier une sous-tâche
router.put('/:id/subtasks/:subId', controller.updateCurrentSubtask);

// DELETE /tasks/:id/subtasks/:subId : supprimer une sous-tâche
router.delete('/:id/subtasks/:subId', controller.suppCurrentSubtask);

// POST /tasks/:id/comments : ajouter un commentaire
router.post('/:id/comments', controller.addComment);

module.exports = router;
