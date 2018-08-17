const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const stringConexion = process.env.MONGODB
const util = require('util');

MongoClient.connect(stringConexion, (err, database) => {
    module.exports.buscarQuery = (request, callback) => {
        database.collection('empresas').aggregate([{ "$match": { $text: { "$search": request } } }]).toArray((err, docs) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, docs);
            }
        })
    }

    module.exports.getEmpresaId = (webid, callback) => {
        database.collection('empresas').aggregate(
            [{
                    "$lookup": {
                        from: 'datosform',
                        localField: '_id',
                        foreignField: 'empresaid',
                        as: 'datosForm'
                    }
                },
                {
                    $match: { webID: parseInt(webid) }
                },
                {
                    $unwind: {
                        path: '$datosForm'
                    }
                }
            ]).toArray((err, docs) => {
            callback(null, docs);
        })
    }


})