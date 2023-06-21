import * as map from "./map.js";
import * as strava from "./strava.js";
import * as weather from "./weather.js";

window.onload = () => {
	map.init();
    strava.init();
};