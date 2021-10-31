let weather = {
    "apiKey": "19c2a3f3e7b8fd1ea22e406fbc638115",

    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
             + city 
             +"&units=metric&appid=" 
             + this.apiKey
        )
        .then((response) => {
            if(!response.ok) {
                alert("No weather found!");
                throw new Error("No weather found!");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
        const { name } = data; //it will extract specific info from API , will extracrt name form the object
        const { icon, description } = data.weather[0];
        const { temp, humidity} = data.main;
        const { speed } = data.wind;
        //console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src= "https://openweathermap.org/img/wn/"+ icon +".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1920x1080/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var api_key = '99c6d5a9080a43a08797b0173a0b71f4';
  //var latitude = '51.0';
  //var longitude = '7.0';

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      //console.log(data.results[0]); // print the location
      weather.fetchWeather(data.results[0].components.city);
    } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
    },
    getLocation: function() {
        function success (data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else{
            weather.fetchWeather()
        }
    }
};

document.querySelector(".search button").addEventListener('click', function() {
    weather.search();  
});

document.querySelector(".search-bar").addEventListener("keyup", function (event){
    if(event.key == "Enter") {
        weather.search();
    }
});

//weather.fetchWeather("Dhaka");
geocode.getLocation();


