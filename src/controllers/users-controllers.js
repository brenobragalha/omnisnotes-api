const { knex } = require('../database');
const AppError = require('../utils/app-error');
const { hash, compare } = require('bcryptjs');
const { randomUUID } = require('node:crypto');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const userByEmail = await knex('users').where({ email }).first();

    if (userByEmail) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, oldPassword } = req.body;
    const { id } = req.params;

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userWithUpdatedEmail = await knex('users')
      .where('email', email)
      .whereNot('id', id)
      .first();

    if (userWithUpdatedEmail) {
      throw new AppError('Email already in use', 400);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !oldPassword) {
      throw new AppError('Old password is required', 400);
    }

    const passwordMatch = await compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new AppError('Old password does not match', 400);
    }

    user.password = await hash(password, 8);

    await knex('users').where({ id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return res.status(200).json();
  }
}

module.exports = UsersController;
