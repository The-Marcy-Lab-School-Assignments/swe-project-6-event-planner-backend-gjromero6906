const userModel = require('../models/userModel');

const listUsers = async (req, res, next) => {
  try {
    const users = await userModel.list();
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    const { password } = req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).send({ message: 'Invalid user_id.' });
    }

    if (!password) {
      return res.status(400).send({ message: 'Password is required.' });
    }

    if (req.session.userId !== userId) {
      return res.status(403).send({ message: 'You can only update your own account.' });
    }

    const user = await userModel.update(userId, password);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).send({ message: 'Invalid user_id.' });
    }

    if (req.session.userId !== userId) {
      return res.status(403).send({ message: 'You can only delete your own account.' });
    }

    const user = await userModel.destroy(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    return res.send({ message: 'User deleted.' });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listUsers, updateUser, deleteUser };
