const weatherStyles = [
    { type: "thunderstorm", color: "#4a4e69" }, // dark purple/grey
    { type: "drizzle", color: "#9aa5b1" },      // soft steel grey
    { type: "rain", color: "#5271ff" },         // calm blue
    { type: "snow", color: "#edf2f7" },         // clean off-white
    { type: "mist", color: "#b8c1c8" },         // light fog grey
    { type: "smoke", color: "#a3a3a3" },        // neutral grey
    { type: "haze", color: "#bfc9ca" },         // smoky white
    { type: "dust", color: "#e0c097" },         // light brown
    { type: "fog", color: "#c2c2c2" },          // misty grey
    { type: "sand", color: "#e4c580" },         // warm yellow-beige
    { type: "ash", color: "#7d7d7d" },          // dark volcanic ash
    { type: "squall", color: "#34495e" },       // storm blue-grey
    { type: "tornado", color: "#6c757d" },       // steel dark
    { type: "clear", color: "#87ceeb" },        // clear sky blue
    { type: "clouds", color: "#d6dbe0" }         // light cloudy grey
];

async function getData(city) {
    try{
        let x = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0521b51688d5ed8a6bb8c6a7100e9996&units=metric`);
        let data = await x.json();

        // ⚠️ Fallback if city not found
        if (data.cod !== 200) {
            throw new Error(data.message); // triggers catch block
        }
        return data;
    }
    catch(error){
        alert(`❌ ${error.message.toUpperCase() || "Something went wrong. Try again."}`);
        console.log(`Something went wrong. Please try again : ${error}`);
        return null;
    }
}

async function getDataByCoords(lat, lon) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0521b51688d5ed8a6bb8c6a7100e9996&units=metric`);
        const data = await res.json();

        if (data.cod !== 200) throw new Error(data.message);
        return data;
    } catch (error) {
        alert("Couldn't get your location-based weather.");
        return null;
    }
}

const addElement = (data) =>{
    document.getElementById("welcome").classList.toggle("effect");

    let div = document.getElementById("weather-details");
    div.innerHTML = `<div class="loader"> </div>`;

    let div1 = document.createElement("div");
    div1.classList.add("card", "main-data", "flex-col", "rgap-5");
    let img_link = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    div1.innerHTML = `<h2 class="city-selected">${data.name}, ${data.sys.country}</h2>
                    <h2 class="temp">${Math.round(data.main.temp * 10) / 10}&deg; C</h2>
                    <h4>Feels Like ${Math.round(data.main.feels_like)}&deg; C</h4>
                    <div class="image flex-center">
                        <img src="${img_link}" alt="Unknown">
                        <span class="indication">${data.weather[0].main}</span>
                    </div>

                    <h4 class="humidity">Humidity : ${data.main.humidity}%</h4>
                    <h4 class="wind">Wind Speed : ${(Math.round(data.wind.speed * 10)) / 10} m/s</h4>`;

    let div2 = document.createElement("div");
    div2.classList.add("card", "other-data");
    div2.innerHTML = `<h4 class="first">More Details: </h4>
                    <h4 class="abs-temp">Temperature : ${Math.round(data.main.temp * 10) / 10}&deg; C</h4>                    
                    <h4>Pressure: ${data.main.pressure} hPa</h4>
                    <h4>High/Low: ${Math.round(data.main.temp_max * 10) / 10}&deg; C/${Math.round(data.main.temp_min * 10) / 10}&deg; C</h4>
                    <h4>Visibility: ${Math.round(data.visibility * 10) / 10000} km</h4>`;

    document.getElementById("city").value = "";

    let Wconditions = data.weather[0].main.toLowerCase();

    let style = weatherStyles.find(obj => obj.type === Wconditions);
    let bcolor = style ? style.color : "#ffffff"; // fallback to white
    document.body.style.backgroundColor = bcolor;
    document.body.classList.add("fade");

    setTimeout(() => {
        div.innerHTML = "";
        div.append(div1, div2);
    }, 2000);
}


async function fetchData() {
    let city = document.getElementById("city").value;
    if (!city.trim()) return alert("Please enter a city!");
    let data = await getData(city);
    if(data == null){
        document.getElementById("city").value = "";
        return;
    }
    addElement(data);
}

async function main() {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const data = await getDataByCoords(lat, lon);
            if (data) addElement(data);
        },
        (error) => {
            console.warn(`Geolocation not available or denied : ${error}`);
        }
    );


    let get_city = document.getElementById("go");
    get_city.addEventListener("click", () => {
        fetchData();
    })

    let get_data = document.getElementById("city");
    get_data.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            fetchData();
        }
    })
}

main();