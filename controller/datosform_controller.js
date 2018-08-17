const datosformDao = require("../model/datosform_dao");
const categoriasProveedores = require("../model/datosform_dao").getCategoriasProveedoresEmpresas;

module.exports.buscarQuery = (request, callback) => {
    datosformDao.buscarQuery(request, callback);
}

module.exports.buscarPorPublicacion = (request, callback) => {
    datosformDao.buscarQueryPublicacion(request, callback);
}

module.exports.getCategoriasProveedores = async function() {
    var categorias = await categoriasProveedores();
    return categoriasProveedores;
}