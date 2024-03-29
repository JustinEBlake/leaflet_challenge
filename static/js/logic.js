// Get url for significant earthquakes in the past month
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//Console log data
d3.json(url).then((data) => console.log(data.features.length));

//Create empty array for quake markers
let quake_markers = [];

//Perform a GET request to the query URL
d3.json(url).then((data)=>{
    
    //Loop through data
    for (let i = 0; i < data.features.length; i++) {

        //Get magnitude, depth, co-ordinates & place
        let quake_data = data.features[i];
        let magnitude = quake_data.properties.mag;
        let place = quake_data.properties.place;
        let coordinates = [quake_data.geometry.coordinates[1], quake_data.geometry.coordinates[0]];
        let depth = quake_data.geometry.coordinates[2];
        let time = quake_data.properties.time;
        let date = new Date(time);

        quake_markers.push(
            L.circle(coordinates, {
                    stroke: false,
                    fillOpacity: 0.75,
                    color: getColor(depth),
                    fillColor: getColor(depth),
                    radius: markerSize(magnitude)
                }
            ).bindPopup(`<h3>Location: ${place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Time: ${date}</p>`)
        );
    }

    //Create Layer group for 
    let markers = L.layerGroup(quake_markers);

    //Create map object
    let myMap = L.map("map", {
        center: [30, -0],
        zoom: 2,
        layers: markers
    });

    //Add Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Call createLegend function
    createLegend(myMap);
})

// Define a function to determine the marker size based on the magnitude
function markerSize(mag) {
    return (mag/2) *105000 ;
  }


// Define a function to get color based on depth
function getColor(quake_depth) {
    return quake_depth > 89 ? '#FE5F65' :
           quake_depth > 69 ? '#FCA25D' :
           quake_depth > 49 ? '#FDB72A' :
           quake_depth > 29 ? '#F7DB11' :
           quake_depth > 9 ? '#DBF402' :
                          '#A3F500';
  }

// Define a function to create a legend
function createLegend(myMap) {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white'; 
        let grades = [-10, 10, 30, 50, 70, 90]; 
        let labels = [];

        // Loop through the depth grades and generate a label with a colored square for each grade
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background-color:' + getColor(grades[i] + 1) + '"></i> ' +
                (grades[i + 1] ? grades[i] + '&ndash;' + grades[i + 1] + '<br>' : '+' + grades[i] + '<br>');
        }

        return div;
    };

    legend.addTo(myMap);
}




