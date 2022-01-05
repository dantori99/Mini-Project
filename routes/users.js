const express = require('express');
const {
    createUserValidator,
} = require('../middlewares/validators/users')
const {
    isLogged
} = require('../middlewares/auth')
const {
    registerUser,
    allUser,
    detailUser,
    updateUser,
    deleteUser,
} = require('../controllers/users')

const router = express.Router();
// register
router
    .route("/register")
    .post(createUserValidator, registerUser)

// routes
// router
// .route('/')
// .get(isLogged, allUser)

router
    .route('/')
    .get(isLogged, detailUser)
    .put(isLogged, createUserValidator, updateUser)
    .delete(isLogged, deleteUser)

// export
module.exports = router;