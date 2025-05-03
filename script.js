
async function getData(city) {
    try{
        let x = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0521b51688d5ed8a6bb8c6a7100e9996&units=metric`);
        let data = x.json();
        return data;
    }
    catch(error){
        console.log(`Error loading data: ${error}`);
    }
}

async function fetchData() {
    let city = document.getElementById("City").value;
    let data = await getData(city);

    
    let div1 = document.createElement("div");
    div1.classList.add("card", "main-data","flex-col","rgap-15");
    let img_link = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    div1.innerHTML = `<h2 class="city-selected">${data.name}, ${data.sys.country}</h2>
                    <h2 class="temp">${data.main.temp}&deg; C</h2>
                    <div class="image">
                        <img src="${img_link}" alt="Unknown">
                        <span class="indication">${data.weather[0].main}</span>
                    </div>
                    <h4 class="abs-temp">Temperature: ${data.main.temp}&deg; C</h4>
                    <h4 class="humidity">Humidity: ${data.main.humidity}%</h4>
                    <h4 class="wind">Wind Speed: ${data.wind.speed} m/s</h4>`;

    let div2 = document.createElement("div");
    div2.classList.add("card", "other-data");
    div2.innerHTML = `<h4 class="first">Weather Details</h4>
                    <h4>Feels Like: </h4>
                    <h4>${Math.round(data.main.feels_like)}</h4>
                    <h4>Pressure: </h4>
                    <h4>${data.main.pressure} hPa</h4>
                    <h4>High / Low</h4>
                    <h4>${Math.round(data.main.temp_max)}&deg; C / ${Math.round(data.main.temp_min)}&deg; C</h4>
                    <h4>Visibility: </h4>
                    <h4>${data.visibility} m</h4>`;

    let div = document.getElementsByClassName("weather-details")[0];
    div.append(div1,div2);

}

async function main() {
    let get_city = document.getElementsByTagName("button")[0];
    get_city.addEventListener("click", () => {
        fetchData();
    })

    let get_data = document.getElementsByTagName("input")[0];
    get_data.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            fetchData();
        }
    })
}

main();