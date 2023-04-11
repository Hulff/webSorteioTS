const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const incricao = new Schema({
    instagram:{
        type: String,
        require:true
    },
    nome:{
        type: String,
        require:true
    },
    nInscricao:{
        type: Number,
        require:true
    }
})

mongoose.model("Inscricao",incricao)