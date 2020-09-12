function getWeather(coord, part) {
    const { lat, lon } = coord;
    var searchURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=${part}&appid=95c0f50cbe63f18291e3691e18e0e7dd`;
    fetch(searchURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (part === 'daily,minutely,current') {
            appendHourlyData(data);
        } else if (part === 'hourly,minutely,current') {
            appendDailyData(data);
        }  else if (part === 'hourly,daily,minutely'){
            displayCurrent(data);
        }else {
            displayCurrent(data);
        }
    })
}
function getLocation() {
    var cityname = document.getElementById("search-input").value;
    const apiKey = "95c0f50cbe63f18291e3691e18e0e7dd";
    var cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`;
    fetch(cityURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        var part = 'hourly,daily,minutely';
        getWeather(data.coord, part);
    })
}
function getCurrentLocation(part) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const coord = {
                "lat": position.coords.latitude,
                "lon": position.coords.longitude,
            }
            getWeather(coord, part);
        });
    }
    else {
        return alert("Geolocation not supported by this browser");
    }
}
function choosePart(event, partChosen) {
    if (partChosen === 'hourly') {
        var part = 'daily,minutely,current';
        getCurrentLocation(part);
    } else if (partChosen === 'daily') {
        var part = 'hourly,minutely,current';
        getCurrentLocation(part);
    } else if (partChosen === 'current') {
        var part = 'hourly,daily,minutely';
        getCurrentLocation(part);
    }
}
function displayCurrent(data) {
    const { timezone, current } = data;
    const { temp, feels_like, weather } = current;
    var x = document.getElementById("weather");
    var iconUrl = 'http://openweathermap.org/img/wn/' + weather[0].icon + '@2x.png';
    var img = "<img src='" + iconUrl + "'alt='icon'/> ";
    x.innerHTML = temp + '&deg; C' + img +
        "<br/>Feels like :" + feels_like + "&deg; C<br/> " + timezone + '<br/>' +
        weather[0].main + '<br/>' + weather[0].description;
}
function appendHourlyData(data) {
    const { timezone, hourly } = data;
    //const { temp, feels_like, weather } = hourly;
    var x = document.getElementById("weather");
    x.innerHTML = "Hourly forecast for next 2days";
    for (var i = 0; i + 5 < hourly.length; i++) {
        var div = document.createElement("div");
        var iconUrl = 'http://openweathermap.org/img/wn/' + hourly[i].weather[0].icon + '@2x.png';
        var img = "<img src='" + iconUrl + "'alt='icon'/> ";
        div.innerHTML = img + 'Hour-' + i + ': ' + hourly[i].temp + '&deg;C,Feels like  ' + hourly[i].feels_like + '&deg;C  ' + hourly[i].weather[0].main + '<hr/>';
        x.appendChild(div);
    }
}
function appendDailyData(data) {
    const { daily } = data;
    //const { temp, weather } =daily;
    var x = document.getElementById("weather");
    x.innerHTML = "Daily forecast for 7days";
    for (var i = 0; i < daily.length; i++) {
        var div = document.createElement("div");
        var iconUrl = 'http://openweathermap.org/img/wn/' + daily[i].weather[0].icon + '@2x.png';
        var img = "<img src='" + iconUrl + "'alt='icon'/> ";
        var day = "Morning: " + daily[i].temp.morn + "&deg;C, Day: " + daily[i].temp.day + "&deg;C, Evening: "
            + daily[i].temp.eve + "&deg;C, Night: " + daily[i].temp.night;
        div.innerHTML = img + 'Day(' + i + ') ' + day + '&deg;C. ' + daily[i].weather[0].main + ' <br/> ' + daily[i].weather[0].description + '<hr/>';
        x.appendChild(div);
    }
}

