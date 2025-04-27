// index.js - Archivo principal de la API

// Importar dependencias
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Inicializar Express
const app = express();
const PORT = 3000;

// Middleware para procesar JSON
app.use(express.json());

// Configurar la conexión a la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './academia_db.sqlite', // Archivo de base de datos SQLite
  logging: false // Desactivar logs SQL para mayor claridad
});

// Definir el modelo de Estudiante
const Estudiante = sequelize.define('Estudiante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false // Este campo es obligatorio
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Este campo es obligatorio
    unique: true, // No puede haber emails duplicados
    validate: {
      isEmail: true // Validación de formato de email
    }
  }
});

// Sincronizar el modelo con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// ENDPOINT 1: GET /estudiantes - Listar todos los estudiantes
app.get('/estudiantes', async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error al obtener la lista de estudiantes' });
  }
});

// ENDPOINT 2: GET /estudiantes/:id - Obtener un estudiante por ID
app.get('/estudiantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);
    
    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }
    
    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ error: 'Error al obtener el estudiante' });
  }
});

// ENDPOINT 3: POST /estudiantes - Crear un nuevo estudiante
app.post('/estudiantes', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    
    // Validar que los campos requeridos estén presentes
    if (!nombre || !email) {
      return res.status(400).json({ 
        error: 'Los campos nombre y email son obligatorios' 
      });
    }
    
    // Crear el nuevo estudiante
    const nuevoEstudiante = await Estudiante.create({
      nombre,
      email
    });
    
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    
    // Manejo específico de errores de validación
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al crear el estudiante' });
  }
});

// ENDPOINT 4: PUT /estudiantes/:id - Actualizar un estudiante existente
app.put('/estudiantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;
    
    // Buscar el estudiante
    const estudiante = await Estudiante.findByPk(id);
    
    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }
    
    // Actualizar los datos
    await estudiante.update({
      nombre: nombre || estudiante.nombre,
      email: email || estudiante.email
    });
    
    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    
    // Manejo específico de errores de validación
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al actualizar el estudiante' });
  }
});

// ENDPOINT 5: DELETE /estudiantes/:id - Eliminar un estudiante
app.delete('/estudiantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el estudiante
    const estudiante = await Estudiante.findByPk(id);
    
    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }
    
    // Eliminar el estudiante
    await estudiante.destroy();
    
    res.status(200).json({ 
      mensaje: 'Estudiante eliminado correctamente',
      id: id
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ error: 'Error al eliminar el estudiante' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});