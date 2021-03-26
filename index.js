const mongoose = require ("mongoose")
const uri = "mongodb+srv://user:user@cluster0.3ozoq.mongodb.net/WebDB?retryWrites=true&w=majority"
const express = require ("express")
const cors = require ("cors")
const fetch = require ("node-fetch")
const storageDB = require ('./WebDB')
const app = express ()
app.use(cors())

mongoose.connect(uri,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(err) console.log(err)
    else {
        console.log('database active')
    }
})

function getWeatherJsonFromCoordinates(lat, lon, fn) {
    lat = encodeURIComponent(lat)
    lon = encodeURIComponent(lon)
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid=9c267e6baa6acb2b0131fb15ee8200bb").then(
        t => {
            t.json().then(function(b) {
                try {
                    fn(b, true)
                }
                catch (e) {
                    console.log(e)
                    fn(null, false)
                }
            })
        }
    )
        .catch(function (q) {
            console.log(q)
            fn(null, false)
        })
}

function getWeatherJsonFromName(name, fn) {
    name = encodeURIComponent(name)
    try {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="+name+"&units=metric&appid=9c267e6baa6acb2b0131fb15ee8200bb").then(
            t => {
                t.json().then(function(b) {
                    try {
                        fn(b, true)
                    }
                    catch (e) {
                        console.log(e)
                        fn(null, false)
                    }
                })
            }
        )
            .catch(t => {
                console.log(t)
                fn(null, false)
            })
    }
    catch (e) {
        console.log(e)
        fn(null, false)
    }

}

app.get("/", (req, res) =>{
    res.send("666")
})

app.get("/city", (req, res) =>{
    console.log(req.query.name)
    getWeatherJsonFromName(req.query.name, function(){
        res.json([...arguments])
    })
})

app.get("/cord", (req, res) =>{
    console.log(req.query.lat, req.query.lon)
    getWeatherJsonFromCoordinates(req.query.lat, req.query.lon, function(){
        res.json([...arguments])
    })
})

app.get("/setInfo", (req, res) =>{
    console.log(req.query)
    storageDB.findOne({myId: req.query.id}, (err, result) => {
        if(result) {
            res.status(200).end()
            return
        }
        let newSt = new storageDB({myId: req.query.id, name: req.query.name})
        newSt.save()
        res.status(200).end()
    })
})

app.get('/removeItem', (req, res) => {
    storageDB.findOneAndRemove({myId: req.query.id}, (err, doc) => {
        if (err || !doc){
            res.status(500)
            return
        }
        console.log(doc)
        res.status(200).end()
    })
})

app.get("/getInfo", (req, res) =>{
    storageDB.find({}, (err, docs) =>{
        if(err)
        {
            res.status(666)
            return
        }
        let result = {}
        for(let i = 0; i < docs.length; i++)
        {
            result[`${docs[i].myId}`] = docs[i].name
        }
        res.json(result)
    })
})










app.listen(666)
