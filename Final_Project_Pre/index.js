var svg = d3.select('svg').append('g').attr('transform','translate(100,100)');



//add the Architecture Axonic Drawing as background

var defs = svg.append('defs');
defs.append('pattern')
    .attr('id','bg')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 1250)
    .attr('height', 700)
    .append('image')
    .attr('xlink:href', 'Background_Single.png')
    .attr('width', 1250)
    .attr('height', 700)
    .attr('x', 0)
    .attr('y', 0);

svg.append('rect')
    .attr('width', 1250)
    .attr('height', 700)
    .attr('fill', 'url(#bg)');


//set up variables to hold two versions of the data, one for each year
var dataBlack;
var dataYellow;

//set up a tracker variable to watch the button click state
var clicked = true;

//set up scales to position circles using the data
var scaleX = d3.scalePoint().domain(["16-19", "20-24", "25-34", "35-44", "45-54", "55-64","65+"]).range([0, 600]);
var scaleY = d3.scaleLinear().domain([0,1200]).range([400, 0]);  //remember that 0,0 is at the top of the screen! 300 is the lowest value on the y axis


// Add the x Axis
/*svg.append("g")
    .attr('transform','translate(0,400)')  //move the x axis from the top of the y axis to the bottom
    .call(d3.axisBottom(scaleX));

svg.append("g")
    .call(d3.axisLeft(scaleY));*/


//define the line function
var lineFunction = d3.line()
//.interpolate('cardinal')
    .x(function(d){
        return d.x;
    })
    .y(function(d){
        return d.y;
    });


//import the data from the .csv file
d3.csv('./inPathData.csv', function(dataIn){


    nestedData = d3.nest()
        .key(function(d){return d.number})
        .entries(dataIn);

    console.log(nestedData);


    dataBlack = dataIn.filter(function(d){
        return d.number == 1;
    });




    /*nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    console.log(nestedData.filter(function(d){return d.key == "2016"})[0].values);
    */


    svg.append('text')
        .text('Walk Path in the CBD Area')
        .attr('transform','translate(300, -20)')
        .style('text-anchor','middle');

    /* svg.append('text')
         .text('age group')
         .attr('transform','translate(260, 440)');

     svg.append('text')
         .text('weekly income')
         .attr('transform', 'translate(-50,250)rotate(270)');*/

    //bind the data to the d3 selection, but don't draw it yet
    svg.selectAll('circles')
        .data(dataBlack)
        .enter()
        .append('circle')
        .attr('class','b_dataPoints');

    /*svg.selectAll('circles')
        .data(dataBlack)
        .enter()
        .append('circle')
        .attr('class','g_dataPoints')
        .attr('r', 5)
        .attr('fill', "gray");*/

    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(dataBlack);

});

//this function draws the actual data points as circles. It's split from the enter() command because we want to run it many times
//without adding more circles each time.
function drawPoints(pointData){



    svg.selectAll('.b_dataPoints')  //select all of the circles with dataPoints class that we made using the enter() commmand above
        .data(pointData)          //re-attach them to data (necessary for when the data changes from 2016 to 2017)
        .attr('cx',function(d){   //look up values for all the attributes that might have changed, and draw the new circles
            return d.x;
        })
        .attr('cy',function(d){
            return d.y;
        })
        .attr('fill', function(d){
            return d.fill;
        })
        .attr('r', function(d){
            return d.r;
        })
        .attr('stroke', function(d){
            return d.stroke;
        })
        .attr('stroke-width', 1);

    var path = svg.append('path')
        .data([pointData])
        .attr('class', 'line')
        .attr('stroke','steelblue')
        .attr('stroke-width', 1)
        .attr('d', lineFunction)
        .attr('fill', 'none')
        .style("stroke-dasharray",('15,5'));



}

function updateData(selectedRange){
    return nestedData.filter(function(d){
        return d.key == selectedRange;
    })[0].values;

} //track the data update function

//this function runs when the HTML button is clicked.
function sliderMoved(sliderValue) {

    console.log(sliderValue);

    var newData = updateData(sliderValue);
    console.log(newData);

    drawPoints(newData);
}