const fragment = document.createDocumentFragment();
let diasDiv = document.getElementsByClassName("dias");
let tempAhora = document.getElementById("tempAhora");

async function fetchDatosJSON() {
  const URL = 'https://api.open-meteo.com/v1/forecast?latitude=43.3128&longitude=-1.975&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min'
  try {
    const respuesta = await fetch(URL);
    if (respuesta.ok) {
      datos = await respuesta.json();
      showData()
    } else {
      console.error('Fallo al procesar el archivo JSON: ', respuesta.statusText);
    }
  } catch (error) {
    console.error('Error en la conexión o en el mostrado de datos JSON', error);
  }
}
fetchDatosJSON();

function showData() {
  // Temperatura Actual
  let hoy = new Date();
  let ahora = hoy.getHours()
  let tempActual = datos.hourly.temperature_2m[ahora];
  console.log("Hora Actual: " + ahora);
  console.log("Temperatura Actual: " + tempActual + "°");
  tempAhora.textContent = tempActual + "°";

  // Temperatura máxima y mínima de los siguientes 7 días
  for (i in datos.daily.time) {
    let fecha = new Date(datos.daily.time[i]);
    // Día de la semana
    let diaString = fecha.toLocaleString("es-ES", { weekday: "long" });
    // Icono del tiempo
    let code = datos.daily.weathercode[i];
    // console.log(code);
    let icono = getIcon(code);
    // Temperatura máxima
    let tempMax = datos.daily.temperature_2m_max[i]
    // Temperatura mínima
    let tempMin = datos.daily.temperature_2m_min[i]
    addWeekData(diaString, icono, tempMax, tempMin);
  }
  diasDiv[0].appendChild(fragment);
}


function addWeekData(dia, icono, tempMax, tempMin) {
  const diaDiv = document.createElement("div");
  diaDiv.classList.add("dia");
  diaDiv.innerHTML = `
    <label>${dia}</label>
    <img class="icons" src=svg/${icono} alt=${icono}>
    <div class="temperaturas">
      <label id="tMax">${tempMax}°</label>
      <label id="tMin"> ${tempMin}°</label>
    </div>    
  `;
  fragment.appendChild(diaDiv);
}

function getIcon(code) {
  let tag;
  if (code === 0) {
    tag = "wi-day-sunny.svg"; // Despejado
  } else if (code === 1 || code === 2 || code === 3) {
    tag = "wi-day-cloudy.svg"; // Nublado
  } else if (code === 45 || code === 48) {
    tag = "wi-day-fog.svg"; // Neblina
  } else if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    tag = "wi-day-showers.svg"; // Llovizna
  } else if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) {
    tag = "wi-day-rain.svg"; // Lluvia
  } else if (code === 71 || code === 73 || code === 75) {
    tag = "wi-day-snow.svg"; // Nieve
  } else if (code === 77) {
    tag = "wi-day-hail.svg"; // Granizo
  } else if (code === 80 || code === 81 || code === 82) {
    tag = "wi-day-rain-wind.svg"; // Lluvia fuerte
  } else if (code === 85 || code === 86) {
    tag = "wi-day-snow-wind.svg"; // Nieve fuerte
  } else if (code === 95 || code === 96 || code === 99) {
    tag = "wi-day-thunderstorm"; // Tormenta
  }  
  return tag
}
