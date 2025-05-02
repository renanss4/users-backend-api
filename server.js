import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600,
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/users', async (req, res) => {
  const { name, email, age } = req.query;

  const filters = [];

  if (name) filters.push({ name: { contains: name } });
  if (email) filters.push({ email: { contains: email } });
  if (age) filters.push({ age: { equals: Number(age) } });

  try {
    const users = await prisma.user.findMany({
      where: filters.length ? { OR: filters } : undefined
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
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