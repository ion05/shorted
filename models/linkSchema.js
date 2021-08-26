const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const reqString = {type:String, required:true}
const linkSchema = new Schema({
    'shortLink': reqString,
    'fullLink':reqString
}, {timestamps:true})

const Link = mongoose.model('Link', linkSchema)
module.exports=Link;