const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const stringConexion = process.env.MONGODB
const util = require('util');

MongoClient.connect(stringConexion, (err, database) => {

    module.exports.getPersonaId = (webid, callback) => {
        database.collection('personas').aggregate(
            [
                {
                    "$lookup": {
                        from: 'empresas',
                        localField: 'empresaid',
                        foreignField: '_id',
                        as: 'datosEmpresa'
                    }
                },
                {
                    $match: { webID: parseInt(webid) }
                },
                {
                    $unwind: {
                        path: '$datosEmpresa'
                    }
                }
            ]).toArray((err, docs) => {
            callback(null, docs);
        })
    }

    module.exports.buscarQuery = (request, callback)=>{
        database.collection('personas').aggregate([{ "$match": { $text: { "$search": request } } }, {
            "$lookup": {
                from: 'empresas',
                localField: 'empresaid',
                foreignField: '_id',
                as: 'datosEmpresa'
            }
        }, {$unwind:{ path: '$datosEmpresa'}} ]).toArray((err, docs) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, docs);
            }
        })
    }
})