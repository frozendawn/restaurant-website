const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const validator = require('validator');


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

mongoose.connect("mongodb://localhost/restaurant-v3",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');


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

app.get('/recipes', (req,res) => {

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