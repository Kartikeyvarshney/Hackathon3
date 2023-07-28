const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.set('view engine' , 'ejs')
app.use(express.static(path.join(__dirname,"public")))

mongoose.connect(process.env.MONGODB)
.then(()=>{
    console.log('db connected')
})
.catch((err)=>{
    console.log(err.message)
})
const quoteschema ={
    author: String,
    quote: String
}

const Quote = mongoose.model("Quote" , quoteschema)

const quote1 = new Quote({
    author:"Sam",
    quote:"Hi friends"
})
const quote2 = new Quote({
    author:"Rahul",
    quote:"Good morning"
})

const defaultquotes = [quote1,quote2]

app.listen(process.env.PORT , ()=>{
    console.log(`Server is online`)
})
app.get('/',async(req,res)=>{
    let quotes = await Quote.find({});
    if(quotes.length === 0)
    {
        Quote.insertMany(defaultquotes)
        .then(()=>{
            console.log('Successfully saved default quotes to db')
        })
        .catch((err)=>  
        {
            console.log(err.message);
        })
    }
    else
    {
        res.render('allquotes' , {Quotes: quotes});
    }
    
})
app.get('/addnew',(req,res)=>{
    res.render('addnew')
})
app.post('/addnew',(req,res)=>{
    let quote = req.body.Quote;
    let name = req.body.Author_name;
   const newquote = new Quote({
    author:name,
    quote:quote
   })
   newquote.save();
    res.redirect('/')
})
app.post('/viewquote',(req,res)=>{
    const author = req.body.author;
    const quote = req.body.quote;
    res.render('viewquote' ,{viewQuote:quote , viewAuthor:author});
})