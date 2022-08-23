import L from "leaflet";
import districts from "./mdas";
import info from "./info";
import tile from "./tile";
import { CountUp } from "countup.js";
const map = L.map("map").setView([1.3360, 32.1825], 6.5);

tile.addTo(map);
// control that shows state info on hover


info.addTo(map);

// get color depending on population density value
function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 113
    ? "#BD0026"
    : d > 57
    ? "#E31A1C"
    : d > 28
    ? "#FC4E2A"
    : d > 1
    ? "#FD8D3C"
    : "#FFEDA0";
}

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.mdas),
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

geojson = L.geoJson(districts, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(map);

map.attributionControl.addAttribution(
  'NITA-U RCIP data &copy; <a href="http://nita.go.ug">NITA Uganda</a>'
);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [1,28,57,113],
    labels = [],
    from,
    to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' +
        getColor(from + 1) +
        '"></i> ' +
        from +
        (to ? "&ndash;" + to : "+")
    );
  }

  div.innerHTML = labels.join("<br>");
  return div;
};
legend.addTo(map);
/**
 * 
 * @param {{targets:Array<{value:number,id:string}>}} props 
 */
function Stats(props){
    this.targets = props.targets.map(el=>{
        return new CountUp(el.id,el.value,{duration:2*(el.value/1000)});
    });
    this.run = ()=>{
        this.targets.map(el=>el.start());
    }
}

const stats = new Stats({targets:[{id:'sites',value:1500},{id:'districts',value:69},{id:'fibre',value:4170}]});
window.onload=()=>{
  stats.run();
};
