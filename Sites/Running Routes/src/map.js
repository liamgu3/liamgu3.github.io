import * as strava from "./strava.js";
import * as weather from "./weather.js";

let geojson;
let map;
let markers = [];

function init()
{
    mapboxgl.accessToken = 'pk.eyJ1IjoibGlhbWd1MyIsImEiOiJja25nNXI3a3owOGwyMm9sd2hnZjI2dmprIn0.UISxekP1CDl4K8-1T4Nl3Q';
    
    //if lnglat saved in local storage, center on those coordinates
    if(localStorage.hasOwnProperty('lnglat')){
        let lnglat = localStorage.getItem('lnglat');
        lnglat = JSON.parse(lnglat);
        
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [lnglat.lng, lnglat.lat],
            zoom: 9.5
        });
    }
    else {
        //by default, centered on Rochester
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [-77.5, 43.15],
            zoom: 9.5
        });
    }
    
    // code from the next step will go here!
    geojson = {
        
    };
    
    //searches for routes and weather in location clicked by the user on the map
    map.on('click', function(e) {
        // The event object (e) contains information like the
        // coordinates of the point on the map that was clicked.
        //console.log('A click event has occurred at ' + e.lngLat);
        clearMarkers();
        strava.app.loading = "Loading routes...";
        strava.app.results = {};
        strava.app.search(e.lngLat, .025);
        weather.app.search(e.lngLat);
        //console.log(JSON.stringify(e.lngLat));
        localStorage.setItem('lnglat', JSON.stringify(e.lngLat));
    }); 
    
}

//adds route markers to map
function addMarker(coordinates, title, distance, className)
{
    let el = document.createElement('div');
    el.className = className;
    
    let marker = new mapboxgl.Marker(el)
        .setLngLat([coordinates[1], coordinates[0]])
        
        .addTo(map);
    
    el.addEventListener('click', function(e){
        // Prevent the `map.on('click')` from being triggered
        let popup = new mapboxgl.Popup()
            .setLngLat([coordinates[1], coordinates[0]])
            //.setPopup(new mapboxgl.Popup({ offset: 25 })  //add popups
            .setHTML('<h4>' + title + '</h4><p>' + (distance * 0.000621371).toFixed(2) + ' miles<p>')
            .addTo(map);
        e.stopPropagation();
    });
    
    markers.push(marker);
}

function clearMarkers()
{
    for(let i = markers.length - 1; i >= 0; i--)
    {
        markers[i].remove();
    }
}



export {init, addMarker, clearMarkers};