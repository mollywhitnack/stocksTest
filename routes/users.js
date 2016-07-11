'use strict';

const express = require('express');
const request = require('request');

const User = require('../models/user');

let router = express.Router();

//    users.js
//    /api/users

router.get('/', (req, res) =>{
  User.find({}, (err, users) =>{
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/profile', User.authMiddleware(), (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
});

router.get('/profile/:id', User.authMiddleware(), (req, res) => {
  User.findById(req.params.id, req.body, {new :true}, (err, savedProf)=>{
      res.status(err ? 400 :200).send(err || savedProf);
    })
});


//to update profile
router.put('/profile/:id', User.authMiddleware(), (req, res) =>{
    console.log('req.params.id:', req.params.id);
    User.findByIdAndUpdate(req.params.id, req.body, {new :true}, (err, savedProf)=>{
      res.status(err ? 400 :200).send(err || savedProf);
    })
});

router.put('/profile/:userId/addStock', User.authMiddleware(), (req, res) =>{
    console.log(' add stock req.params.userId:', req.params.userId);
    User.findByIdAndUpdate(req.params.id, {$push: {"stocks": {symbol :req.body}}}, function(err, numAffected, rawResponse) {
      if (err) return res.send("add stock error: " + err);
  })
});

router.delete('/profile/:id', User.authMiddleware(), (req, res) =>{
    console.log('req.params.id:', req.params.id);
    User.findByIdAndRemove(req.params.id, {new :true}, (err, removed)=>{
      res.status(err ? 400 :200).send(err || removed);
    })
});

router.post('/login', (req, res) =>{
  User.authenticate(req.body, (err, token)=>{
      res.status(err ? 400 : 200).send(err || {token: token});
  });
});

router.post('/signup', (req, res) =>{
  User.register(req.body, (err, token)=>{
      res.status(err ? 400 : 200).send(err || {token: token});
  });
});

router.post('/facebook', (req, res) => {


  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  //  1.  Use Authorization Code (req.body.code) to request the Access Token
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(400).send({ message: accessToken.error.message });
    }


    //  2.  Use Access Token to request the user's profile.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(400).send({ message: profile.error.message });
      }
      
      // 3.  Use the profile to either:
      //    a.  Create a new account in our database for our user
      //    b.  Retrieve an existing user from our database

      User.findOne({facebook: profile.id}, (err, user) => {
        if(err) return res.status(400).send(err);

        if(user) {
          // Returning user

          // generate the token
          // respond with token
          let token = user.generateToken();
          res.send({token: token});
        } else {
          // New user

          // create their user
          // save to db

          // generate the token
          // respond with token

          let newUser = new User({
            email: profile.email,
            displayName: profile.name,
            profileImage: profile.picture.data.url,
            facebook: profile.id,
            age: profile.age,
            education: profile.education,
            about: profile.about
          });

          newUser.save((err, savedUser) => {
            if(err) return res.status(400).send(err);
            let token = savedUser.generateToken();
            res.send({token: token});
          });
        }
      });
    });
  });
});

module.exports = router;
