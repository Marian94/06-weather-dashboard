const API_KEY = "ee3ad6f7859af5ea8f81f210969094c4";
const alertMessageCustom = document.getElementById("AlertMessageCustom");
const searchButton = document.getElementById("searchButton");

alertMessageCustom.hidden = true;

function alertMessage(message, type, removeClass) {
  if (removeClass) {
    alertMessageCustom.classList.remove(`alert-${removeClass}`);
  }
  alertMessageCustom.classList.add(`alert-${type}`);
  alertMessageCustom.innerText = message;
  alertMessageCustom.hidden = false;
}

function uvIndex(uvIdx) {
  const label = document.createElement("label");
  const uvIndex = document.getElementById("uvIndex");
  uvIndex.innerText = `UV Index:`;
  label.innerText = uvIdx;
  if (uvIdx >= 0 && uvIdx < 3) {
    label.classList.add("low");
  }
  if (uvIdx >= 3 && uvIdx < 6) {
    label.classList.add("moderate");
  }
  if (uvIdx >= 6 && uvIdx < 8) {
    label.classList.add("high");
  }
  if (uvIdx >= 8 && uvIdx < 11) {
    label.classList.add("very-high");
  }
  if (uvIdx >= 11) {
    label.classList.add("extreme");
  }
  uvIndex.appendChild(label);
}

function getUvIndex({ lat, lon }) {
  const urlUvIndex = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  fetch(urlUvIndex)
    .then(function (data) {
      data.json().then(function (response) {
        uvIndex(response.current.uvi);
      });
    })
    .catch(function (err) {
      console.log("err: ", err);
    });
}

function setWeatherInformation({ name, main, weather, wind, coord }) {
  const dt = new Date();
  document.getElementById("cityName").innerText = `${name} (${
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
  })`;
  document.getElementById("temp").innerText = `Temp: ${main.temp} °F`;
  document.getElementById("wind").innerText = `Wind speed: ${wind.speed} MPH`;
  document.getElementById("humidity").innerText = `Humidity: ${main.humidity}`;
  document.getElementById(
    "iconImage"
  ).src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  getUvIndex(coord);
}

function setDaysForecastCards(cityDays) {
  for (let i = 0; i < cityDays.length; i++) {
    if (document.getElementsByClassName(`card-${i}`).length === 0) {
      const divCol = document.createElement("div");
      divCol.classList.add("col-sm-3", `card-${i}`);
      const divCard = document.createElement("div");
      divCard.classList.add("card");
      const divCardBody = document.createElement("div");
      divCardBody.classList.add("card-body");
      const title = document.createElement("h6");
      title.classList.add("card-title");
      title.id = `card-${i}-title`;
      title.innerText = cityDays[i].dt_txt;
      const img = document.createElement("img");
      img.id = `card-${i}-img`;
      img.src = `https://openweathermap.org/img/wn/${cityDays[i].weather[0].icon}@2x.png`;
      const pTemp = document.createElement("p");
      pTemp.id = `card-${i}-temp`;
      pTemp.innerText = `Temp: ${cityDays[i].main.temp} °F`;
      const pWind = document.createElement("p");
      pWind.id = `card-${i}-wind`;
      pWind.innerText = `Wind Speed: ${cityDays[i].wind.speed} MPH`;
      const pHumidity = document.createElement("p");
      pHumidity.id = `card-${i}-id`;
      pHumidity.innerText = `Humidity: ${cityDays[i].main.humidity} `;
      divCardBody.appendChild(title);
      divCardBody.appendChild(img);
      divCardBody.appendChild(pTemp);
      divCardBody.appendChild(pWind);
      divCardBody.appendChild(pHumidity);
      divCard.appendChild(divCardBody);
      divCol.appendChild(divCard);
      document.getElementById("forecast").appendChild(divCol);
    } else {
      document.getElementById(`card-${i}-title`).innerText = cityDays[i].dt_txt;
      document.getElementById(
        `card-${i}-img`
      ).src = `https://openweathermap.org/img/wn/${cityDays[i].weather[0].icon}@2x.png`;
      document.getElementById(
        `card-${i}-temp`
      ).innerText = `Temp: ${cityDays[i].main.temp} °F`;
      document.getElementById(
        `card-${i}-wind`
      ).innerText = `Wind Speed: ${cityDays[i].wind.speed} MPH`;
      document.getElementById(
        `card-${i}-id`
      ).innerText = `Humidity: ${cityDays[i].main.humidity} `;
    }
  }
}

function setDaysForecast(cityName) {
  const urlCityName = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
  return fetch(urlCityName).then((data) => data.json());
}
function searchAgain(e) {
  const cityName = e.target.value;
  searchCity(cityName, false);
}

function createHistoryButtons(renderOneButton) {
  if (localStorage.getItem(`cityNames-localStorage`)) {
    const localStorageValue = localStorage
      .getItem(`cityNames-localStorage`)
      .split(",");
    if (renderOneButton) {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary");
      button.value = localStorageValue[localStorageValue.length - 1];
      button.innerText = localStorageValue[localStorageValue.length - 1];
      button.addEventListener("click", searchAgain);
      document.getElementById("historyButtons").appendChild(button);
    } else {
      for (let i = 0; i < localStorageValue.length; i++) {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary");
        button.value = localStorageValue[i];
        button.innerText = localStorageValue[i];
        button.addEventListener("click", searchAgain);
        document.getElementById("historyButtons").appendChild(button);
      }
    }
  }
}

function searchCity(cityName, isSearchButton) {
  const urlCityName = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  fetch(urlCityName)
    .then(function (data) {
      data.json().then(function (response) {
        const localStorageValue = localStorage.getItem(`cityNames-localStorage`)
          ? localStorage.getItem(`cityNames-localStorage`).split()
          : cityName;
        if (response.cod === 200) {
          alertMessage(
            `Here is the information of ${cityName}`,
            "success",
            "danger"
          );
          if (typeof localStorageValue === "object" && isSearchButton) {
            //Save more cities
            localStorageValue.push(cityName);
            localStorage.setItem(
              `cityNames-localStorage`,
              localStorageValue.toString()
            );
          } else {
            //Save the first city
            localStorage.setItem(`cityNames-localStorage`, localStorageValue);
          }
          setWeatherInformation(response);
          if (isSearchButton) {
            createHistoryButtons(true);
          }
          setDaysForecast(cityName).then((data) => {
            const arrDays = [];
            for (let i = 0; i < 5; i++) {
              arrDays.push(data.list[i * 8]);
            }
            setDaysForecastCards(arrDays);
          });
        }
        if (response.cod === "404") {
          alertMessage("ERROR, city not found!", "danger");
        }
        if (response.cod === "500") {
          alertMessage("OOPS, something get wrong", "danger");
        }
      });
    })
    .catch(function (err) {
      console.log("err: ", err);
    });
}

searchButton.addEventListener("click", () => {
  const cityName = document.getElementById("floatingInput").value;
  if (cityName !== "") {
    //call API
    searchCity(cityName, true);
  } else {
    alertMessage("Please add a City", "danger");
  }
});
createHistoryButtons(false);
