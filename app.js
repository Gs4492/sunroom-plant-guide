let plants = [];

const results = document.getElementById("results");
const searchBox = document.getElementById("searchBox");
const plantDetails = document.getElementById("plantDetails");
const resultCount = document.getElementById("resultCount");

fetch("plants_enhanced_template.json")
    .then(response => response.json())
    .then(data => {

        plants = data;

        displayPlants(plants);

    });

searchBox.addEventListener("input", () => {

    const searchText =
        searchBox.value.toLowerCase();

    const filteredPlants = plants.filter(plant => {

        const searchableText = `
            ${plant.name || ""}
            ${plant.description || ""}
            ${plant.enhancedDescription || ""}
            ${plant.careNotes || ""}
            ${plant.growthHabit || ""}
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
                    : ''}

                ${plant.airPurifier &&
                    plant.airPurifier.toLowerCase() !== 'no'
                    ? '<span class="badge">🔵 Air Purifier</span>'
                    : ''}

                ${plant.petSafe &&
                    plant.petSafe.toLowerCase().includes("yes")
                    ? '<span class="badge">🐾 Pet Safe</span>'
                    : '<span class="badge">⚠️ Not Pet Safe</span>'}

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

    document.querySelector(".filter-bar").style.display = "none";
    resultCount.style.display = "none";

    const searchNote =
        document.querySelector(".search-note");

    if(searchNote){
        searchNote.style.display = "none";
    }

    plantDetails.style.display = "block";

    plantDetails.innerHTML = `

        <div class="plant-detail">

            <button id="backButton">
                ← Back to Search
            </button>

            <h2>${plant.name || "Unknown Plant"}</h2>

            <div class="detail-subtitle">
                Complete Plant Profile
            </div>

            <h3>Quick Care Snapshot</h3>

            <div class="care-grid">

                <div class="care-card">
                    <strong>☀️ Lighting</strong>
                    <span>${plant.lighting || "N/A"}</span>
                </div>

                <div class="care-card">
                    <strong>💧 Watering</strong>
                    <span>${plant.watering || "N/A"}</span>
                </div>

                <div class="care-card">
                    <strong>🌱 Care Level</strong>
                    <span>${plant.careLevel || "N/A"}</span>
                </div>

                <div class="care-card">
                    <strong>🐾 Pet Safe</strong>
                    <span>${plant.petSafe || "N/A"}</span>
                </div>

                <div class="care-card">
                    <strong>⭐ Beginner Friendly</strong>
                    <span>${plant.beginnerFriendly || "N/A"}</span>
                </div>

                <div class="care-card">
                    <strong>🍃 Air Purifier</strong>
                    <span>${plant.airPurifier || "N/A"}</span>
                </div>

            </div>

            <h3>Description</h3>

            <div class="description-box">
                ${plant.description || "No description available."}
            </div>

            ${plant.enhancedDescription ?
            `
            <h3>Plant Profile</h3>

            <div class="content-box">
                ${plant.enhancedDescription}
            </div>
            `
            : ''}

            ${plant.careNotes ?
            `
            <h3>Care Notes</h3>

            <div class="content-box">
                ${plant.careNotes}
            </div>
            `
            : ''}

            ${plant.growthHabit ?
            `
            <h3>Growth Habit</h3>

            <div class="content-box">
                ${plant.growthHabit}
            </div>
            `
            : ''}

            ${plant.commonUses && plant.commonUses.length ?
            `
            <h3>Best Uses</h3>

            <ul class="detail-list">
                ${plant.commonUses.map(item =>
                    `<li>${item}</li>`).join("")}
            </ul>
            `
            : ''}

            ${plant.commonProblems && plant.commonProblems.length ?
            `
            <h3>Common Problems</h3>

            <ul class="detail-list">
                ${plant.commonProblems.map(item =>
                    `<li>${item}</li>`).join("")}
            </ul>
            `
            : ''}

            ${plant.stylingTips ?
            `
            <h3>Styling Tips</h3>

            <div class="content-box">
                ${plant.stylingTips}
            </div>
            `
            : ''}

            ${plant.funFact ?
            `
            <h3>Fun Fact</h3>

            <div class="content-box">
                ${plant.funFact}
            </div>
            `
            : ''}

        </div>

    `;

    document
        .getElementById("backButton")
        .addEventListener("click", () => {

            plantDetails.style.display = "none";

            results.style.display = "block";
            searchBox.style.display = "block";

            document.querySelector(".filter-bar").style.display = "flex";
            resultCount.style.display = "block";

            if(searchNote){
                searchNote.style.display = "block";
            }

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

        if (filter === "petsafe") {

            filteredPlants = plants.filter(p =>
                p.petSafe &&
                p.petSafe.toLowerCase().includes("yes")
            );

        }

        if (filter === "beginner") {

            filteredPlants = plants.filter(p =>
                p.beginnerFriendly &&
                p.beginnerFriendly.toLowerCase().includes("yes")
            );

        }

        if (filter === "air") {

            filteredPlants = plants.filter(p =>
                p.airPurifier &&
                p.airPurifier.toLowerCase() !== "no"
            );

        }

        if (filter === "all") {

            filteredPlants = plants;

        }

        displayPlants(filteredPlants);

        searchBox.value = "";

    });

});