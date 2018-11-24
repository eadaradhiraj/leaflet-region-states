var map = L.map('mapid').setView([50, 10], 5);
var highlighted_states_feature, highlighted_regions_feature, selected_states_layer, selected_regions_layer
var theMarker = {};

function onEachFeature(_, layer) {
    layer.on({
        click: highlightFeature,
    });
}

function highlightFeature(e) {
    if (highlighted_feature !== undefined) {
        germany_regions_layer.resetStyle(highlighted_feature.target);
    }
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#5555ea',
        dashArray: '',
        fillOpacity: 0.2
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    highlighted_feature = e
}

L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);

map.on('click', function (e) {
    get_properties(e.latlng.lat, e.latlng.lng)
});

function add_marker(lat, long) {
    if (theMarker != undefined) {
        map.removeLayer(theMarker);
    }
    theMarker = L.marker([lat, long]).addTo(map);
}

function set_table(name_1, name_2) {

    var template = document.getElementById("details-template").innerHTML;
    var template_html = _.template(template)({
        NAME_1: name_1,
        NAME_2: name_2
    });
    document.getElementById("details-table").innerHTML = template_html;
}

function get_properties(lat, long) {

    selected_states_layer = leafletPip.pointInLayer([long, lat], germany_states_layer)[0]
    selected_regions_layer = leafletPip.pointInLayer([long, lat], germany_regions_layer)[0]
    if (selected_states_layer === undefined)
        return
    if (highlighted_states_feature !== undefined) {
        germany_states_layer.resetStyle(highlighted_states_feature);
    }
    if (highlighted_regions_feature !== undefined) {
        germany_regions_layer.resetStyle(highlighted_regions_feature);
    }
    set_table(selected_states_layer.feature.properties.NAME_1, selected_regions_layer.feature.properties.NAME_2)

    add_marker(lat, long)
    selected_states_layer.setStyle({
        weight: 5,
        color: '#228B22',
        dashArray: '',
        fillOpacity: 0.2
    });
    selected_regions_layer.setStyle({
        weight: 5,
        color: '#5555ea',
        dashArray: '',
        fillOpacity: 0.2
    });

    highlighted_states_feature = selected_states_layer
    highlighted_regions_feature = selected_regions_layer
}
var germany_states_layer = L.geoJson(german_states_obj, {
    style: {
        fillOpacity: 0.0,
        "weight": 0
    },
}).addTo(map);
var germany_regions_layer = L.geoJson(german_regions_obj, {
    style: {
        fillOpacity: 0.0,
        "weight": 0
    },
}).addTo(map);