const models = require("../../models");

const index = async (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) return res.status(400).end();

  const users = await models.User.findAll({ limit });
  res.json(users);
};

const show = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  const user = await models.User.findOne({ where: { id } });
  if (!user) return res.status(404).end();
  res.json(user);
};

const destroy = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  await models.User.destroy({ where: { id } });
  res.status(204).end();
};

const create = async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) return res.status(400).end();

    const user = await models.User.create({ name });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).end();
    }
    res.status(500).end();
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    const name = req.body.name;
    if (!name) return res.status(400).end();

    const user = await models.User.findOne({ where: id });
    if (!user) return res.status(404).end();
    user.name = name;
    await user.save();
    res.json(user);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).end();
    }
    res.status(500).end();
  }
};

module.exports = { index, show, destroy, create, update };
