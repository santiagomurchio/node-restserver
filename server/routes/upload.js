const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo.'
            }
        });
    }
    let archivo = req.files.archivo;

    // validar extensiones
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let partesNombreArchivo = archivo.name.split('.');
    let extension = partesNombreArchivo[partesNombreArchivo.length - 1];

    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas,
                extension
            }
        });
    }

    // validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos,
                tipo
            }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'usuarios':
                return imagenUsuario(id, res, nombreArchivo);
            case 'productos':
                return imagenProducto(id, res, nombreArchivo);
        }

        // return res.send({
        //     ok: true,
        //     message: 'Imagen subida correctamente.'
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            borraArchivo('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            borraArchivo('usuarios', nombreArchivo);
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no existe.'
                }
            });
        }

        // Borrar imagen anterior
        borraArchivo('usuarios', usuario.img);

        // Actualizar nueva imagen
        usuario.img = nombreArchivo;
        usuario.save((err, usuarioDB) => {
            return res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, producto) => {
        if (err) {
            borraArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            borraArchivo('productos', nombreArchivo);
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no existe.'
                }
            });
        }

        // Borrar imagen anterior
        borraArchivo('productos', producto.img);

        // Actualizar nueva imagen
        producto.img = nombreArchivo;
        producto.save((err, productoDB) => {
            return res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(tipo, nombreArchivo) {
    let pathOldImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathOldImg)) {
        fs.unlinkSync(pathOldImg);
    }

}
module.exports = app;