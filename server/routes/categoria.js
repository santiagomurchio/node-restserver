const express = require('express');
const Categoria = require('../models/categoria');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();

// Obtener todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria
        .find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                Categoria.countDocuments({}, (err, count) => {
                    res.json({
                        ok: true,
                        count,
                        categorias
                    });
                });
            }

        });

});

// Obtener categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'La categoría buscada no existe.'
                }
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });
    });
});


// Crear una categoria 
app.post('/categoria/', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json(categoriaDB);
        }
    });

});

// Modificar una categoría
app.put('/categoria/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let categoria = {
        descripcion: body.descripcion,
        usuario: req.usuario,
        _id: id
    };

    Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'La categoría buscada no existe.'
                }
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });

    });

});

// Eliminar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'La categoría buscada no existe'
                }
            });
        }

        return res.json({
            ok: true,
            categoriaBorrada
        });

    });

});

module.exports = app