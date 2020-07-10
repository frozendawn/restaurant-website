const express = require('express');
const flash = require('express-flash');
const session = require("express-session");
const bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const validator = require('validator');
const bcrypt = require('bcrypt');

const User = require('./models/User')


const app = express();

//multer functions
const multerStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'public/img/users');
    },
    filename: (req,file,cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null,`user-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    } else {
        cb(new Error('Please upload only images'),false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

//database connection
mongoose.connect("mongodb://localhost/restaurant-v3",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');


//authentication middleware setup 

app.use(flash());
app.use(session({ secret: "cats",
resave: false,
saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());





//authentication
passport.serializeUser(function(user, done) {
    console.log('serialize')
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    console.log('deserialize')
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    async function(username, password, done) {

      try {
        const user = await User.findOne({username:username});
        console.log(user);
        if (user===null) {
            return done(null,false,{message: 'No user found with that username'})
        }
        if (await !bcrypt.compare(password,user.password)) {
            return done(null,false, { message: 'incorrect password'});
          }else{
            return done(null, user);
        }
      } catch (error) {
        console.log(error)
      }
        
    }
  ));

  //authentication middleware
  function isLoggedIn(req,res,next) {

    console.log('before if')
  if(req.isAuthenticated()){
    console.log('alo da')
      return next();
  }else {
    console.log('alo ne')
    res.redirect('/login')
  } 
   
}

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',async (req,res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        res.redirect('/login')

    } catch(err) {
        console.log(err)
        res.redirect('/register')
    }
});

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login', passport.authenticate('local', { 
  successRedirect: '/recipes',
  failureRedirect: '/login',
  failureFlash: true 
}));

app.get('/logout',(req,res) => {
  req.logout();
  res.redirect('/')
})


//recipe schema
var recipeSchema = new mongoose.Schema({
    title:String,
    desc:String,
    img:String
});

var Recipe = mongoose.model('Recipe',recipeSchema);


app.get('/',function(req,res){
    res.render('index')
    
})

app.get('/recipes',isLoggedIn, (req,res) => {

    Recipe.find({},(err,allRecipes) => {
       if(err){
           console.log(err);
       }else {
           res.render('recipes',{recipes:allRecipes});
       }
   }) 

})

app.get('/newRecipe',function(req,res){
   res.render('newRecipe');
})

app.post('/newRecipe',upload.single('img'),function(req,res){
    //get data from the form
    
    let title = req.body.title;
    let description = req.body.description;
    let image = req.file.filename;
    let newRecipe = {
                    title: title,
                    desc: description,
                    img: image
                };

                
    Recipe.create(newRecipe , function (err, recipe) {
        if (err) { 
            console.log(err);
        }else {
            res.redirect('/') 
            
            console.log('successfully saved ' + recipe)
        }
        
      });
});


//show route

app.get('/recipes/:id',function(req,res){
    Recipe.findById(req.params.id,function(err,foundRecipe){
        if(err){
            console.log(err);
            res.redirect('/recipes');
        }else{
            res.render('show',{recipe:foundRecipe});
        }
    })
})

//gallery route

app.get('/gallery',(req,res) => {
    res.render('gallery')
})

app.all('*',(req,res,next) => {
    /* const err = new Error (`Can't find ${req.originalUrl} on this server`);
    err.status = 'fail';
    err.statusCode = 404; */

  res.render('404page');
})

app.listen(3000,console.log("server listening on port 3000"));