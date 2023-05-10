import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://usernametest:passwordtest@cluster0.82kbmi6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

console.log(1771);
// console.log(client.db("test").collection("Post"));
var db = client.db("test");
// console.log(db);
var collection = db.collection("Post");
// console.log(collection);
collection.findOne((error, result) => {
    if (error) {
        throw error;
    }

    console.log(result);

    db.close();
});