const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoría es obligatoria.']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


categoriaSchema.plugin(uniqueValidator, { message: 'El campo {PATH} debe ser único.' });
module.exports = mongoose.model('Categoria', categoriaSchema);