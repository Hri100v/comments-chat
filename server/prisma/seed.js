import { PrismaClient } from "@prisma/client";
// const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const hristo = await prisma.user.create({ data: { name: "Hristo" } });
    const emma = await prisma.user.create({ data: { name: "Emma" } });
    const peter = await prisma.user.create({ data: { name: "Peter" } });
    const anna = await prisma.user.create({ data: { name: "Anna" } });

    const post1 = await prisma.post.create({
        data: {
            title: "About Lorem Ipsum",
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }
    });

    const post2 = await prisma.post.create({
        data: {
            title: "Origin of Lorem Ipsum",
            body: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
        }
    });

    const comment1 = await prisma.comment.create({
        data: {
            parentId: undefined,
            message: "This is a root message",
            userId: hristo.id,
            postId: post1.id
        }
    });
    const comment2 = await prisma.comment.create({
        data: {
            parentId: comment1.id,
            message: "It is a nested message",
            userId: emma.id,
            postId: post1.id
        }
    });
    const comment3 = await prisma.comment.create({
        data: {
            parentId: comment2.id,
            message: "Another nested re-message",
            userId: hristo.id,
            postId: post1.id
        }
    });
    const comment4 = await prisma.comment.create({
        data: {
            parentId: undefined,
            message: "Different section",
            userId: hristo.id,
            postId: post2.id
        }
    });
    const comment5 = await prisma.comment.create({
        data: {
            parentId: undefined,
            message: "Different section - Comment 1",
            userId: peter.id,
            postId: post2.id
        }
    });
    const comment6 = await prisma.comment.create({
        data: {
            parentId: undefined,
            message: "Different section - Comment 2",
            userId: anna.id,
            postId: post2.id
        }
    });
};

seed();

// seed()
//     .catch((error) => {
//         console.error("The ERROR:");
//         console.log(error);
//     })
//     .finally(async () => {
//         console.log("Here I should disconnect 'Prisma'");
//     });
