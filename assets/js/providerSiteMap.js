import GeneralMapping from './GeneralMapping.vue';
import Vue from 'vue';

/**
 * Create a map showing the location of a specific WQP site.
 *
 * @param {number} latitude The latitude of the site
 * @param {number} longitude The longitude of the site
 * @param {object} options An object containing mapDivId (div containing the map) and mapZoom (zoom level) attributes
 * @returns {L.map|*}
 */

let generalMappingClass = Vue.extend(GeneralMapping);
let generalMapping = new generalMappingClass();

export default function siteMap(latitude, longitude, options) {
    var mapDivId = options.mapDivId;
    var zoom = options.mapZoom;
    var map;
    var hydroLayerEndpoint = Config.HYDRO_LAYER_ENDPOINT;
    var flowlineEndpoint = Config.NHDPLUS_FLOWLINE_ENDPOINT;
    var layername = Config.NHDPLUS_FLOWLINE_LAYER_NAME;
    map = generalMapping.createWQPMap(mapDivId, 'Esri.WorldGrayCanvas');

    var esriHydroLayer = L.esri.tiledMapLayer({
        url: hydroLayerEndpoint
    });
    esriHydroLayer.addTo(map);

    var nhdplusLayer = L.tileLayer.wms(flowlineEndpoint, {
        layers : layername,
        format : 'image/png',
        transparent : true,
        opacity : 0.5
    });
    nhdplusLayer.addTo(map);

    map.setView([latitude, longitude], zoom);
    return map;
}
