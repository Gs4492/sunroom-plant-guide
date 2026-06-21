let plants = [];

const results = document.getElementById("results");
const searchBox = document.getElementById("searchBox");
const plantDetails = document.getElementById("plantDetails");
const resultCount = document.getElementById("resultCount");

fetch("plants.json")
    .then(response => response.json())
    .then(data => {
        plants = data;

        results.innerHTML = "";
    });

searchBox.addEventListener("input", () => {

    const searchText =
        searchBox.value.toLowerCase();

    const filteredPlants = plants.filter(plant => {

        const searchableText = `
        ${plant.name || ""}
        ${plant.description || ""}
        ${plant.lighting || ""}
        ${plant.watering || ""}
        ${plant.careLevel || ""}
        ${plant.petSafe || ""}
        ${plant.beginnerFriendly || ""}
        ${plant.airPurifier || ""}
    `.toLowerCase();

        return searchableText.includes(searchText);

    });

    displayPlants(filteredPlants);
});

function displayPlants(data) {
    resultCount.textContent = `${data.length} plants found`;

    results.innerHTML = "";

    if (data.length === 0) {

        resultCount.textContent = "No plants found";

        return;
    }

    data.slice(0, 25).forEach(plant => {

        const card = document.createElement("div");

        card.className = "card clickable";

        card.innerHTML = `
    <h2>${plant.name || "Unknown Plant"}</h2>

    <p>${plant.lighting || "Lighting not available"}</p>

    <div class="badges">

        ${plant.beginnerFriendly &&
                plant.beginnerFriendly.toLowerCase().includes("yes")
                ? '<span class="badge">🟢 Beginner Friendly</span>'
                : ''
            }

        ${plant.airPurifier &&
                plant.airPurifier.toLowerCase() !== 'no'
                ? '<span class="badge">🔵 Air Purifier</span>'
                : ''
            }

        ${plant.petSafe &&
                plant.petSafe.toLowerCase().includes("yes")
                ? '<span class="badge">🐾 Pet Safe</span>'
                : '<span class="badge">⚠️ Not Pet Safe</span>'
            }

    </div>
`;

        card.addEventListener("click", () => {
            showPlantDetails(plant);
        });

        results.appendChild(card);
    });

}

function showPlantDetails(plant) {

    results.style.display = "none";
    searchBox.style.display = "none";

    plantDetails.style.display = "block";

    plantDetails.innerHTML = `
        <div class="plant-detail">

            <button id="backButton">
                ← Back to Search
            </button>

            <h2>${plant.name || "Unknown Plant"}</h2>

            <p>
                <strong>Lighting:</strong>
                ${plant.lighting || "N/A"}
            </p>

            <p>
                <strong>Watering:</strong>
                ${plant.watering || "N/A"}
            </p>

            <p>
                <strong>Pet Safe:</strong>
                ${plant.petSafe || "N/A"}
            </p>

            <p>
                <strong>Care Level:</strong>
                ${plant.careLevel || "N/A"}
            </p>

            <p>
                <strong>Beginner Friendly:</strong>
                ${plant.beginnerFriendly || "N/A"}
            </p>

            <p>
                <strong>Air Purifier:</strong>
                ${plant.airPurifier || "N/A"}
            </p>

            <p>
                <strong>Description:</strong>
            </p>

            <p>
                ${plant.description || "No description available."}
            </p>

        </div>
    `;

    document
        .getElementById("backButton")
        .addEventListener("click", () => {

            plantDetails.style.display = "none";

            results.style.display = "block";
            searchBox.style.display = "block";

            searchBox.focus();

        });
}

const filterButtons =
    document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter =
            button.dataset.filter;

        let filteredPlants = plants;

        if(filter === "petsafe"){

            filteredPlants = plants.filter(p =>
                p.petSafe &&
                p.petSafe.toLowerCase().includes("yes")
            );

        }

        if(filter === "beginner"){

            filteredPlants = plants.filter(p =>
                p.beginnerFriendly &&
                p.beginnerFriendly.toLowerCase().includes("yes")
            );

        }

        if(filter === "air"){

            filteredPlants = plants.filter(p =>
                p.airPurifier &&
                p.airPurifier.toLowerCase() !== "no"
            );

        }

        displayPlants(filteredPlants);

        searchBox.value = "";
    });

});