const express = require('express')
const mongoose = require('mongoose')
const Link = require('./models/linkSchema')
const ejs = require('ejs')
const randomString = require('randomstring')
require('dotenv').config()

const app = express()
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

let error = false
let type = false
let msg = ""
let url = null;
app.get('/', (req, res) => {
    res.render('index', {"error": error, "type": type, "msg": msg})
})

app.post('/create-link', async (req, res) => {
    const fullLink = req.body.full
    let shortLink = req.body.short
    if (!shortLink) {
        shortLink = randomString.generate({
            length: 5,
            charset: 'hex'
        })

    }
    const newLink = new Link({
        "shortLink": shortLink,
        "fullLink": fullLink,
    })

    Link.findOne({'fullLink': fullLink}).then((result) => {
        if (result) {
            console.log('Already Exists')
        } else {
            Link.findOne({'shortLink': shortLink}).then((result) => {
                if (result) {
                    console.log('Already Exists')
                } else {
                    newLink.save().then((result) => {
                        url = `https://shorted.gq/${shortLink}`
                        res.redirect('/success')
                    }).catch((err) => {
                        error = true
                        type = "error"
                        msg = err
                        res.redirect('/')
                        console.log(err)
                    })
                }
            })

        }
    })

})
app.get('/success', (req, res) => {
    res.render('success', {'link': url})
})
app.get('/:shortLink', ((req, res) => {
    const shortLink = req.params.shortLink
    if (shortLink != 'favicon.ico') {
        Link.findOne({'shortLink': shortLink}).then((result) => {
            if (result == null) {
            } else {
                res.redirect(result.fullLink)
            }

        }).catch((err) => {
            console.log(err)
        })
    } else {
    }

}))
