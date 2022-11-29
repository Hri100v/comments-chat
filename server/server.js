const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    await prisma.post.deleteMany();
    const post = await prisma.post.create({
        data: {
            title: "Test Title",
            body: "Test Body"
        }
    });
    
    console.log(post);
}

main();
