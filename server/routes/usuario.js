const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore')

const app = express();

app.get('/usuario', function(req, res) {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Usuario
        .find({ estado: true }, 'nombre email role estado google img')
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                Usuario.count({ estado: true }, (err, count) => {
                    res.json({
                        ok: true,
                        count,
                        usuarios
                    });
                });
            }
        });


    // res.json({
    //     nombre: 'Santiago',
    //     apellido: 'Murchio',
    //     dni: '30487739',
    //     email: 'santiagomurchio@gmmail.com'
    // })
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        role: body.role,
        _id: id
    });

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json(usuarioDB);
        }
    });
});

app.post('/usuario/', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // img:
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json(usuarioDB);
        }
    });


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     })
    // } else {
    //     res.json(body);
    // }
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let usuario = {
        // _id: id,
        estado: false
    }

    Usuario.findByIdAndUpdate(id, usuario, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else if (!usuarioBorrado) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                usuarioBorrado
            });
        }
    });


    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         res.status(404).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuarioBorrado
    //     });
    // });
});

module.exports = app