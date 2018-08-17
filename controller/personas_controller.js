const personasDao = require("../model/personas_dao");
const util = require('util');
const uniq = require('uniq');

module.exports.getPersonaId = (request, callback) =>{
    var arrayMatches = [];
    personasDao.getPersonaId(request, (err, docs)=>{
        if (docs){
            callback(null, docs[0]);
        }
        else{
            callback("error", null);
        }
    })
}

module.exports.getEmpresaId = (body, callback) => {
    var arrayMatches = [];
    empresasDao.getEmpresaId(body, function(err, docs) {
        if (docs) {
            try {
                toInsert = [];
                toInsert.push({ nombreEmpresa: docs[0].nombreEmpresa, webID: docs[0].webID });
                if (docs[0].datosForm.data["persona juridica"]) toInsert.push({ personaJuridica: docs[0].datosForm.data["persona juridica"] });
                callback(null, toInsert);
            } catch (error) {
                callback("error", null);
            }
        } else {
            callback("error", null);
        }
    });
}

module.exports.buscarQuery = (body,callback) =>{
    var arrayMatches = [];
    personasDao.buscarQuery(body, function(err, docs){
        if (docs){
            callback(null, docs);
        }
    })
}

