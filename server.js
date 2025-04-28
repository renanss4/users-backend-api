import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/users', async (req, res) => {
    let users = [];
    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: req.query.name } },
                    { email: { contains: req.query.email } },
                    { age: { equals: req.query.age } }
                ]
            }
        });
        res.status(200).json(users);
    } else {
        await prisma.user.findMany().then((users) => {
            res.status(200).json(users);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'An error occurred while fetching users.' });
        });
    }
});

app.post('/users', async (req, res) => {
    await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
      },
    });

    res.status(201).json(req.body);
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    await prisma.user.update({
      where: { id: id },
      data: { name, email, age },
    });

    res.status(200).json(req.body);
}
);

app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    await prisma.user.update({
      where: { id: id },
      data: { name, email, age },
    });

    res.status(200).json(req.body);
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: id },
    });

    res.status(204).send('User deleted successfully');
}
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});