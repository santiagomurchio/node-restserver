const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenPorUrl } = require('../middlewares/autenticacion')



let app = express();

app.get('/imagen/:tipo/:img', verificaTokenPorUrl, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(path.resolve(__dirname, '../assets/file_not_found.jpeg'));
    }
});

module.exports = app;