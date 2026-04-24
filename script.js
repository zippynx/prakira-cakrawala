const apiKey = "2fce6c117fea487ea2f62929251307";
let currentCity = "Jakarta"; 

function getIconEmoji(code, isNight) {
  if ([1000].includes(code)) return isNight ? "🌙" : "☀️";
  if ([1003].includes(code)) return isNight ? "🌤️" : "🌤️";
  if ([1006, 1009].includes(code)) return "☁️";
  if ([1030, 1135, 1147].includes(code)) return "🌫️";
  if ([1063, 1150, 1153, 1180, 1183, 1240].includes(code)) return isNight ? "🌧️" : "🌦️";
  if ([1186, 1189, 1192, 1195, 1243, 1246].includes(code)) return "🌧️";
  if ([1066, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return "❄️";
  if ([1069, 1072, 1168, 1171, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(code)) return "🌨️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  return "🌡️";
}

function isNight(hour) {
  return hour >= 18 || hour < 6;
}

function getWeatherByCity(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&lang=id`; 

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      const forecast = data.forecast.forecastday; 
      const location = data.location.name;

      const date = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      
      const localHour = new Date(data.location.localtime).getHours();
      const nightMode = isNight(localHour);
      const emoji = getIconEmoji(current.condition.code, nightMode);
      
      const card = document.querySelector(".weather-card");
      const sun = document.querySelector(".sun");
      const moon = document.querySelector(".moon");
      const body = document.body;

      if (nightMode) {
        card.classList.remove("day");
        card.classList.add("night");
        body.classList.remove("day");
        body.classList.add("night");
        sun.style.display = "none";
        moon.style.display = "block";
      } else {
        card.classList.remove("night");
        card.classList.add("day");
        body.classList.remove("night");
        body.classList.add("day");
        sun.style.display = "block";
        moon.style.display = "none";
      }

      document.querySelector(".city").textContent = location;
      document.querySelector(".date").textContent = date;
      document.querySelector(".details-top").innerHTML = `
        <div class="humidity">💧 ${current.humidity}%</div>
        <div class="wind">💨 ${current.wind_kph} km/h</div>
      `;
      document.querySelector(".weather-icon").textContent = emoji;
      document.querySelector(".temperature").textContent = `${current.temp_c}°C`;

      // Ambil 2 hari ke depan (index 1 dan 2)
      updateForecast(forecast.slice(1, 3), nightMode);
    })
    .catch((err) => {
      document.querySelector(".city").textContent = "Kota tidak ditemukan";
      console.error(err);
    });
}

function updateForecast(days, nightMode) {
    const forecastGrid = document.querySelector("#forecast .forecast-grid");
    
    // Hapus semua konten ramalan cuaca lama
    forecastGrid.innerHTML = '';
    
    // Buat elemen HTML dinamis untuk 2 kotak ramalan cuaca
    let html = days.map((dayData) => {
        const emoji = getIconEmoji(dayData.day.condition.code, nightMode);
        const label = new Date(dayData.date).toLocaleDateString("id-ID", {
            weekday: "long"
        });
        
        return `
            <div class="forecast-item">
                <div class="weather-day">${label}</div>
                <div class="weather-icon">${emoji}</div>
                <div class="temperature-card">${dayData.day.avgtemp_c}°C</div>
            </div>
        `;
    }).join("");

    // Template kotak kosong dengan ikon suhu
    const emptyCard = `
        <div class="forecast-item">
            <div class="weather-day">--</div>
            <div class="weather-icon">🌡️</div>
            <div class="temperature-card">--°C</div>
        </div>
    `;

    // Tambahkan 5 kotak kosong agar ada total 7 item yang bisa di-scroll
    html += emptyCard.repeat(5);
    
    forecastGrid.innerHTML = html;
}

// --- Event Listener untuk Search Bar ---
document.getElementById("search-btn").addEventListener("click", () => {
  const cityInput = document.getElementById("city-input").value;
  if (cityInput.trim() !== "") {
    getWeatherByCity(cityInput);
  }
});

// Agar bisa menekan tombol "Enter" di keyboard untuk mencari
document.getElementById("city-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const cityInput = document.getElementById("city-input").value;
    if (cityInput.trim() !== "") {
      getWeatherByCity(cityInput);
    }
  }
});

window.onload = () => {
  getWeatherByCity(currentCity);
};