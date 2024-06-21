const { knex } = require('../database');
const { response } = require('express');
const { randomUUID } = require('node:crypto');

class NotesController {
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const { user_id } = req.params;

    const note_id = randomUUID();

    await knex('notes').insert({
      id: note_id,
      title,
      description,
      user_id,
    });

    const linksInsert = links.map((link) => {
      return {
        id: randomUUID(),
        url: link,
        note_id,
      };
    });

    await knex('links').insert(linksInsert);

    const tagsInsert = tags.map((tag) => {
      return {
        id: randomUUID(),
        title: tag,
        note_id,
        user_id,
      };
    });

    await knex('tags').insert(tagsInsert);

    res.status(201).json();
  }

  async list(req, res) {
    const { title, user_id, tags } = req.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(',').map((tag) => {
        return tag.trim();
      });

      notes = await knex('tags')
        .select([
          'notes.id',
          'notes.title',
          'notes.description',
          'notes.user_id',
        ])
        .where('notes.user_id', user_id)
        .whereLike('notes.title', `%${title}%`)
        .whereIn('tags.title', filterTags)
        .innerJoin('notes', 'notes.id', 'tags.note_id');
    } else {
      notes = await knex('notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`);
    }

    const userTags = await knex('tags').where({ user_id });

    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.status(200).json(notesWithTags);
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex('notes').where({ id }).first();
    const links = await knex('links')
      .where({ note_id: id })
      .orderBy('created_at');
    const tags = await knex('tags').where({ note_id: id }).orderBy('title');

    return res.status(200).json({ ...note, links, tags });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex('notes').where({ id }).delete();

    return res.status(200).json();
  }
}

module.exports = NotesController;
