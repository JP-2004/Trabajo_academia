const express = require('express');
const app = express();
const sequelize = require('./config/database');

const cursoRoutes = require('./routes/cursoRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const matriculaRoutes = require('./routes/matriculaRoutes'); 

app.use(express.json());

app.use('/cursos', cursoRoutes);
app.use('/estudiantes', estudianteRoutes);
app.use('/matriculas', matriculaRoutes); 

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true })
  .then(() => {
    console.log('Base de datos conectada');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error);
  });
