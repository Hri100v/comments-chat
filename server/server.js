import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true
});
const prisma = new PrismaClient();

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
});

app.get("/posts", async (res, req) => {
    return await prisma.post.findMany({
        select: {
            id: true,
            title: true
        }
    });
});

app.get("/test", async (res, req) => {
    return await commitToDb(
        prisma.User.findMany({
            select: {
                id: false,
                name: true
            }
        })
    );
});

app.get("/test2", async (res, req) => {
    return await prisma.User.findMany({
        select: {
            id: true,
            name: true
        }
    });
});

async function commitToDb(promise) {
    const [error, data] = await app.to();
    if (error) {
        return app.httpErrors.internalServerError(error.message);
    }

    return data;
}

app.listen({ port: process.env.PORT });
