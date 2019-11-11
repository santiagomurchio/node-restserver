const express = require('express');
const Producto = require('../models/producto');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();

// Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {

    Producto
        .find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                Producto.countDocuments({ disponible: true }, (err, count) => {
                    res.json({
                        ok: true,
                        count,
                        productos
                    });
                });
            }

        });

});

// Buscar
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // i = case insensitive
    let filtro = { nombre: regex, disponible: true };

    Producto
        .find(filtro)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                Producto.countDocuments(filtro, (err, count) => {
                    res.json({
                        ok: true,
                        count,
                        productos
                    });
                });
            }

        });

});

// Obtener producto por id
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto
        .findById(id, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El producto buscado no existe.'
                    }
                });
            }

            return res.json({
                ok: true,
                productoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre');
});


// Crear un producto 
app.post('/producto/', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUnitario: Number(body.precioUnitario),
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario
    });

    producto.save((err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json(productoDB);
        }
    });
});

// Modificar un producto
app.put('/producto/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUnitario: Number(body.precioUnitario),
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: body.usuario,
        disponible: body.disponible
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El producto buscado no existe.'
                }
            });
        }

        return res.json({
            ok: true,
            productoDB
        });

    });

});

// Eliminar una categoria
app.delete('/producto/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let producto = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El producto buscado no existe.'
                }
            });
        }

        return res.json({
            ok: true,
            message: "El producto ha sido borrado con éxito."
        });

    });

});

module.exports = app