const express = require("express")
const { MongoClient, ServerApiVersion, MongoDBNamespace } = require('mongodb');
const mongodb = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@my-first-cluster.fkvhj.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
let db, users;
client.connect(err => {
    db = client.db("users")
    users = db.collection("users")
});

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      )
    next();
});

app.post("/add-user", (req, res) => {
    users.insertOne(
        { first_name: req.body.namee,
        pincode : req.body.pincodee },
         (err, result) => {
             if (err) {
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json(result.insertedId)
         }
    )
})


app.get("/showdetails", (req ,res) => {
    const details = users.find({}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
         console.log("Results are " ,result);
        res.json(result);
      }
    });
    
})

app.delete('/:id',async (req, res) =>{    
    const result = await users.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.send(result);
})

app.listen(8080, () => console.log("Node Js Server ready"))
