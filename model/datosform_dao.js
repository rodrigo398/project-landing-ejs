const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const stringConexion = process.env.MONGODB
const util = require('util');

module.exports.buscarQuery = (request, callback) => {
    MongoClient.connect(stringConexion, (err, database) => {

        database.collection('datosform').aggregate([{ "$match": { $text: { "$search": request } } }, { "$lookup": { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { $unwind: { path: "$datosEmpresa" } }]).toArray((err, docs) => {
            callback(null, docs);
        })
    })
}

module.exports.buscarQueryPublicacion = (request, callback) => {
    MongoClient.connect(stringConexion, (err, database) => {
        var objectIDRequest = new objectID(request);
        database.collection('datosform').aggregate([{ "$match": { "publicacionid": objectIDRequest } }, { "$lookup": { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { $unwind: { path: "$datosEmpresa" } }]).toArray((err, docs) => {
            callback(null, docs);
        })
    })
}

module.exports.getCategoriasProveedoresEmpresas = async function() {
    const db = await MongoClient.connect(stringConexion);
    const collectionDatosform = db.collection('datosform');
    const resultado = await collectionDatosform.distinct("data.persona juridica.Rubro");
    return resultado;
}