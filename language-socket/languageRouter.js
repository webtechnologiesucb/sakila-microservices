const express = require('express');
const router = express.Router();
const db = require('./db');

module.exports = (io) => {
  // Obtener todos los idiomas
  router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM language');
    res.json(rows);
  });

  // Crear un nuevo idioma
  router.post('/', async (req, res) => {
    const { name } = req.body;
    await db.query('INSERT INTO language (name, last_update) VALUES (?, NOW())', [name]);
    io.emit('languageUpdated', { action: 'create', name });
    res.sendStatus(201);
  });

  // Editar un idioma
  router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    await db.query('UPDATE language SET name = ?, last_update = NOW() WHERE language_id = ?', [name, id]);
    io.emit('languageUpdated', { action: 'update', id, name });
    res.sendStatus(200);
  });

  // Eliminar un idioma
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM language WHERE language_id = ?', [id]);
    io.emit('languageUpdated', { action: 'delete', id });
    res.sendStatus(200);
  });

  return router;
};
