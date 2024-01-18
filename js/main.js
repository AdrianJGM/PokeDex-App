const searchInput = document.getElementById("search");
const pokemonGrid = document.getElementById("pokemonGrid");
let currentPage = 1;
const itemsPerGridPage = 16;
let totalPokemons = 0;
let allPokemons = [];
let filteredData = [];

searchInput.addEventListener("input", updateData);

async function fetchAllPokemons() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1292`);
    const data = await response.json();

    totalPokemons = data.results.length;
    allPokemons = data.results;
    filteredData = allPokemons;
    updateData();
    updatePagination();
}

async function fetchPokemonDetails(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();

    return data;
}

function getPokemonId(url) {
    const matches = url.match(/\/(\d+)\/$/);
    if (matches) {
        return parseInt(matches[1]);
    }
    return null;
}

function updateGrid(data) {
    pokemonGrid.innerHTML = "";

    data.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("col-md-3", "pokemon-card");
        card.innerHTML = `
            <div id="#pokemonImage">
                <img class="pokemon-image" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-details">
                <p># ${pokemon.id}</p>
                <p class="nombre-pokemon"><strong>Nombre:</strong> <br><br>${pokemon.name}</p>
                <p class="type-label"><strong>Tipo:</strong> <br><br>${pokemon.types.map(type => {
                    const typeClass = type.type.name.toLowerCase();
                    return `<span class="type ${typeClass}">${type.type.name}</span>`;
                }).join(" ")}</p>
                <a href="#" class="details-link" data-id="${pokemon.id}">Explorar</a>
            </div>
        `;
        pokemonGrid.appendChild(card);
    });

    const detailsLinks = pokemonGrid.querySelectorAll(".details-link");
    detailsLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const pokemonId = link.getAttribute("data-id");
            openPokemonDetails(pokemonId);
        });
    });
}

async function updateData() {
    const query = searchInput.value.toLowerCase();
    filteredData = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query));
    currentPage = 1;
    updateDisplayData();
    updatePagination();
}

function updateDisplayData() {
    const startIndex = (currentPage - 1) * itemsPerGridPage;
    const endIndex = startIndex + itemsPerGridPage;
    const displayedData = filteredData.slice(startIndex, endIndex);

    const pokemonDetailsPromises = displayedData.map(pokemon => fetchPokemonDetails(getPokemonId(pokemon.url)));

    Promise.all(pokemonDetailsPromises)
        .then(pokemonDetails => {
            updateGrid(pokemonDetails);
        })
        .catch(error => {
            console.error("Error fetching Pokemon details:", error);
        });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerGridPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const prevPage = document.createElement("li");
    prevPage.classList.add("page-item");
    prevPage.innerHTML = `
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    prevPage.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplayData();
        }
    });

    pagination.appendChild(prevPage);

    for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement("li");
        page.classList.add("page-item");
        page.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        page.addEventListener("click", (event) => {
            currentPage = parseInt(event.target.getAttribute("data-page"));
            updateDisplayData();
        });
        pagination.appendChild(page);
    }

    const nextPage = document.createElement("li");
    nextPage.classList.add("page-item");
    nextPage.innerHTML = `
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    nextPage.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplayData();
        }
    });

    pagination.appendChild(nextPage);

    const allPages = document.querySelectorAll(".page-link");
    allPages.forEach((page) => {
        const pageNumber = parseInt(page.getAttribute("data-page"));
        if (pageNumber === currentPage) {
            page.parentElement.classList.add("active");
        } else {
            page.parentElement.classList.remove("active");
        }
    });
}

function openPokemonDetails(pokemonId) {
    const detailsPageURL = `pokemon_details.html?id=${pokemonId}`;
    window.location.href = detailsPageURL;
}

fetchAllPokemons();