import fastify from "fastify";
import sensible from "@fastify/sensible";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
// import { MongoClient, ServerApiVersion } from "mongodb";

// https://data.mongodb-api.com/app/data-vffsy/endpoint/data/v1

dotenv.config();

const app = fastify();
app.register(sensible);
const prisma = new PrismaClient();
// console.log(app);
// console.log(prisma);

app.get("/", (request, reply) => {
    reply.send({ hello: "world" });
});

app.get("/post", async (res, req) => {
    // TODO: Need to check why shows this error - ""
    // return await commitToDb(
    //     prisma.post.findMany({
    //         select: {
    //             id: true,
    //             title: true
    //         }
    //     })
    // );

    // console.log(res, req);

    try {
        return await prisma.post.findMany({
            select: {
                id: true,
                title: true
            }
        });
    } catch (error) {
        console.log(error, 2002);
        console.log(error.message);
        console.log(error.code, 2442);
    }
    
    // return await prisma.post.findMany({
    //     select: {
    //         id: true,
    //         title: true
    //     }
    // });

    // return await prisma.user.findMany({
    //     select: {
    //         id: true
    //     }
    // });
});

app.get("/test", async (res, req) => {
    // return await prisma.User.findFirst({
    //     select: {
    //         id: true,
    //         name: true
    //     }
    // });

    return await prisma.User.findMany({
        select: {
            id: true,
            name: true
        }
    });

    // return await prisma.Post.findFirstOrThrow({
    //     select: {
    //         id: true,
    //         title: true,
    //         body: true
    //     }
    // });

    // console.log(1001);
    // const data = await prisma.executeRaw(
    //     "SELECT * From test"
    // );
    // console.log(data);

    // return "test";
});

app.get("/test2", async () => {
    // console.log(1221, "/test2");
    // console.log(await prisma.user.findFirst({ id: true, name: true }));
    return "<h1>Test 2</h1>";
});

app.get("/test3", async (request, reply) => {
    // console.log(1331, "/test3");
    // const posts = await prisma.post.findMany();
    // console.log(posts);

    // return "<h1>Test 3</h1>";

    reply.send("Test 3");
});

// app.addContentTypeParser("application/json")

app.get("/test4", async (request, reply) => {
    // console.log(request.body);
    // console.log(request.headers);
    // console.log(request.raw);
    // console.log(request.server);

    // reply
    //     .code(200)
    //     .header('Content-Type', 'application/json; charset=utf-8')
    //     .send({ hello: 'world 1' });

    reply.send("Test 4");
});

// app.get("/test5",  {
//     params: {
//         "header": {
//             "api-key": "63e40cd6508a42c1b43061a4"
//         },
        
//         "data-raw": {
//             "collection":"Post",
//             "database":"test",
//             "dataSource":"Cluster0",
//             "projection": {"_id": 1}
//         }
//     }
// });

/*
API_KEY
TestApiKeyForPostman
63e40cd6508a42c1b43061a4
qERaUwi7hJPzLyiAliFJFqXVHwJMeI16zvI3Yl1YP1HKk0Bz7P2S1F0C0AD1WG4B

// New One
curl --location --request POST 'https://data.mongodb-api.com/app/data-vffsy/endpoint/data/v1/action/findOne' \
--header 'Content-Type: application/json' \
--header 'Access-Control-Request-Headers: *' \
--header 'api-key: qERaUwi7hJPzLyiAliFJFqXVHwJMeI16zvI3Yl1YP1HKk0Bz7P2S1F0C0AD1WG4B' \
--data-raw '{
    "collection":"agriculture",
    "database":"XSolid",
    "dataSource":"Cluster0",
    "projection": {"_id": 1}
}'

// Second New One
642e9500a55f8ed2408832be
postman-test
o9Ar2RJjTJzSQcGXHCAcWRSuS5i0EPqRRxen7yVaLkbujZ0YvWGnl7F2p4q3yVAh
curl --location --request POST 'https://data.mongodb-api.com/app/data-vffsy/endpoint/data/v1/action/findOne' \
--header 'Content-Type: application/json' \
--header 'Access-Control-Request-Headers: *' \
--header 'api-key: o9Ar2RJjTJzSQcGXHCAcWRSuS5i0EPqRRxen7yVaLkbujZ0YvWGnl7F2p4q3yVAh' \
--data-raw '{
    "collection":"agriculture",
    "database":"XSolid",
    "dataSource":"Cluster0",
    "projection": {"_id": 1}
}'



curl --location --request POST 'https://data.mongodb-api.com/app/data-vffsy/endpoint/data/v1/action/findOne' \
--header 'Content-Type: application/json' \
--header 'Access-Control-Request-Headers: *' \
--header 'api-key: <API_KEY>' \
--data-raw '{
    "collection":"Post",
    "database":"test",
    "dataSource":"Cluster0",
    "projection": {"_id": 1}
}'
*/

/*
mongosh "mongodb+srv://cluster0.82kbmi6.mongodb.net/test" --apiVersion 1 --username usernametest
*/

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://usernametest:passwordtest@cluster0.82kbmi6.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function commitToDb(promise) {
    const [error, data] = await app.to();
    if (error) {
        return app.httpErrors.internalServerError(error.message);
    }

    return data;
}

app.listen({ port: process.env.PORT });

/*
    - NEW -
API KEY
READ_ONLY

Public Key
rijlswev

Private Key
84baf5da-8819-45d0-b5c2-eefb726069a3
*/
