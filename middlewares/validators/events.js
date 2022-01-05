const path = require('path');
const crypto = require('crypto');
const validator = require('validator');
const { promisify } = require('util');
const cloudinary = require("cloudinary").v2;

exports.eventValidator = async (req, res, next) => {
    try {
        const errors = [];

        const {
            id_category,
            title,
            detail,
            dateStart,
            dateEnd,
            organizer,
            link,
            nameSpeaker
        } = req.body

        if (!validator.isInt(id_category)) {
            errors.push('id_category must be a number');
        }

        if (validator.isEmpty(title, { ignore_whitespace: false })) {
            errors.push('title must be filled');
        }

        if (req.files === null) {
            errors.push('image must be filled');
        }

        if (validator.isEmpty(dateStart, { ignore_whitespace: false })) {
            errors.push('date start must be filled, format date: YYYY-MM-DD<space>hh:mm')
        }

        if (validator.isEmpty(dateEnd, { ignore_whitespace: false })) {
            errors.push('date end must be filled, format date: YYYY-MM-DD<space>hh:mm')
        }

        if (validator.isEmpty(detail, { ignore_whitespace: false })) {
            errors.push('detail must be filled');
        }

        if (validator.isEmpty(organizer, { ignore_whitespace: false })) {
            errors.push('organizer must be filled');
        }

        if (validator.isEmpty(link, { ignore_whitespace: false })) {
            errors.push('link must be filled');
        }

        if (validator.isEmpty(nameSpeaker, { ignore_whitespace: false })) {
            errors.push('name speaker must be filled');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors: errors });
        }

        if (req.files != null) {
            const file = req.files.imageEvent;

            if (!file.mimetype.startsWith('image')) {
                errors.push('File must be an Image');
            }

            if (file.size > 1000000) {
                errors.push('image must be less than 1MB');
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors: errors });
            }

            let fileName = crypto.randomBytes(16).toString('hex');

            file.name = `${fileName}${path.parse(file.name).ext}`;

            const move = promisify(file.mv);

            await move(`./public/images/events/${file.name}`);

            const event = await cloudinary.uploader.upload(`./public/images/events/${file.name}`)
                .then((result) => {
                    return result.secure_url
                });

            req.body.imageEvent = event;

            // req.body.imageEvent = `https://api-see-event-teamb.herokuapp.com/images/events/${file.name}`;
        }

        next();

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error Validator Event', errors: error });
    }
}