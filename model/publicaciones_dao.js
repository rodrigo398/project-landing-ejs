const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const stringConexion = process.env.MONGODB
const util = require('util');

module.exports.buscarEmpresasPorPublicacion((request, callback)=>{
    MongoClient.connect(stringConexion, (err, database) => {
        database.collection('')
    })
})