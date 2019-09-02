const searchElement = document.querySelector('[data-city-search]')
const searchBox = new google.maps.places.SearchBox(searchElement)
var timeData = {};
searchBox.addListener('places_changed', () => {
    const place = searchBox.getPlaces()[0]
    if (place == null) return
    const latitude = place.geometry.location.lat()
    const longitude = place.geometry.location.lng()
    fetch('/time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    }).then(res => res.json()).then(data => {
        timeData = data;
        console.log(timeData)
    })
    fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
        setWeatherData(data, place)
    })
})

const icon = new Skycons({ color: '#222' })
const locationElement = document.querySelector('[data-location')
const statusElement = document.querySelector('[data-status')
const tempElement = document.querySelector('[data-temp')
const windElement = document.querySelector('[data-wind')
const precElement = document.querySelector('[data-prec')
const timeElement = document.querySelector('[data-time')
const dateElement = document.querySelector('[data-date')
icon.set('icon', 'partly-cloudy-day')

function setWeatherData(data, place) {

    currently = data.currently
    time = timeData.timestamp - 3600;

    timeElement.style.display = "block";
    dateElement.style.display = "block";

    locationElement.textContent = place.formatted_address;
    timeElement.textContent = timeConvert(time);
    dateElement.textContent = dateConvert(time);
    statusElement.textContent = currently.summary;
    tempElement.textContent = currently.temperature + " ℃ | " + Math.round(convertTemp(currently.temperature) * 100) / 100 + " ℉";
    windElement.textContent = currently.windSpeed + " kph | " + Math.round(convertSpeed(currently.windSpeed) * 100) / 100 + " mph"
    precElement.textContent = Math.round(currently.precipProbability * 100) + '%'
    icon.set('icon', currently.icon)
    switch (currently.icon) {
        case "clear-day":
            document.body.style.background = "url('img/clear.jpg')";
            break;
        case "clear-night":
            document.body.style.background = "url('img/night.jpg')";
            break;
        case "rain":
            document.body.style.background = "url('img/rain.jpg')";
            break;
        case "snow":
            document.body.style.background = "url('img/snow.jpg')";
            break;
        case "sleet":
            document.body.style.background = "url('img/snow.jpg')";
            break;
        case "wind":
            document.body.style.background = "url('img/wind.jpg')";
            break;
        case "fog":
            document.body.style.background = "url('img/fog.jpg')";
            break;
        case "cloudy":
            document.body.style.background = "url('img/cloud.jpg')";
            break;
        case "partly-cloudy-day":
            document.body.style.background = "url('img/cloud.jpg')";
            break;
        case "partly-cloudy-night":
            document.body.style.background = "url('img/night.jpg')";
            break;

    }
    icon.play()

    function convertTemp(input) {
        return (input * 9 / 5) + 32;
    }

    function convertSpeed(input) {
        return input / 1.609344;
    }

    function timeConvert(t) {
        var dt = new Date(t * 1000);
        var hr = dt.getHours();
        var m = "0" + dt.getMinutes();
        var s = "0" + dt.getSeconds();
        return hr + ':' + m.substr(-2);
    }

    function dateConvert(t){
        var date = new Date(t * 1000);

        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[date.getDay()] + "-" + date.getDate() + "-" + (date.getMonth()+1).toString() + "-" + date.getFullYear(); 
    }

}