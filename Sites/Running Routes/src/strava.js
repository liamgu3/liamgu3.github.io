import * as map from "./map.js";
import * as weather from "./weather.js";

//function init() {

export let app = new Vue({
    el: '#strava',
    data: {
        title: 'Running Routes',
        results: {},
        loading: "Loading routes...",
        notFound: ""
    },
    created(){
        
    },
    methods:{
        //searches the specified area for running routes using the strava api
        search(lnglat, range){  
            //setting search area
            let sw_lat = lnglat.lat - range;
            let sw_lng = lnglat.lng - range;
            let ne_lat = lnglat.lat + range;
            let ne_lng = lnglat.lng + range;
            
            //putting together call with specified range
            let url="https://www.strava.com/api/v3/segments/explore?bounds=" + sw_lat + "%2C" + sw_lng + "%2C" + ne_lat + "%2C" + ne_lng + "&activity_type=running&access_token="
            
            //getting api key use auth token
            const Http = new XMLHttpRequest();
            const token_request='https://www.strava.com/oauth/token?client_id=65051&client_secret=a35cb5cba259fa51128f9c60594e84bd24a54cd0&grant_type=refresh_token&refresh_token=377579bfd2449acb9200ff693135ccf04bd3b465';
            Http.open("POST", token_request);
            Http.send();
            
            Http.onload = (e) => {
                //console.log(e.target.responseText);
                const jsonString = e.target.responseText;
                //console.log(jsonString.access_token);
                url += JSON.parse(jsonString).access_token; //adding api key to search call
                //console.log(url);
                fetch(url)
                    .then(response => {
                    if(!response.ok){
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                    .then(json => {	
                    //console.log(json);
                    //filtering results by running distance, and displaying results on map and table
                    
                    let minDist = document.getElementById("minDist").value;
                    let maxDist = document.getElementById("maxDist").value;
                    let validSegments = [];
                    
                    if(json.segments.length >= 10)  //checks if enough results were recieved, expands range if not enough
                    {
                        for(let point of json.segments)
                        {
                            if(point.distance >= (minDist * 1609.34) && point.distance <= (maxDist * 1609.34))
                            {
                                validSegments.push(point);
                                map.addMarker(point.start_latlng, point.name, point.distance, 'marker');
                                //console.log("marker added at " + point.start_latlng);
                            }
                        }
                        //saving results to storage
                        if(validSegments.length > 0) {
                            this.notFound = "";
                            this.results = validSegments;
                            localStorage.setItem('results', JSON.stringify(validSegments));
                        }
                        else{
                            this.notFound = "No routes found in specified distance range."
                        }
                        
                        this.loading = "";
                        //console.log(this.results);
                    }
                    else
                    {   
                        //expanding search if not enought routes returned
                        this.search(lnglat, range * 1.5);
                    }
                });
            }
            
            
        }, // end search
        clear(){
            //clear map markers
            map.clearMarkers();
            
            //clearing results table
            this.results = {};
            
            //clearing weather data
            weather.app.results_weather = '';
            weather.app.results_temp = '';
            weather.app.correct_clothing = '';
            
            //reset drop down menus
            let minDist = document.getElementById("minDist");
            let maxDist = document.getElementById("maxDist");
            minDist.selectedIndex = 0;
            maxDist.selectedIndex = 4;
            
            //clear local storage
            localStorage.clear();
        }
    } // end methods
});

//primarily loads values from localStorage
function init(){
    //getting minDist value from localStorage
    let minDist = document.getElementById("minDist");
    if(localStorage.hasOwnProperty('minDist')){
        minDist.selectedIndex = localStorage.getItem('minDist');
    }
    minDist.addEventListener('change', (e) => {
        localStorage.setItem('minDist', e.target.selectedIndex);
    });
    
    //getting maxDist value from localStorage
    let maxDist = document.getElementById("maxDist");
    if(localStorage.hasOwnProperty('maxDist')){
        maxDist.selectedIndex = localStorage.getItem('maxDist');
    }
    maxDist.addEventListener('change', (e) => {
        localStorage.setItem('maxDist', e.target.selectedIndex);
    });
    
    //searching results of last seached location
    if(localStorage.hasOwnProperty('lnglat') && localStorage.hasOwnProperty('results')){
        app.loading = "";
        let lnglat = localStorage.getItem('lnglat');
        //console.log(lnglat);
        
        let segments = JSON.parse(localStorage.getItem('results'));
        //console.log(segments);
        for(let point of segments){
           map.addMarker(point.start_latlng, point.name, point.distance, 'marker');
           //console.log("marker added at " + point.start_latlng);
        }
        app.results = segments;
        
        weather.app.search(JSON.parse(lnglat)); //gets current weather data with stored lnglat
    }
    else {
        app.loading = "";
    }
}

export {init};