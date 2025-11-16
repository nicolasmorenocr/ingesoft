const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth');

const app = express();

// middlewares
app.use(express.static('public'));

app.use(express.json());
app.use(cors());

// routes

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});