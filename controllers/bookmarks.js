const { bookmark, event, user, category } = require("../models");

class Bookmark {
  // get all bookmark
  async getAllBookmark(req, res, next) {
    try {
      let data = await bookmark.findAll({
        // find all data in table bookmark
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        include: [
          {
            model: event,
            attributes: ['title'],
          },
          {
            model: user,
            attributes: ['email']
          },
        ],
      });

      // If there is nothing here
      if ((data.length === 0)) {
        return res.status(404).json({ errors: "Bookmark not found" });
      }
      // If success
      res.status(200).json({ status: 200, success: true, data });
    } catch (error) {
      next(error);
    }
  }
  async getMyBookmark(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });
      let data = await bookmark.findAll({
        // find all data in table bookmark
        where: { id_user: currentUser.id },
        attributes: {
          exclude: [
            'id_user',
            'id_event',
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        include: [
          {
            model: event,
            attributes: { exclude: ['deletedAt', 'updatedAt', 'id_category', 'id_user'] },
            include: [
              {
                model: category,
                attributes: ['name']
              },
              {
                model: user,
                attributes: ['firstName', 'lastName', 'email', 'avatar']
              }
            ]
          },
        ],
      });

      // If there is nothing here
      if ((data.length === 0)) {
        return res.status(404).json({ message: "You haven't saved any events yet" });
      }
      // If success
      res.status(200).json({ status: 200, success: true, message: 'success get my bookmark', data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailBookmark(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });

      const currentBookmark = await bookmark.findOne({ where: { id: req.params.id } });
      // if theres nothing here
      if (currentBookmark === null) {
        return res.status(404).json({ status: 500, message: 'Bookmark not found' });
      }

      if (currentUser.id != currentBookmark.id_user) {
        return res.status(404).json({ errors: 'No access to this bookmark!' });
      }

      if (currentUser == null) {
        return res.status(404).json({ errors: 'No access to this bookmark!' });
      }
      let data = await bookmark.findOne({
        // find all data of bookmark table
        where: { id: req.params.id },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        include: [
          {
            model: event,
            attributes: ['title'],
          },
          {
            model: user,
            attributes: ['email'],
          },
        ],
      });

      // if success
      res.status(200).json({ status: 200, success: true, message: 'success get detail bookmark', data });
    } catch (error) {
      next(error);
    }
  }

  async createBookmark(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });
      req.body.id_user = currentUser.id;
      // create bookmark
      const newData = await bookmark.create(req.body);

      // find bookmark with join
      const data = await bookmark.findOne({
        where: {
          id: newData.id,
        },
        attributes: {
          exclude: [
            'id_user',
            'id_event',
            "updatedAt",
            "deletedAt",
          ],
        },
        include: [
          {
            model: event,
            attributes: ['id', 'title'],
          },
          {
            model: user,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      });
      res.status(201).json({ status: 201, success: true, message: 'success create bookmark', data });
    } catch (error) {
      next(error);
    }
  }

  // update data
  async updateBookmark(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });
      const currentBookmark = await bookmark.findOne(
        {
          where: {
            id: req.params.id
          }
        }
      );

      if (currentBookmark === null) {
        return res.status(404).json({ status: 500, message: 'Bookmark not found' });
      }

      if (currentUser.id != currentBookmark.id_user) {
        return res.status(404).json({ errors: 'No update access to this bookmark!' });
      }

      if (currentUser == null) {
        return res.status(404).json({ errors: 'No update access to this bookmark!' });
      }
      // bookmark table update
      await bookmark.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      // find the updated bookmark
      const data = await bookmark.findOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        include: [
          {
            model: event,
            attributes: ['title'],
          },
          {
            model: user,
            attributes: ['email'],
          },
        ],
      });

      // if success
      res.status(201).json({ status: 201, success: true, message: 'success update bookmark', data });
    } catch (error) {
      next(error);
    }
  }

  // delete data
  async deleteBookmark(req, res, next) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      const currentUser = await user.findOne({
        where: { token }
      });
      const currentBookmark = await bookmark.findOne(
        {
          where: {
            id: req.params.id
          }
        }
      );

      if (currentBookmark === null) {
        return res.status(404).json({ status: 500, message: 'Bookmark not found' });
      }

      if (currentUser.id != currentBookmark.id_user) {
        return res.status(404).json({ errors: 'No delete access to this bookmark!' });
      }

      if (currentUser == null) {
        return res.status(404).json({ errors: 'No delete access to this bookmark!' });
      }
      // delete data
      await bookmark.destroy({ where: { id: req.params.id } });

      // if success
      res.status(200).json({ status: 200, success: true, message: "Success delete bookmark" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Bookmark();
