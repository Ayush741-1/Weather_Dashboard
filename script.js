moment().format("MMM Do YYYY");


function searchCity(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=metric&appid=fe59e8083e8f556ac01c563a325ee7aa";
    var queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=metric&appid=fe59e8083e8f556ac01c563a325ee7aa";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
        //empty divs and ids that we need to dump content into.....
        $("#current").empty();
       var mainDate = moment().format("MMM Do YYYY");
 

        //create HTML for city information......
        var cityNameEl = $("<h2>").text(response.name);
        var displayMainDate = cityNameEl.append(" " + mainDate);
        var tempEL = $("<p>").text("Temperature: " + response.main.temp + "C");
        var humEl = $("<p>").text("Humidity: " + response.main.humidity);
        var windEl = $("<p>").text("Wind Speed: " + response.wind.speed);
        var currentweather = response.weather[0].main;

        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather=== "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        //create HTML div to append new elements to render on page....
        var newDiv = $('<div>');

        newDiv.append(displayMainDate, currentIcon, tempEL, humEl, windEl);

        $("#current").html(newDiv);
        

var lat = response.coord.lat;
var lon = response.coord.lon;
var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=fe59e8083e8f556ac01c563a325ee7aa&lat=" + lat  + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (response) {
            $('#uvl-display').empty();
            var uvlresults = response.value;
            //create HTML for new div
            var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
      
            $('#uvl-display').html(uvlEl);
    
        });
    });

    $.ajax({
        url: queryURLforcast,
        method: 'GET'
    }).then(function (response) {
        
        var results = response.list;
        //empty 5day div
        $("#5day").empty();
        //create HTML for 5day forcast................
        for (var i = 0; i < results.length; i += 8) {
            // Creating a div
            var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
            
            //Storing the responses date temp and humidity.......
            var date = results[i].dt_txt;
            var setD = date.substr(0,10)
            var temp = results[i].main.temp;
            var hum = results[i].main.humidity;
   
            //creating tags with the result items information.....
            var h5date = $("<h5 class='card-title'>").text(setD);
            var pTemp = $("<p class='card-text'>").text("Temp: " + temp + "C");;
            var pHum = $("<p class='card-text'>").text("Humidity " + hum);;

            var weather = results[i].weather[0].main

            if (weather === "Rain") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Clouds") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } 
             else if (weather === "Clear") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
             else if (weather === "Drizzle") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
             else if (weather === "Snow") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }

            //append items to.......
            fiveDayDiv.append(h5date);
            fiveDayDiv.append(icon);
            fiveDayDiv.append(pTemp);
            fiveDayDiv.append(pHum);
            $("#5day").append(fiveDayDiv);
        }

    });



}
pageLoad();

$("#select-city").on("click", function (event) {
    
    event.preventDefault();
    
    var cityInput = $("#city-input").val().trim();

    //save search term to local storage.....
    var textContent = $(this).siblings("input").val();
    var storearr = [];
    storearr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(storearr));
  
    searchCity(cityInput);
    pageLoad();
});

function pageLoad () {
    var lastSearch = JSON.parse(localStorage.getItem("cityName"));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
    var psearch = $("<div>");
    psearch.append(searchDiv)
    $("#searchhistory").prepend(psearch);
}


$("#searchhistory").on('click', '.btn', function(event) {
event.preventDefault();
    console.log($(this).text());
    searchCity($(this).text());

});