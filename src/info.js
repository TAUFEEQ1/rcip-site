const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML =
    "<h4>Connected MDAs</h4>" +
    (props
      ? "<b>" + props.d + "</b><br />" + props.mdas+" MDAs"
      : "Hover over a district");
};
export default info;