const jwt = require('jsonwebtoken');

// Verificar token
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEMILLA_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// Verificar token por url
let verificaTokenPorUrl = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEMILLA_TOKEN, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};


let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if ('ADMIN_ROLE' !== usuario.role) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador.'
            }
        });
    }

    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenPorUrl
}