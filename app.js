const loadAllPlayers = () => {
  fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=me")
    .then((res) => res.json())
    .then((data) => {
      displayPlayers(data.player);
    });
};

const displayPlayers = (players) => {
  const playersContainer = document.getElementById("players");
  playersContainer.innerHTML = ''; // Clear previous results
  players.forEach((player) => {
      const div = document.createElement("div");
      div.classList.add("card", "col-md-4", "mb-4");
      div.innerHTML = `
          <div class="card">
              <img src="${player.strThumb || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${player.strPlayer}">
              <div class="card-body">
                  <h5 class="card-title">${player.strPlayer}</h5>
                  <p class="card-text">Nationality : ${player.strNationality}</p>
                  <p class="card-text">Sports : ${player.strSport}</p>
                  <p class="card-text">Current team : ${player.strTeam}</p>
                  <p class="card-text">Salary: ${player.strWage}</p>
                  <p class="card-text">Description: ${player.strDescriptionEN ? player.strDescriptionEN.slice(0, 80) : 'N/A'}</p>
                  <div class="d-flex">
                      <a href="${player?.strFacebook}" target="_blank" class="p-2"><i class="fa-brands fa-facebook"></i></a>
                      <a href="${player?.strTwitter}" target="_blank" class="ms-1 p-2"><i class="fa-brands fa-twitter"></i></a>
                  </div>
                  <button onclick="handleAddtoCart('${player.strThumb}','${player.strPlayer}')" type="button" class="btn btn-primary">Add</button>
                  <button type="button" class="btn btn-primary" onclick="handleDetails(${player.idPlayer})" data-bs-toggle="modal" data-bs-target="#playerModal">Details</button>
              </div>
          </div>
      `;
      playersContainer.appendChild(div);
  });
};

const handleSearch = () => {
  const inputVal = document.getElementById("search").value;
  if (inputVal.trim() === '') {
      return;
  }
  fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${inputVal}`)
      .then((res) => res.json())
      .then((data) => {
          if (data.player) {
              displayPlayers(data.player);
          } else {
              alert('No players found');
              document.getElementById("players").innerHTML = ''; // Clear previous results if no players found
          }
      })
};

const handleAddtoCart = (img, name) => {
  const cartCount = document.getElementById("count").innerText;

  let convertedCount = parseInt(cartCount);
  convertedCount += 1;
  if(convertedCount >11){
    alert("11 players selected you can't select any more");
    return;
  }
  document.getElementById("count").innerText = convertedCount;
  const container = document.getElementById("cart-container");
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
  <img src="${img || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${name}">
    <h3 class="name">${name}</h3>
    `;
  container.appendChild(div);
};

const handleDetails = (playerId) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
    .then(res => res.json())
    .then(data => {
      if (data.players && data.players.length > 0) {
        const player = data.players[0];
        document.getElementById("modal-player-name").innerText = `Name: ${player.strPlayer}`;
        document.getElementById("modal-player-nationality").innerText = `Nationality: ${player.strNationality}`;
        document.getElementById("modal-player-sport").innerText = `Sport: ${player.strSport}`;
        document.getElementById("modal-player-team").innerText = `Current Team: ${player.strTeam}`;
        document.getElementById("modal-player-description").innerText = `Description: ${player.strDescriptionEN}`;
      }
    })
};

loadAllPlayers();
