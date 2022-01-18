const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware')
const secretjwt = "ldsAS35sYRhd564"
const mongoose = require('mongoose');
const jwt_decode = require('jwt-decode');

router.post('/login', (req, res) => {
    console.log(req.body)
    User.findOne({email :req.body.email})
        .then (user => {
            if (!user) res.status(404).json({error: 'invalid email'})
            else {
                bcrypt.compare(req.body.password, user.password, (error,match) => {
                    if (error) res.status(500).json(error)
                    else if (match) res.status(200).json({token: createJWToken(user._id,)})
                    else res.status(403).json({error:'invalid password'})
                })
            }
        })
        .catch (error=> {
            res.status(500).json(error)
        })
});

router.post('/register', (req, res) => {
    bcrypt.hash(req.body.password,10,(error,hash) => {
        if (error) res.status(502).json(error)
        else {
            User.findOne({email :req.body.email})
                .then (user => {
                    if (user) res.status(404).json({error : 'email already in use'})
                    else {
                        const newUser = User({email:req.body.email,password :hash})
                        newUser.save()
                            .then(user => {
                                console.log(user);
                                res.status(200).json({token : createJWToken(user._id)})
                            })
                            .catch(error => {
                                res.status(501).json(error)
                            })
                    }
                })
        }
    })

});

router.post('/add_contact', middleware.verify , (req, res) => {
    try {
        var objID = jwt_decode(req.headers.authorization).data
        console.log("body", req.body);
        console.log("user",req.user);
        User.findOneAndUpdate (
             {'_id' : objID},
             {$push : {contacts : {'name':req.body.name,'surname':req.body.surname,'email':req.body.email,'phone':req.body.phone,'address':req.body.address} }},
             function(err){
                if(err) res.send("An error occured")
             }
        )
        res.send("User added successfully !")
    } catch (error) {
        console.log(error);
        res.send("An error occured, this user could not be added");
    }
});

router.post('/verifyToken/:token', (req, res) => {
    var { token } =req.params
    jwt.verify(token, "ldsAS35sYRhd564", (err, value) => {
        if (err) {res.status(505).json({error: 'Not a valid jwt token'});}
        else {res.status(200).json({success: 'Valid jwt token'})}
    })

});


router.get('/contacts', middleware.verify, (req, res) => {
    try {
        var objID = jwt_decode(req.headers.authorization).data
        User.findOne(
            {'_id' : objID}
        ).populate('contacts')  
        .exec(
            function(err, info) {
              if (err) res.status(500).send(err);
              res.json(info.contacts);
            });
    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }

});

router.get('/contacts/:id', middleware.verify, (req, res) => {
    try {
        var { id } =req.params
        id = mongoose.Types.ObjectId(id)
        console.log(id)
        console.log(typeof id)
        User.find({ "contacts._id"	acts.$": 1, "_id": 0})
            .exec(
                function(err,info) {
                  if (err) res.status(500).send(err);
                  else res.json(info);
                });

    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});

router.put('/contacts/:id', middleware.verify, (req, res) => {
    try {
        var objID = jwt_decode(req.headers.authorization).data
		const {id} = req.params
        User.updateOne (
             {'_id' : objID, 'contacts._id':id},
             {$set : {'contacts.$':{'name': req.body.name, 'surname':req.body.surname,'email':req.body.email,'phone':req.body.phone,'address':req.body.address, '_id':id} }},
             function(err){
                if(err) res.send("An error occured")
             }
        )
        res.send("User modified successfully !")
    } catch (error) {
        console.log(error);
        res.send("An error occured, this users' information could not be modified");
    }
});



router.delete('/contacts/:id', middleware.verify, (req, res) => {
    try {
        var objID = jwt_decode(req.headers.authorization).data
        const { id } = req.params
        User.updateOne({'_id' : objID},
            {$pull : { "contacts" : {_id: id} } } )
            .exec(
                function(err) {
                  if (err) res.status(500).send(err);
                  else res.send("User successfully deleted");
                });

    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});

function createJWToken(user){
    return jwt.sign({data:user}, secretjwt, {expiresIn: '4h'})
}

module.exports = router
