const { comment, event, user, sequelize } = require("../models");
const moment = require('moment')

class Comment {
  // Get all comment
  async getAllComment(req, res, next) {
    try {

      let data = await comment.findAll({
        // find all data in table comment
        attributes: {
          exclude: ["id_event", "id_user", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: event,
            attributes: ['id', 'dateStart']
          },
          {
            model: user,
            attributes: ['id', 'avatar', 'firstName', 'lastName']
          },
        ],
        order: [['id', 'desc']]
      });

      // const currentTime = data.createdAt
      // console.log(currentTime);
      // const timezone = new Date(currentTime).toLocaleString('en-US', { timeZone: 'asia/bangkok' })
      // const parseTime = moment(timezone).fromNow()
      // console.log(parseTime);

      // if there is no data in comment
      if (data.length === 0) {
        return res.status(404).json({ errors: "Comment not found" });
      }

      // if success
      res.status(200).json({ status: 200, totalComment: data.length, success: true, message: 'success get all comment', data });
    } catch (error) {
      next(error);
    }
  }
  // get detail comment
  async getDetailComment(req, res, next) {
    try {
      let data = await comment.findOne({
        // find all data in comment table
        where: { id: req.params.id },
        attributes: {
          exclude: ["id_event", "id_user", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: event,
          },
          {
            model: user,
            attributes: { exclude: ['password', 'token'] }
          },
        ],
      });

      // if there is no data
      if (!data) {
        return res.status(404).json({ errors: "Comment not found" });
      }

      // const currentTime = data.createdAt
      // const formatDate = new Date(currentTime).toLocaleString()
      // const parseTime = moment(formatDate, 'MM/DD/YYYY, h:mm:ss A').fromNow()

      // data.dataValues.time = parseTime;
      // return console.log(arrComment);
      // let arrLength = getDetailEvent.dataValues.comments
      // for (let i = 0; i < arrLength.length; i++) {
      //   arrLength[i].dataValues.time = parseTime
      // }

      // if success
      res.status(200).json({ status: 200, success: true, message: 'success get detail comment', data });
    } catch (error) {
      next(error);
    }
  }
  // Create comment
  async createComment(req, res, next) {
    try {

      // find event dulu
      const currentEvent = await sequelize.query(`SELECT * FROM events WHERE id=${req.body.id_event}`);
      // kalau event null
      if (!currentEvent[0].length) {
        return res.status(404).json({ status: 404, message: 'Event not found' });
      }

      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });
      req.body.id_user = currentUser.id;

      // create time comment
      const newData = await comment.create(req.body);

      // const currentTime = newData.createdAt
      // const timezone = new Date(currentTime).toLocaleString()
      // const parseTime = moment(timezone).fromNow()

      // find event with join
      const data = await comment.findOne({
        where: {
          id: newData.id,
        },
        attributes: { exclude: ['updatedAt'] },
        include: [
          {
            model: event,
            attributes: { exclude: ['id_user', 'id_category', 'deletedAt'] }
          },
          {
            model: user,
            attributes: { exclude: ['password', 'token', 'deletedAt'] }
          },
        ],
      });

      // data.dataValues.time = parseTime

      res.status(201).json({ status: 201, success: true, message: 'Congrats! Your comment was successfully added.', data });
    } catch (error) {
      next(error);
    }
  }

  // Update data
  async updateComment(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });

      const currentComment = await comment.findOne({ where: { id: req.params.id } });

      if (currentComment === null) {
        return res.status(404).json({ status: 500, message: 'Comment not found' });
      }

      if (currentUser.id != currentComment.id_user) {
        return res.status(404).json({ errors: 'No access to this comment!' });
      }

      if (currentUser == null) {
        return res.status(404).json({ errors: ['No access to this comment!'] });
      }
      // transaction table update data
      await comment.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // find the updated comment
      const data = await comment.findOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: ["updatedAt", "deletedAt"],
        },
        include: [
          {
            model: event,
          },
          {
            model: user,
            attributes: { exclude: ['password', 'token'] }
          },
        ],
      });
      // if success
      res.status(201).json({ status: 201, success: true, message: 'success update comment', data });
    } catch (error) {
      next(error);
    }
  }

  // Delete data
  async deleteComment(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });

      const currentComment = await comment.findOne({ where: { id: req.params.id } });
      // if data null
      if (currentComment === null) {
        return res.status(404).json({ status: 500, message: 'Comment not found' });
      }

      if (currentUser.id != currentComment.id_user) {
        return res.status(404).json({ errors: 'No access to delete this comment!' });
      }

      if (currentUser == null) {
        return res.status(404).json({ errors: 'No access to delete this comment!' });
      }
      // delete data
      await comment.destroy({ where: { id: req.params.id } });

      // if success
      res.status(200).json({ status: 200, success: true, message: "Success delete comment" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Comment();
