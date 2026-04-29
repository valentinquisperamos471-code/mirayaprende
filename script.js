const movies = [
  {
    id: "momia",
    title: "La Posesion de la Momia",
    genre: "Terror",
    desc: "Solo secundaria",
    image: "https://sacnkprodpecms.blob.core.windows.net/content/posters/HO00008859.jpg",
    times: ["3:00 PM", "6:00 PM"],
    terror: true
  },
  {
    id: "jester",
    title: "The Jester 2",
    genre: "Terror",
    desc: "Solo secundaria",
    image: "https://static.cinepolis.com/img/peliculas/52509/1/1/52509.jpg",
    times: ["4:00 PM", "7:00 PM"],
    terror: true
  },
  {
    id: "michael",
    title: "Michael",
    genre: "Drama",
    desc: "Drama biografico",
    image: "https://m.media-amazon.com/images/M/MV5BNzllNmRlN2EtMDQyOC00ODJjLTg4OWQtZDNmNGU3YzlkNjc1XkEyXkFqcGc@._V1_.jpg",
    times: ["1:00 PM", "5:00 PM"]
  },
  {
    id: "mario",
    title: "Super Mario Galaxy",
    genre: "Familiar",
    desc: "Animacion",
    image: "https://m.media-amazon.com/images/S/pv-target-images/763db971dde3179cd23c0b16a7b9ee93314c35be4dd2e1a8372afa52178779f8.jpg",
    times: ["2:00 PM", "4:00 PM"]
  }
];

const seats = ["A1","A2","A3","A4","B1","B2","B3","B4","C1","C2","C3","C4","D1","D2","D3","D4"];

const movieGrid = document.getElementById("movieGrid");
const reserve = document.getElementById("reserve");

movies.forEach(movie => {
  movieGrid.innerHTML += `
    <div class="movie">
      <img src="${movie.image}" alt="${movie.title}">
      <div class="movie-content">
        <small>${movie.genre}</small>
        <h3>${movie.title}</h3>
        <p>${movie.desc}</p>
        <button onclick="openMovie('${movie.id}')">Comprar</button>
      </div>
    </div>
  `;
});

function openMovie(id) {
  const name = document.getElementById("name").value.trim();
  const grade = document.getElementById("grade").value;
  const movie = movies.find(m => m.id === id);

  if (!name) return alert("Escribe tu nombre");
  if (!grade) return alert("Selecciona tu grado");
  if (movie.terror && grade === "Primaria") return alert("Terror solo secundaria");

  reserve.innerHTML = `
    <div class="reserve-box">
      <h2>${movie.title}</h2>
      <div id="times"></div>
      <div id="bookingBox"></div>
    </div>
  `;

  const times = document.getElementById("times");
  movie.times.forEach(time => {
    times.innerHTML += `<button class="time-btn" onclick="showSeats('${movie.id}','${time}')">${time}</button>`;
  });

  reserve.scrollIntoView({ behavior: "smooth" });
}

function showSeats(movieId, time) {
  const key = `cine_${movieId}_${time}`;
  const occupied = JSON.parse(localStorage.getItem(key) || "[]");

  document.getElementById("bookingBox").innerHTML = `
    <div class="screen">PANTALLA</div>
    <div class="seats">
      ${seats.map(seat => `
        <button class="seat ${occupied.includes(seat) ? "occupied" : ""}" onclick="toggleSeat(this,'${seat}')">${seat}</button>
      `).join("")}
    </div>
    <button class="reserve-btn" onclick="confirmReserve('${movieId}','${time}')">Confirmar compra</button>
  `;
}

function toggleSeat(btn, seat) {
  if (btn.classList.contains("occupied")) return;
  btn.classList.toggle("selected");
}

function confirmReserve(movieId, time) {
  const selected = [...document.querySelectorAll(".seat.selected")].map(s => s.textContent);
  if (!selected.length) return alert("Selecciona al menos un asiento");

  const key = `cine_${movieId}_${time}`;
  const occupied = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([...occupied, ...selected]));

  const name = document.getElementById("name").value;
  const movie = movies.find(m => m.id === movieId);

  reserve.innerHTML += `
    <div class="ticket">
      <h3>Comprobante</h3>
      <p><b>Nombre:</b> ${name}</p>
      <p><b>Pelicula:</b> ${movie.title}</p>
      <p><b>Funcion:</b> ${time}</p>
      <p><b>Asientos:</b> ${selected.join(", ")}</p>
      <p><b>Botellas:</b> ${selected.length * 5}</p>
      <p><b>Codigo:</b> VQP-${Math.floor(Math.random() * 90000 + 10000)}</p>
    </div>
  `;
}
