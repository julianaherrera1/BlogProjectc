const express = require("express")
const cors = require("cors")
const { message } = require("statuses")
const { v4: uuidv4 } = require('uuid'); // Importar la función v4 para generar UUIDs
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const port  = 3000;


const mysql = require("mysql");

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blogprojectdb'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

const app = express()

app.use(bodyParser.json());

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

app.use(express.json());
app.use(express.urlencoded({extended:false})); //codifique todo lo que venga de una pagina HTML


//Rutas

app.post("/validar", function(req, res) {
    const datos = req.body;

    let nombre = datos.user;
    let correo = datos.email;
    let contraseña = datos.password;
    let nombre_usuario = datos.username;

    if (!nombre || !correo || !contraseña || !nombre_usuario) {
        console.log("Hay un campo sin llenar, todos los campos deben estar llenos");
        return res.status(400).send({ success: false, message: 'Hay un campo sin llenar, todos los campos deben estar llenos' });
    }

    let buscar_correo = "SELECT * FROM tabla_usuarios WHERE correo = ?";

    db.query(buscar_correo, [correo], async function(error, row) {
        if (error) {
            return res.status(500).send({ success: false, message: 'Error en el servidor' });
        } else {
            if (row.length > 0) {
                console.log("Ya hay una cuenta registrada con este correo");
                return res.status(400).send({ success: false, message: 'Ya hay una cuenta registrada con este correo' });
            } else {
                // Hashear la contraseña
                const saltRounds = 10;
                try {
                    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

                    let registrar = "INSERT INTO tabla_usuarios (nombre, correo, contraseña, nombre_usuario) VALUES (?, ?, ?, ?)";

                    db.query(registrar, [nombre, correo, hashedPassword, nombre_usuario], function(error) {
                        if (error) {
                            console.log('Error al registrar el usuario');
                            return res.status(500).send({ success: false, message: 'Error al registrar el usuario' });
                        } else {
                            console.log("Registro guardado correctamente");
                            return res.status(200).send({ success: true, message: 'Registro guardado correctamente' });
                        }
                    });
                } catch (err) {
                    console.log(err);
                    return res.status(500).send({ success: false, message: 'Error al procesar la solicitud' });
                }
            }
        }
    }); 
});


app.listen(port, function(){
    console.log(`Servidor escuchando en http://localhost:${port}`);
})