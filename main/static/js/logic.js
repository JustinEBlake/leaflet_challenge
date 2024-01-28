// Get url for earthquakes in past 7 days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//Console log data
d3.json(url).then((data) => console.log(data.features.length));

// A function to determine the marker size based on the magnitude
function markerSize(mag) {
    return Math.sqrt(mag*1000) *2000  ;
  }


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
        let date = new Date(time)

        quake_markers.push(
            L.circle(coordinates, {
                    stroke: false,
                    fillOpacity: 0.75,
                    color: "yellow",
                    fillColor: "yellow",
                    radius: markerSize(magnitude)
                }
            ).bindPopup(`<h3>Location: ${place}</h3><h3>Magnitude: ${magnitude}</h3><h3>Time: ${date.toLocaleString()}</h3>`)
        );
        
        console.log(coordinates)
    }

    //Create Layer group for 
    let markers = L.layerGroup(quake_markers);

    //Create map object
    let myMap = L.map("map", {
        center: [40, -95],
        zoom: 4,
        layers: markers
    });

    //Add Tile Layer
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
    }).addTo(myMap);


    console.log(quake_markers.length)

})
