const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const courseRoutes = require('./routes/course');
app.use('/courses', courseRoutes);

const moduleRoutes = require('./routes/module');
app.use('/modules', moduleRoutes);

const videoRoutes = require('./routes/video');
app.use('/videos', videoRoutes);

const progressRoutes = require('./routes/progress');
app.use('/progress', progressRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend ConectaJutai rodando' })
})


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
