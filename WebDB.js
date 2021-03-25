const mongoose = require ("mongoose")

const Schema = mongoose.Schema

const storage = new Schema({
    id: String,
    name: String
})

module.exports = mongoose.model('Storage', storage)