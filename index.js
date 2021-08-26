const express = require('express')
const mongoose = require('mongoose')
const Link = require('./models/linkSchema')
const ejs = require('ejs')
const randomString  = require('randomstring')
require('dotenv').config()

const app = express()
const mongoURI = `mongodb+srv://ion05:${process.env.MONGO_PASS}@cluster0.kdxsn.mongodb.net/link-shortener?retryWrites=true&w=majority`
mongoose.connect(String(mongoURI), {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then((result)=> {
    console.log('Connected to Mongo DB')
    const PORT = process.env.PORT || 5000
app.listen(PORT, err => {
    console.log(`App listening on ${PORT}`)
    if (err) throw  err
})
}).catch((err)=> console.log(err))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const shortL = null;
app.get('/', (req,res)  => {
    res.render('index', {'shortL':shortL})
})
app.post('/generate', ((req, res) => {
    const shortL = randomString.generate({
        length: 5,
        charset: 'hex'
    })
    res.render("index", {'shortL': shortL})
}))
app.post('/create-link', (req,res)=> {
    const fullLink = req.body.full
    const shortLink= req.body.short
    const newLink = new Link({
        "shortLink": shortLink,
        "fullLink": fullLink,
    })
    newLink.save().then((result)=>{
        res.redirect('/success')
    }).catch((err)=> {
        console.log(err)
    })
})
app.get('/success', (req,res)=> {
    res.render('success')
})
app.get('/:shortLink',((req, res) => {
    const shortLink = req.params.shortLink
    if (shortLink!=null) {
    Link.findOne({'shortLink':shortLink}).then((result)=> {
        res.redirect(result.fullLink)
    }).catch((err)=> {
        console.log(err)
    })
    } else {

    }

}))
