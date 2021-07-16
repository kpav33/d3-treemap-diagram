let url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let values;

let svg = d3.select("#root");
let tooltip = d3.select("#tooltip");

function drawMap() {
  let hierarchy = d3
    .hierarchy(values, (node) => node.children)
    .sum((node) => node.value)
    .sort((a, b) => b.value - a.value);

  // Tests don't pass with width greater than 1000?
  let createTreeMap = d3.treemap().size([1000, 600]);

  createTreeMap(hierarchy);

  let movies = hierarchy.leaves();
  console.log(movies);
  let tile = svg
    .selectAll("g")
    .data(movies)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  tile
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => {
      //console.log(d);
      let category = d.data.category;
      if (category === "Action") return "red";
      if (category === "Adventure") return "tomato";
      if (category === "Animation") return "lightgray";
      if (category === "Biography") return "green";
      if (category === "Comedy") return "blue";
      if (category === "Drama") return "yellow";
      if (category === "Family") return "cyan";
    })
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .on("mouseover", (d) => {
      let value = d.data.value;
      tooltip
        .attr("data-value", (d) => value)
        .style("left", d3.event.pageX + 15 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .style("visibility", "visible")
        .text("OK");
    })
    .on("mouseout", (d) => tooltip.style("visibility", "hidden"));
  /*
  tile
    .append("text")
    .text((d) => d.data.name)
    .attr("x", "5")
    .attr("y", "20");*/

  tile
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data(function (d) {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attr("x", 3)
    .attr("y", function (d, i) {
      return 13 + i * 12;
    })
    .style("font-size", "13px")
    .text(function (d) {
      return d;
    });
}

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    values = data;
    console.log(values);
    drawMap();
  })
  .catch((error) => console.log(error));
