const { user, sequelize } = require('../models')
const { decrypt, encrypt, createToken, verifyToken } = require('../utils/index')
const isEmpty = str => !str.trim().length;

class User {
    // creating user
    async registerUser(req, res, next) {
        let errorType;
        // return console.log(req.body);
        try {
            // find user
            const data = await user.findOne({
                where: {
                    email: req.body.email
                },
                attributes: { exclude: ["avatar", "updatedAt", "deletedAt", "password", "token"] }
            })
            if (data == null) {
                let { firstName, lastName, email, password, avatar } = req.body;
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(400).json({ message: "Masukkan email dengan benar!" });
                if (isEmpty(firstName)) return res.status(400).json({ message: "Your name are not allowed to be empty" })
                if (firstName.length < 5) return res.status(400).json({ message: "Nama pertama minimal 5 huruf!" });
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\,])(?=.{10,20})/.test(password)) return res.status(400).json({ message: `Mohon diisi dengan panjang kata sandi 10-20 karakter, terdiri dari kombinasi huruf besar, huruf kecil, angka, dan special karakter` });
                password = encrypt(password)
                const newData = await user.create({
                    firstName, lastName, password, email, avatar,
                });
                const resData = await user.findOne({
                    where: {
                        id: newData.id
                    },
                    attributes: { exclude: ["avatar", "updatedAt", "deletedAt", "password", "token"] }
                })
                res.status(201).json({ status: 201, message: 'Congrats! You have successfully created an account.', data: resData });
            } else {
                // return jika email sudah terdaftar
                errorType = 1;
                res.status(400).json({ message: "Email ini sudah terdaftar, silahkan cari email lain" });
            }
        } catch (error) {
            res.status(500).json({ errors: "ERROR Creating User", message: error });
        }
    }
    // show all user
    async allUser(req, res, next) {
        try {
            const data = await user.findAll({
                attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "token", "password"] }
            })

            if (data.length === 0) {
                return res.status(404).json({ status: 404, message: 'User not found!' })
            }

            res.status(200).json({ status: 200, success: true, message: 'success get all user', data });
        } catch (error) {
            res.status(500).json({ errors: 'Error getting all USER', message: error });
        }
    }
    // show specific user
    async detailUser(req, res, next) {
        try {

            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });

            if (currentUser === null) {
                return res.status(404).json({ errors: 'user not found' })
            }

            const data = await user.findOne({
                where: {
                    id: currentUser.id
                },
                attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "token", "password"] }
            });

            if (!data) {
                return res.status(404).json({ errors: "User not found" });
            }

            res.status(200).json({ status: 200, success: true, message: 'success get detail user', data });
        } catch (error) {
            res.status(500).json({ errors: 'Error getting all USER', message: error });
        }
    }
    // updating user
    async updateUser(req, res, next) {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });

            if (currentUser === null) {
                return res.status(404).json({ errors: 'user not found' });
            }

            else {
                let { firstName, lastName, email, password, avatar } = req.body;
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(400).json({ message: "Masukkan email dengan benar!" });
                if (isEmpty(firstName)) return res.status(400).json({ message: "Your name are not allowed to be empty" })
                if (firstName.length < 5) return res.status(400).json({ message: "Nama pertama minimal 5 huruf!" });
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\,])(?=.{10,20})/.test(password)) return res.status(400).json({ message: `Masukkan password dengan benar!` });
                password = encrypt(password)
                await user.update(
                    { firstName, lastName, email, password, avatar },
                    {
                        where: { id: currentUser.id },

                    });
            }

            const data = await user.findOne({
                where: { id: currentUser.id },
                attributes: { exclude: ['password', 'token'] }
            });

            res.status(201).json({ status: 201, success: true, message: 'success updating user', data });
        } catch (error) {
            res.status(500).json({ errors: 'Error updating USER', message: error });
        }
    }
    // deleting user
    async deleteUser(req, res, next) {
        try {
            const token = req.headers.authorization.replace('Bearer ', '');
            const currentUser = await user.findOne({
                where: { token }
            });

            if (currentUser == null) {
                return res.status(404).json({ errors: 'No delete access to this user!' });
            }

            const data = await user.destroy({
                where: { id: currentUser.id }
            })

            if (!data) {
                return res.status(404).json({ errors: 'User not found!' });
            }

            res.status(200).json({ status: 200, messages: 'User account has successfully been deleted!' });
        } catch (error) {
            res.status(500).json({ errors: 'Error updating USER', message: error });
        }
    }
    // =============================================================================================================
    // Login
    async loginUser(req, res, next) {
        // untuk cek email di database
        const data = await user.findOne({
            where: { email: req.body.email },
        });

        if (data == null) {
            return res.status(404).json({ errors: 'Email yang diisi salah' })
        }
        // cek apa password memang dimiliki oleh email yang diinput
        let validPass = decrypt(req.body.password, data.password);
        if (!validPass) {
            return res.status(404).json({ errors: 'Kata sandi yang dimasukkan salah' })
        }

        const {
            firstName, lastName, email, avatar
        } = data.dataValues

        const tmpToken = {
            firstName, lastName, email, avatar
        }

        const token = createToken(tmpToken);
        await sequelize.query(`UPDATE users SET token='${token}' WHERE id=${data.id}`);
        return res.status(200).json({ statusCode: 200, message: "Login success!", token });
    }

}

module.exports = new User();