const gisida = {};

gisida.version = require('../package.json').version;
gisida.initStore = require('./store/initStore').default;
gisida.Actions = require('./store/actions/Actions').default;
gisida.Reducers = require('./store/reducers/Reducers').default;
gisida.prepareLayer = require('./map/prepareLayer').default;
gisida.addLayer = require('./map/addLayer').default;
gisida.addPopUp = require('./map/addPopUp').default;
gisida.buildFilters = require('./map/buildFilters').default;
gisida.mergeFilters = require('./map/mergeFilters').default;
gisida.generateFilterOptions = require('./utils/filters').generateFilterOptions;

module.exports = gisida;
