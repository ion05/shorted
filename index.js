const express = require('express')
const mongoose = require('mongoose')
const Link = require('./models/linkSchema')
const ejs = require('ejs')
const randomString = require('randomstring')
require('dotenv').config()

const app = express()
let error = false
let msg = ""
const mongoURI = `mongodb+srv://ion05:${process.env.MONGO_PASS}@cluster0.kdxsn.mongodb.net/link-shortener?retryWrites=true&w=majority`
mongoose.connect(String(mongoURI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('Connected to Mongo DB')
    const mySecret = process.env['MONGO_PASS']

    const PORT = process.env.PORT || 5000
    app.listen(PORT, err => {
        console.log(`App listening on ${PORT}`)
        if (err) throw  err
    })
}).catch((err) => console.log(err))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}))

let url = null;
app.get('/', (req, res) => {
    res.render('index', {"error": error, 'msg':msg})
})

app.post('/create-link', async (req, res) => {
    const fullLink = req.body.full
    let shortLink = req.body.short
    if (!shortLink) {
        try {
            shortLink = randomString.generate({
            length: 5,
            charset: 'hex'
        })
        } catch (e) {
            error = true
            msg = "Couldnt generate random backlink. Please enter one"
            res.redirect('/')
        }


    }
    const newLink = new Link({
        "shortLink": shortLink,
        "fullLink": fullLink,
    })
    const full = await Link.findOne({"fullLink":fullLink})
    const short = await Link.findOne({'shortLink':shortLink})
    if(full) {
        error = true
        msg = 'This URL has already been shortened'
        url = "https://wwww.shorted.gq/"+full.shortLink
        res.redirect('/success')
    } else if (short) {
        error = true
        msg= "This backlink already exists. Please choose another one"
        res.redirect('/')
    } else {
        newLink.save().then((result) => {
                        url = `https://www.shorted.gq/${shortLink}`
                        res.redirect('/success')
                    }).catch((err) => {
                        error = true
                        msg = 'Trouble saving the shortened URL. Please try again later'
                        res.redirect('/')
                        console.log(err)
                    })
    }

})
app.get('/success', (req, res) => {
    res.render('success', {'link': url, error,msg})
})
app.get('/:shortLink', ((req, res) => {
    const shortLink = req.params.shortLink
        if (shortLink != 'favicon.ico')
        {
            Link.findOne({'shortLink': shortLink}).then((result) => {
            if (result == null) {
                error = true
                msg = 'This backlink doesnt exists. Please check the spelling'
                res.redirect('/')
            } else {
                res.redirect(result.fullLink)
            }

        }).catch((err) => {
            error = true
            msg = 'Some error with fetching the shortened url. Please try again later'
            res.redirect('/')
            console.log(err)
        })
        } else {}


}))
