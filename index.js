const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((urlencodedParser = bodyParser.urlencoded({ extended: false })));

const uri =
  "mongodb+srv://noboniEcommerceSite:Nayem@khan1999@cluster0.3q4kc.mongodb.net/noboniEcommerceSite?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productsCollection = client
    .db("noboniecommercesite")
    .collection("products");

  app.get("/products", (req, res) => {
    const getProduct = req.body;
    productsCollection.find({}).toArray((err, result) => {
      res.send(result);
    });
  });

  app.get("/product/:id", (req, res) => {
    productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, result) => {
        res.send(result[0]);
      });
  });

  app.post("/products", (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct);
    res.redirect('/')
  });

  app.delete("/deleted/:id", (req, res) => {
    productsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0)
      });
  });

  app.patch("/update/:id", (req, res) => {
    productsCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        
      });
    //    res.send('Item is Deleted:')
  });
});

app.listen(3000);
