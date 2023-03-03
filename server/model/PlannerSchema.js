const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    user_Id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    diaHoraAdicionado: {
        type: Date,
        required: true,
        default: Date.now,
    },
    conteudo: {
        type: String,
        required: false,
    },
    comentarios: {
        type: [String],
        default: [],
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("planners", plannerSchema);
