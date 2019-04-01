require('./config/config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json({
        nombre: 'Santiago',
        apellido: 'Murchio',
        dni: '30487739',
        email: 'santiagomurchio@gmmail.com'
    })
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({ id });
});

app.post('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json(body);
    }
});


// mocks for moove it
app.post('/dev/b2b-gateway/offers/redeem', function(req, res) {
    res.json(req.body);
});
app.post('/dev/b2b-gateway/offers/offerdetail', function(req, res) {
    res.json(req.body);
});
app.post('/dev/b2b-gateway/offers/void', function(req, res) {
    res.json(req.body);
});
app.post('/dev/b2b-gateway/offers/retrieveOfferWallet', function(req, res) {
    res.json(req.body);
});
app.get('/dev/setup', function(req, res) {
    res.json({
        step: "setup",
        status: "success"
    });
});
app.get('/dev/teardown', function(req, res) {
    res.json({
        step: "teardown",
        status: "success"
    });
});




app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}...`);
})