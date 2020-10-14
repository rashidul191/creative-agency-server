const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4xle.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('upService'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userDetailCollection = client.db("creativeAgency").collection("userDetail");

    app.post('/addUserDetails', (req, res) => {
        const userDetails = req.body;
        //  console.log(userDetails);
        userDetailCollection.insertOne(userDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/userDetailsByData', (req, res) => {
        const userDetailsData = req.body;
        console.log(userDetailsData.userDetailsData);
        userDetailCollection.find({ topic: userDetailsData.userDetailsData })
            .toArray((err, document) => {
                res.send(document);
            })

    });
    

    app.post('/addService', (req, res) =>{
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        console.log(file, name, description);
        file.mv(`${__dirname}/upService/${file.name}`, err =>{
          if(err){
              console.log(err)
              return res.status(500).send({msg:'Failed to upload Image'});
          }

          return res.send ({name: file.name, path:`/${file.name}`});
            
        })
       
    })
});


app.listen(process.env.PORT || port)