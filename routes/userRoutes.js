const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, addUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

router.post('/', createUser); // create user (JSON)
router.get('/', getAllUsers); // get all (JSON)
router.get('/:id', getUser); // get single user
router.put('/:id', updateUser); // update user
router.delete('/:id', deleteUser); // delete user
router.post('/add', addUser); // form submit

module.exports = router;
