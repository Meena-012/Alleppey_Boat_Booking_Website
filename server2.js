const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3005;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);


async function insertData(name,phonenum,email,cpass,boattype) {
  try {
    await client.connect();
    const db = client.db("mydatabase");
    const collection = db.collection("Data1");

    const document = {
        Name:name,
        phonenumber:phonenum,
        Email: email,
        confirmpassword: cpass,
        Houseboat:boattype,
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

app.post("/submit", (req, res) => {
  const {name,phonenum,email,cpass,boattype} = req.body;

 
  const pat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (pat.test(email) ) {
    insertData(name,phonenum,email,cpass,boattype);
    res.sendFile(__dirname + "/public/home.html");
  } else {
    res.status(400).send("Invalid data. Please check your input.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});