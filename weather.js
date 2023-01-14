const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        // clear previous blocks
        this.resultsBlock.innerHTML = '';
        // add current weather block
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
			
            const DATA = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
            const TEMP = this.currentWeather.main.temp;
            const OTEMP = this.currentWeather.main.feels_like;
            const ICON = this.currentWeather.weather[0].icon;
            const DESC = this.currentWeather.weather[0].description;
			
			const headingBlockC = this.createHeadingC();
			this.resultsBlock.appendChild(headingBlockC);
            const CurrentWeather = this.createCurrentWeatherBlock(DATA, TEMP, OTEMP, ICON, DESC);
            this.resultsBlock.appendChild(CurrentWeather);
			const headingBlockFC = this.createHeadingFC();
			this.resultsBlock.appendChild(headingBlockFC);
        }
        // add forecast weather blocks
        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
				let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
				const tempdate = `${date.toLocaleDateString("pl-PL")}`;
				
				const currdate = new Date(this.currentWeather.dt * 1000);
				const tempcurrdate = `${currdate.toLocaleDateString("pl-PL")}`;
				const check = tempdate.substr(0, 2);
				const currcheck = tempcurrdate.substr(0, 2);
				if (check == currcheck){ continue; }

				const DATA = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
				const TEMP = weather.main.temp;
				const OTEMP = weather.main.feels_like;
				const ICON = weather.weather[0].icon;
				const DESC = weather.weather[0].description;

				const weatherBlock = this.createWeatherBlock(DATA, TEMP, OTEMP, ICON, DESC);
				if (i > 0){
					let after = this.forecast[i-1];
					const bedate = new Date(after.dt * 1000);
					const tempbedate = `${bedate.toLocaleDateString("pl-PL")}`;
					
					const becheck = tempbedate.substr(0, 2);
					if (check != becheck){
						weatherBlock.style.clear = "both";
					}
				}
				this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }
	createHeadingC(){
		let weatherHeading = document.createElement("h2");
		weatherHeading.innerHTML = "Pogoda aktualna: ";
		return weatherHeading;
	}
	createHeadingFC(){
		let weatherHeading = document.createElement("h2");
		weatherHeading.innerHTML = "Prognoza na 5 dni: ";
		return weatherHeading;
	}
	createCurrentWeatherBlock(date, temp, feeltemp, iconName, desc) {
        let blok = document.createElement("div");					//BLOK
        blok.className = "current-weather-block";
        let data = document.createElement("div");					//DATA
        data.className = "current-weather-date";
        data.innerText = date;
        blok.appendChild(data);
        let temperatura = document.createElement("div");			//TEMPERATURA
        temperatura.className = "current-weather-temperature";
        temperatura.innerHTML = `${temp} &deg;C`;
        blok.appendChild(temperatura);
        let odczuwalna = document.createElement("div");				//ODCZUWALNA
        odczuwalna.className = "current-weather-temperature-feels-like";
        odczuwalna.innerHTML = `Odczuwalna: ${feeltemp} &deg;C`;
        blok.appendChild(odczuwalna);
        let ikonka = document.createElement("img");					//IKONKA
        ikonka.className = "current-weather-icon";
        ikonka.src = this.iconLink.replace("{iconName}", iconName);
        blok.appendChild(ikonka);
        let opis = document.createElement("div");					//OPIS
        opis.className = "current-weather-description";
        opis.innerText = desc;
        blok.appendChild(opis);

        return blok;
    }
	createWeatherBlock(date, temp, feeltemp, iconName, desc) {
        let blok = document.createElement("div");					//BLOK
        blok.className = "weather-block";
        let data = document.createElement("div");					//DATA
        data.className = "weather-date";
        data.innerText = date;
        blok.appendChild(data);
        let temperatura = document.createElement("div");			//TEMPERATURA
        temperatura.className = "weather-temperature";
        temperatura.innerHTML = `${temp} &deg;C`;
        blok.appendChild(temperatura);
        let odczuwalna = document.createElement("div");				//ODCZUWALNA
        odczuwalna.className = "weather-temperature-feels-like";
        odczuwalna.innerHTML = `Odczuwalna: ${feeltemp} &deg;C`;
        blok.appendChild(odczuwalna);
        let ikonka = document.createElement("img");					//IKONKA
        ikonka.className = "weather-icon";
        ikonka.src = this.iconLink.replace("{iconName}", iconName);
        blok.appendChild(ikonka);
        let opis = document.createElement("div");					//OPIS
        opis.className = "weather-description";
        opis.innerText = desc;
        blok.appendChild(opis);

        return blok;
    }
}

document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");
document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});