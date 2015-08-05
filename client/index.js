var data = [];

var body = window.document.getElementsByTagName('body')[0];
var bodyWidth = function() {
  return body.clientWidth - 10;
};
var bodyHeight = function() {
  return body.clientHeight - 100;
};

var svgMargins = {
  top: 30,
  right: 20,
  left: 50,
  bottom: 50
};

//This will need refactored for resize
var x = d3.scale.linear().range([0, bodyWidth() - svgMargins.left - svgMargins.right]);
var y = d3.scale.linear().range([bodyHeight() - svgMargins.top - svgMargins.bottom, 0]);

var svg = d3.select("body")
          .append("svg")
          .attr("width", bodyWidth())
          .attr("height", bodyHeight())
            .append("g")
            .attr("transform", "translate(" + svgMargins.left + ", " + svgMargins.top + ")");

var div = d3.select("body")
         .append("div")
         .attr("class", "info")
         .style("opacity", 0);

var update = function() {
  svg
    .attr("width", function() { return bodyWidth(); })
    .attr("height", function() { return bodyHeight(); });

  var yExtent = d3.extent(data, 
            function(d) {
             return d.NewHire_DisabledVets11
                  + d.NewHire_OtherProtectedVets11
                  + d.NewHire_ArmedForcesServiceMedalVets11
                  + d.NewHire_RecentlySeparatedVets11;
            })

  y.domain(yExtent).nice();
  x.domain(d3.extent(data, 
    function (d) { 
      return ((d.NewHire_DisabledVets11
              + d.NewHire_OtherProtectedVets11
              + d.NewHire_ArmedForcesServiceMedalVets11
              + d.NewHire_RecentlySeparatedVets11) / d.NewHire_TotalAllEmployees11) * 100})).nice();

  var color = d3.scale.linear().range([0,360]).domain(yExtent);

  var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

  svg.append("text")
    .text("% of All New Hires that were Veterans")
    .attr("x", function() { return ((bodyWidth() - svgMargins.left - svgMargins.right ) / 2) - 100; })
    .attr("y", function() { return bodyHeight() - svgMargins.top; });

  svg.append("text")
    .text("# of Veterans Hired")
    .attr("x", -50)
    .attr("y", -10);

  svg.append("g")
    .attr("transform", "translate(0, " + (bodyHeight() - svgMargins.top - svgMargins.bottom) + ")")
    .attr("class", "axis")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .call(yAxis)

  var circles = svg.selectAll("circle")
                  .data(data)
                  .enter()
                  .append("circle")
                    .attr("cx", function(d) { return x(
                      ((d.NewHire_DisabledVets11
                        + d.NewHire_OtherProtectedVets11
                        + d.NewHire_ArmedForcesServiceMedalVets11
                        + d.NewHire_RecentlySeparatedVets11) / d.NewHire_TotalAllEmployees11) * 100
                      ); })
                    .attr("cy", function(d) {
                      return y(d.NewHire_DisabledVets11
                            + d.NewHire_OtherProtectedVets11
                            + d.NewHire_ArmedForcesServiceMedalVets11
                            + d.NewHire_RecentlySeparatedVets11);
                    })
                    .attr("r", function(d) {
                      return (d.NumEmps_DisabledVets11
                        + d.NumEmps_OtherProtectedVets11
                        + d.NumEmps_ArmedForcesServiceMedalVets11
                        + d.NumEmps_RecentlySeparatedVets11) / 100
                    })
                    .style("fill", function(d) {
                      return d3.hsl(color(d.NumEmps_DisabledVets11
                        + d.NumEmps_OtherProtectedVets11
                        + d.NumEmps_ArmedForcesServiceMedalVets11
                        + d.NumEmps_RecentlySeparatedVets11), 1,0.5);
                    })
                    .style("opacity", 0.6)
                    .on("mouseover", function(d) {
                      div.transition()
                        .duration(100)
                        .style("opacity", 0.8);

                      div.html(
                          "Company: " + (d.HlName || d.CoName) + "<br/>" +
                          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
                          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
                          "&nbsp;&nbsp;&nbsp;" + (d.HlCity || d.CoCity) + ", " + (d.HlState || d.CoState) + "<br/>" +
                          "All Employees: " + d.NumEmps_TotalAllEmployees11 + "<br/>" +
                          "Veteran Employees: " + (d.NumEmps_DisabledVets11
                          + d.NumEmps_OtherProtectedVets11
                          + d.NumEmps_ArmedForcesServiceMedalVets11
                          + d.NumEmps_RecentlySeparatedVets11) + "<br/>" +
                          "All New Hires: " + d.NewHire_TotalAllEmployees11 + "<br/>" +
                          "Veteran New Hires: " + (d.NewHire_DisabledVets11
                            + d.NewHire_OtherProtectedVets11
                            + d.NewHire_ArmedForcesServiceMedalVets11
                            + d.NewHire_RecentlySeparatedVets11)
                        )
                        .style("left", function() {
                          var num = d3.event.pageX + 15;
                          if ((bodyWidth() - 150) <= num) { num -= (("Company: " + (d.HlName || d.CoName)).length * 8); }

                          return num + "px";
                        })
                        .style("top", (d3.event.pageY - 15) + "px");
                    })
                    .on("mouseout", function(d){
                      div.transition()
                        .duration(200)
                        .style("opacity", 0);
                    });

                          // Inner dot for future iteration.
                          // .append("circle")
                          //   .attr("fill", "black")
                          //   .attr("r", 2)
                          //   .attr("cx", function(d) { return d3.select(this.parentNode).attr("r"); })
                          //   .attr("cy", function(d) { return d3.select(this.parentNode).attr("r"); });

};

//Get data from db using fancy d3
var fetch = function() {
  d3.json('/api/vets', function(err, resp){
    data = resp;
    update();
  });
};

fetch();

//Resize not yet working.
// window.onresize = update;