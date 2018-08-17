const empresasDao = require("../model/empresas_dao");
const datosformDao = require("../model/datosform_dao");
const util = require('util');
const uniq = require('uniq');


module.exports.encontrarQuery = (request, callback) => {
    var arrayMatches = [];
    empresasDao.buscarQuery(request, function(err, docs) {
        if (docs) {
            documentosAInsertar = [];
            for (let index = 0; index < docs.length; index++) {
                const documento = docs[index];
                documentosAInsertar.push({ datosEmpresa: documento });
            }
            arrayMatches = arrayMatches.concat(documentosAInsertar);
            datosformDao.buscarQuery(request, function(err, docus) {
                if (docus) {
                    arrayMatches = arrayMatches.concat(docus);
                    arrayMatches = uniq(arrayMatches, function(a, b) {
                        if (a.datosEmpresa._id.toString() == b.datosEmpresa._id.toString()) {
                            return 0;
                        } else {

                            // console.log(typeof(a.datosEmpresa._id));
                            // console.log(typeof(b.datosEmpresa._id));
                            return 1;
                        }

                    }, false);
                    //arrayMatches = filtradoAdicional(arrayMatches);

                    arrayMatches.sort((a, b) => {
                        if (a.datosEmpresa.nombreEmpresa < b.datosEmpresa.nombreEmpresa) return -1;
                        if (a.datosEmpresa.nombreEmpresa > b.datosEmpresa.nombreEmpresa) return 1;
                        return 0;
                    });
                    callback(null, arrayMatches);
                }
                if (err) {
                    callback(null, arrayMatches);
                }
            })
        }
        if (err) {
            datosformDao.buscarQuery(request, function(err, docus) {
                if (docus) {
                    arrayMatches = arrayMatches.concat(docus);
                    callback(null, arrayMatches);
                }
                if (err) {
                    callback("error", null);
                }
            })
        }
    });
}


module.exports.getEmpresaId = (body, callback) => {
    var arrayMatches = [];
    empresasDao.getEmpresaId(body, function(err, docs) {
        if (docs) {
            try {
                toInsert = [];
                toInsert.push({ nombreEmpresa: docs[0].nombreEmpresa, webID: docs[0].webID, publicacionid: docs[0].datosForm.publicacionid });
                if (docs[0].datosForm.data["persona juridica"]) toInsert.push({ personaJuridica: docs[0].datosForm.data["persona juridica"] });
                if (docs[0].datosForm.data["persona fisica"]) toInsert.push({ personaFisica: docs[0].datosForm.data["persona fisica"] });
                callback(null, toInsert);
            } catch (error) {
                callback("error", null);
            }
        } else {
            callback("error", null);
        }
    });
}

function filtradoAdicional(arrayMatches) {

    var arrayTemporal = [];
    arrayTemporal[0] = arrayMatches[0];
    for (let index = 0; index < arrayMatches.length; index++) {
        const elementoArray = arrayMatches[index];
        if (arrayTemporal[arrayTemporal.length - 1]) {
            if (arrayTemporal[arrayTemporal.length - 1].datosEmpresa._id.toString() != elementoArray.datosEmpresa._id.toString()) {
                arrayTemporal.push(elementoArray);
            }

            // console.log(arrayTemporal);
        }
    }
    return arrayTemporal;

}