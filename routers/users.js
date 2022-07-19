const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Get a List of Users-----------------------------------------------------
router.get('/', async (req,res) =>{
    const userList = await User.find();
    
    if (!userList) {
        res.status(500).json({success : false})
    }
    res.send(userList);
})
//-----------------------------------------------------------------------

// Get a Sinle User----------------------------------------------------------
router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(500).json({message: 'the user with the given ID was not found!'});
    }
    res.status(200).send(user);
})
//--------------------------------------------------------------------------

//create a new admin user-------------------------------------------------------
router.post('/', async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if (!user) {
        return res.status(404).send('user cannot be created!');
    }
    else{
        res.send(user);
    }

})
//----------------------------------------------------------------------

//register a new user-------------------------------------------------------
router.post('/register', async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if (!user) {
        return res.status(404).send('user cannot be created!');
    }
    else{
        res.send(user);
    }

})
//----------------------------------------------------------------------

//login-request-with-email-and-password-and-token-------------------------------------------
router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if (!user) {
        return res.status(400).send('The user not Found');
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        return res.status(200).send({user: user.email, token: token});
    }
    else{
        res.status(400).send('password is wrong!');
    }
})
//-----------------------------------------------------------------------------------------

//-delete-user-by-id-----------------------------------------------------------------
router.delete('/:id',(req,res)=>{
    User.findByIdAndRemove(req.params.id)
    .then(user=>{
        if (user) {
            return res.status(200).json({success: true, message: 'the user is deleted successfully...'})
        }
        else{
            return res.status(500).json({success: false, message: 'user not found!'})
        }
    })
    .catch(err => {
        return res.status(400).json({success: false, error: err});
    })
})
//-----------------------------------------------------------------------------------------


//user Count Api---------------------------------
router.get('/get/count', async (req,res) =>{
    const userCount = await User.count();
    if (!userCount) {
        res.status(500).json({success : false})
    }
    res.send({
        userCount: userCount 
    });
})
//----------------------------------------------------------

module.exports = router;