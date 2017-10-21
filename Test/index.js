var points = [
    [480, 200],
    [580, 400],
    [680, 100],
    [780, 300],
    [180, 300],
    [280, 100],
    [380, 400]
];

var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500);

//d3v4 line generator that uses a cardinal-closed curve
var path = svg.append("path")
    .data([points])
    .attr("d", d3.line().curve(d3.curveCardinalClosed));

svg.selectAll(".point")
    .data(points)
    .enter().append("circle")
    .attr("r", 4)
    .attr("transform", function(d) { return "translate(" + d + ")"; });

var circle = svg.append("circle")
    .attr("r", 13)
    .attr("transform", "translate(" + points[0] + ")");

transition();

function transition() {
    circle.transition()
        .duration(10000)
        .attrTween("transform", translateAlong(path.node()))
        .on("end", transition);
}

// Returns an attrTween for translating along the specified path element.
// Notice how the transition is slow for the first quarter of the aniimation
// is fast for the second and third quarters and is slow again in the final quarter
// This is normal behavior for d3.transition()
function translateAlong(path) {
    var l = path.getTotalLength();
    return function(d, i, a) {
        return function(t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";
        };
    };
}