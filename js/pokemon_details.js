const baseURL = 'https://pokeapi.co/api/v2/pokemon';



function getPokemonIdFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    return parseInt(id, 10);
}

function fetchPokemonDetails(pokemonId) {
    const pokemonNameElement = document.getElementById('pokemonName');
    const pokemonImagesElement = document.getElementById('pokemonImages');
    const pokemonTypeElement = document.getElementById('pokemonType');
    const pokemonHeightElement = document.getElementById('pokemonHeight');
    const pokemonWeightElement = document.getElementById('pokemonWeight');
    const pokemonBaseExperienceElement = document.getElementById('pokemonBaseExperience');
    
    

    fetch(`${baseURL}/${pokemonId}`)
        .then((response) => response.json())
        .then((data) => {
            pokemonNameElement.textContent = data.name;
            const pokemonName = data.name;
            document.title = `Pokemon: ${pokemonName}`;
            const frontImage = data.sprites.front_default;
            const backImage = data.sprites.back_default;
            const frontShinyImage = data.sprites.front_shiny;
            const backShinyImage = data.sprites.back_shiny;
            pokemonHeightElement.textContent = data.height;
            pokemonWeightElement.textContent = data.weight;
            pokemonBaseExperienceElement.textContent = data.base_experience;

            pokemonImagesElement.innerHTML = `


                <div class="tab">
                    <button class="tablinks" onclick="openImage(event, 'front')">Front</button>
                    <button class="tablinks" onclick="openImage(event, 'back')">Back</button>
                    <button class="tablinks" onclick="openImage(event, 'front_shiny')">Front Shiny</button>
                    <button class="tablinks" onclick="openImage(event, 'back_shiny')">Back Shiny</button>
                </div>
                

                <div id="front" class="tabcontent" style="display:flex;">
                <h3>Front</h3>
                <img class="pokemon-image" src="${frontImage}" alt="${data.name}">
                </div>
                
                <div id="back" class="tabcontent">
                <h3>Back</h3>
                <img class="pokemon-image" src="${backImage}" alt="${data.name}">
                </div>
                
                <div id="front_shiny" class="tabcontent">
                <h3>Front Shiny</h3>
                <img class="pokemon-image" src="${frontShinyImage}" alt="${data.name}">
                </div>
                
                <div id="back_shiny" class="tabcontent">
                <h3>Back Shiny</h3>
                <img class="pokemon-image" src="${backShinyImage}" alt="${data.name}">
                </div>
            
            `;

            pokemonTypeElement.innerHTML = `
            ${data.types.map(type => {
                const typeClass = type.type.name.toLowerCase();
                return `<span class="type ${typeClass}">${type.type.name}</span>`;                
            }).join(" ")}</p>

            `
        })
        .catch((error) => {
            console.error('Error cargando detalles:', error);
        });
}

const pokemonId = getPokemonIdFromURL();
if (pokemonId) {
    fetchPokemonDetails(pokemonId);
}

function openImage(evt, imageName) {
    var i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(imageName).style.display = "flex";
    evt.currentTarget.className += " active";
  }




