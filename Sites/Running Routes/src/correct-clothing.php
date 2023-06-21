<?php
    //getting temp from url
    $temp = 50; // the default
    if(array_key_exists('temp', $_GET)){
        $temp = $_GET['temp'];
        $temp = (float)$temp; // explicitly cast value to a float
        if($temp > 50) {
            $temp = 50;
        }
        else if($temp < -10) {
            $temp = -10;
        }
        $temp = (round($temp / 10) * 10); //rounds to nearest 10
    }
    
    //getting weather from URL
    $weather = 'clouds';
    $rain = false;
    if(array_key_exists('weather', $_GET)){
        $weather = $_GET['weather'];
        
        if(strpos(strtolower($weather), 'rain') === false) {
            $rain = false;
        }
        else {
            $rain = true;
        }
    }
	
	//array of correct clothing temps for given temperature
	$temps = array(
		50=>"t-shirt and shorts",
		40=>"long-sleeve shirt and shorts",
		30=>"long-sleeve shirt and joggers",
		20=>"light jacket, hat, and joggers",
        10=>"light jacket, vest, hat, and thermal tights",
        0=>"winter jacket, hat, gloves, and thermal tights",
        -10=>"winter jacket, hat, gloves, wool socks, wind-briefs, and thermal tights"
    );

    $string = $temps[$temp];
    
    //gives recommendation based on if it is raining or not
    if($rain) {
        if($temp >= 30) {
            $string = "rain jacket, " . $string;
        }
        else {
            $string = "waterproof " . $string;
        }
    }

    // Send HTTP headers
    // https://www.php.net/manual/en/function.header.php
    // DO THIS **BEFORE** you `echo()` the content!
    header('content-type:application/json');      // tell the requestor that this is JSON
    header("Access-Control-Allow-Origin: *");     // turn on CORS
   
    echo $string;
?>