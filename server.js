const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);


async function insertData(email,  cpass) {
  try {
    await client.connect();
    const db = client.db("mydatabase");
    const collection = db.collection("Data");

    const document = {
      Email: email,
      confirmpassword: cpass,
    };

    const result = await collection.insertOne(document);
    console.log("Data inserted with _id: " + result.insertedId);
  } catch (err) {
    console.error("Error inserting data: ", err);
  } finally {
    await client.close();
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

app.post("/add", (req, res) => {
  const { email, cpass } = req.body;

 
  const pat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (pat.test(email) ) {
    insertData(email,  cpass);
    res.sendFile(__dirname + "/public/home.html");
  } else {
    res.status(400).send("Invalid data. Please check your input.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});