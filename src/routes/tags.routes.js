const { Router } = require('express');
const TagsController = require('../controllers/tags-controller.js');

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get('/:user_id', tagsController.list);

module.exports = tagsRoutes;
