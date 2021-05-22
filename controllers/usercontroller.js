const { Sequelize } = require('sequelize');
var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { sequelize, models }= require('../db'); 
var User = models.User; 

router.post('/signup', async (req, res) => {
    const password = await bcrypt.hashSync(req.body.user.password, 10)
    const userBody = {
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash: password,
        email: req.body.user.email,
    }
    try {

        const user = await User.create(userBody)

        if (user) {
            let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
            res.status(200).json({
                user: user,
                token: token
            })
        }   
        
    } catch (err) {
        console.log(err)
            res.status(500).send(err.message)
    }    
})

router.post('/signin', (req, res) => {    
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (user) {
            console.log(user)
            bcrypt.compare(req.body.user.passwordHash, user.passwordHash, function (err, matches) {
                if (matches) {
                    var token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user: user,
                        message: "Successfully authenticated.",
                        sessionToken: token
                    });
                } else {
                    res.status(502).send({ error: "Passwords do not match." })
                }
            });
        } else {
            res.status(403).send({ error: "User not found." })
        }

    })
})

module.exports = router;