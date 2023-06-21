import * as map from "./map.js";

//function init() {
//let temp = 60;

export let app = new Vue({
    el: '#weather',
    data: {
        results_weather: '',
        results_temp: '',
        correct_clothing: ''
    },
    created(){
        
    },
    methods:{
        //searches for weather at specified location using OpenWeather API
        search(lnglat){
            //console.log(lnglat.lat);
            
            //puts together call with specified location
            const xhr = new XMLHttpRequest();
            let url="https://api.openweathermap.org/data/2.5/weather?lat=" + lnglat.lat + "&lon=" + lnglat.lng + "&appid=2d24db3f8e70ca306c1d17f12849b766&units=imperial";
            
            xhr.open("GET", url);
            xhr.send();
            
            xhr.onload = (e) => {
                //console.log(e.target.responseText);
                const jsonString = e.target.responseText;
                fetch(url)
                    .then(response => {
                    if(!response.ok){
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                    .then(json => {	
                    //displays weather and temperature on page
                    //console.log(json);
                    //console.log(json.weather[0].main);
                    this.results_weather = json.weather[0].main;
                    //console.log(json.temp);
                    this.results_temp = json.main.temp;
                    this.getClothing(this.results_temp, this.results_weather);
                });
            }
        },
        //makes call to my correct clothing web service with the given weather and temperature
        getClothing(temp, weather){
            //putting together call with temp and weather
            const xhr2 = new XMLHttpRequest();
            let url2 = "https://people.rit.edu/ljg2980/330/Project2/src/correct-clothing.php?temp=" + temp + "&weather=" + weather;
            xhr2.open("GET", url2);
            xhr2.send();
            
            // 3. set `onerror` handler
			xhr2.onerror = (e) => console.log("error");
			
			// 4. set `onload` handler
			xhr2.onload = (e) => {
				const headers = e.target.getAllResponseHeaders();
				const jsonString2 = e.target.response;
				
				// update the UI by showing the joke
                
                this.correct_clothing = jsonString2;
			}; // end xhr.onload
			
			// 5. open the connection using the HTTP GET method
			xhr2.open("GET",url2);
			
			// 6. we could send request headers here if we wanted to
			// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
			
			// 7. finally, send the request
			xhr2.send();
        }
    } // end methods
});