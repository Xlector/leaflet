/* eslint-disable no-undef */
import "./style.css";
import * as L from "leaflet";
import "./node_modules/leaflet/dist/leaflet.css";
import "leaflet-easybutton";
import "./node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.min.js";
import "./node_modules/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

let first_time = true;
let last_location = {};
let last_known_location = L.featureGroup();
// let resizeable_circle = L.featureGroup();
const isSame = (a, b) => a.lat === b.lat && a.lon === b.lon;
// geolocalisation handler
function onLocationFound(e) {
  if (!isSame(e.latlng, last_location)) {
    last_known_location.clearLayers();
    const radius = e.accuracy / 2;
    const current_location = L.marker(e.latlng)
      .addTo(last_known_location)
      .bindPopup(`Nous sommes ici :-)`);
    L.circle(e.latlng, radius).addTo(last_known_location);
    Object.assign(last_location, e.latlng);
    if (first_time) {
      current_location.openPopup();
      setTimeout(() => {
        current_location.closePopup();
      }, 999);
      first_time = false;
    }
  }
  last_known_location.addTo(map);
}

function onLocationError(e) {
  //   alert("makhdamch");
  console.warn(e.message);
}

// let marker = null;
let streets = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  // noWrap: true,
});

const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  className: "map-tiles",
  // noWrap: true,
});

let Bloc_pedagogique_2 = L.marker([
    34.049437914067965, -6.811742521119348,
  ]).bindPopup("Bloc pedagogique 2"),
  Centre_de_recherche = L.marker([
    34.049974722160506, -6.811668977788722,
  ]).bindPopup("Centre de recherche"),
  laboratiore = L.marker([34.04980975957783, -6.811862740223119]).bindPopup(
    "laboratiore"
  ),
  Bloc_pedagogique_1 = L.marker([
    34.0499768086001, -6.812497279430038,
  ]).bindPopup("Bloc pedagogique 1"),
  Administration = L.marker([34.05077732512845, -6.812285681003138]).bindPopup(
    "Administration"
  );
let ESTS = L.layerGroup([
  Bloc_pedagogique_1,
  laboratiore,
  Bloc_pedagogique_2,
  Administration,
  Centre_de_recherche,
]);
let bounds = new L.LatLngBounds(new L.LatLng(-90, 180), new L.LatLng(90, -180));
const map = L.map("map", {
  layers: [osm, ESTS],
  center: bounds.getCenter(),
  maxBoundsViscosity: 1,
  maxBounds: bounds,
  minZoom: 3,
}).fitWorld();
let baseMaps = {
  OpenStreetMap: osm,
  "Mapbox Streets": streets,
};

let overlayMaps = {
  ESTS: ESTS,
};
// let layerControl =
L.control.layers(baseMaps, overlayMaps).addTo(map);

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

map.attributionControl.setPrefix(false);

L.easyButton('<span class="easy-btn arrow">&#10148;</span>', function () {
  map.locate({
    setView: true,
    maxZoom: 16,
    enableHighAccuracy: true,
  });
}).addTo(map);

map.pm.addControls({
  position: "topleft", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
  drawMarker: true, // adds button to draw markers
  drawPolygon: true, // adds button to draw a polygon
  drawPolyline: true, // adds button to draw a polyline
  drawCircle: true, // adds button to draw a cricle
  editPolygon: true, // adds button to toggle global edit mode
  deleteLayer: true,
});

var legend = L.control({ position: "topright" });
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");
  div.innerHTML = "<input type='text' id='my-element'>";
  div.firstChild.onmousedown = div.firstChild.ondblclick =
    L.DomEvent.stopPropagation;
  return div;
};
legend.addTo(map);

$(document).ready(function () {
  $("#my-element").select2({
    width: "44px",
    minimumResultsForSearch: Infinity,
    dir: "rtl",
  });
});
