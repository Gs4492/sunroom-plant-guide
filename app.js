let plants = [];
let richBotanicalData = {};

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtf1y4xiBrei1tXdKHGKpOTqhIftSHyDY8GBwrp7A323DvREP7a8-ADJwwTwv6-BmCLm_iSPyBpUMD/pub?output=csv";
const BACKUP_JSON_URL = "plants1.json";

const results = document.getElementById("results");
const searchBox = document.getElementById("searchBox");
const plantDetails = document.getElementById("plantDetails");
const resultCount = document.getElementById("resultCount");

// --- LOAD & MERGE DATA ---

async function loadData() {
    try {
        // Step 1: Load the rich botanical JSON (our encyclopedia)
        const jsonRes = await fetch(BACKUP_JSON_URL);
        const richList = await jsonRes.json();

        // Build a fast lookup by plant name
        richList.forEach(p => {
            richBotanicalData[p.name.toLowerCase().trim()] = p;
        });

        // Step 2: Try to load live inventory from Google Sheet
        const sheetRes = await fetch(SHEET_CSV_URL);
        if (!sheetRes.ok) throw new Error("Sheet unavailable");

        const csvText = await sheetRes.text();
        const liveInventory = parseCSV(csvText);

        // Step 3: Merge — live sheet data + rich JSON details
        plants = liveInventory
            .filter(p => 
                p.name && 
                p.name.trim() && 
                p.name !== "Plant Name" && 
                p.description && 
                p.description.toLowerCase() !== "nan" // Hides non-plant decor products
            )
            .map(item => {
                const rich = richBotanicalData[item.name.toLowerCase().trim()] || {};
                return {
                    ...item,
                    matureSize: rich.matureSize || "Varies by variety",
                    careNotes: rich.careNotes || "",
                    petSafetyDetail: rich.petSafetyDetail || ""
                };
            });

        console.log("Live sheet + JSON merged successfully.");

    } catch (err) {
        // Fallback: just use the JSON directly
        console.warn("Google Sheet unavailable. Using backup JSON.", err);
        const fallback = await fetch(BACKUP_JSON_URL);
        plants = await fallback.json();
    }

    displayPlants(plants);
}

// --- CSV PARSER ---

function parseCSV(csv) {
    const parsed = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
    });

    return parsed.data.map(row => ({
        name: row["Plant Name"] || "",
        description: row["Marketing Description"] || "",
        lighting: row["Lighting"] || "",
        watering: row["Watering"] || "",
        beginnerFriendly: row["Beginner Friendly"] || "",
        careLevel: row["Care Level"] || "",
        airPurifier: row["Air Purifier"] || "",
        petSafe: row["Pet Safe"] || ""
    }));
}


// --- SEARCH ---

searchBox.addEventListener("input", () => {
    const searchText = searchBox.value.toLowerCase();

    const filteredPlants = plants.filter(plant => {
        const searchableText = `
            ${plant.name || ""}
            ${plant.description || ""}
            ${plant.careNotes || ""}
            ${plant.matureSize || ""}
            ${plant.petSafetyDetail || ""}
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

// --- DISPLAY CARDS ---

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
                    : plant.petSafe
                    ? '<span class="badge">⚠️ Not Pet Safe</span>'
                    : '<span class="badge">❓ Pet Safety Unknown</span>'}

            </div>
        `;

        card.addEventListener("click", () => {
            showPlantDetails(plant);
        });

        results.appendChild(card);
    });
}

// --- PLANT DETAIL VIEW ---

function showPlantDetails(plant) {
    results.style.display = "none";
    searchBox.style.display = "none";
    document.querySelector(".filter-bar").style.display = "none";
    resultCount.style.display = "none";

    const searchNote = document.querySelector(".search-note");
    if (searchNote) searchNote.style.display = "none";

    plantDetails.style.display = "block";

    plantDetails.innerHTML = `
        <div class="plant-detail">
            <button id="backButton">← Back to Search</button>

            <h2>${plant.name || "Unknown Plant"}</h2>

            <div class="detail-subtitle">Complete Plant Profile</div>

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
                    <strong>📏 Mature Size</strong>
                    <span>${plant.matureSize || "N/A"}</span>
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

            ${plant.careNotes ? `
            <h3>Care Notes</h3>
            <div class="content-box">${plant.careNotes}</div>
            ` : ''}

            ${plant.petSafetyDetail ? `
            <h3>Pet Safety Details</h3>
            <div class="content-box">${plant.petSafetyDetail}</div>
            ` : ''}
        </div>
    `;

    document.getElementById("backButton").addEventListener("click", () => {
        plantDetails.style.display = "none";
        results.style.display = "block";
        searchBox.style.display = "block";
        document.querySelector(".filter-bar").style.display = "flex";
        resultCount.style.display = "block";
        if (searchNote) searchNote.style.display = "block";
        searchBox.focus();
    });
}

// --- FILTERS ---

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        let filteredPlants = plants;

        if (filter === "petsafe") {
            filteredPlants = plants.filter(p =>
                p.petSafe && p.petSafe.toLowerCase().includes("yes")
            );
        }
        if (filter === "beginner") {
            filteredPlants = plants.filter(p =>
                p.beginnerFriendly && p.beginnerFriendly.toLowerCase().includes("yes")
            );
        }
        if (filter === "air") {
            filteredPlants = plants.filter(p =>
                p.airPurifier && p.airPurifier.toLowerCase() !== "no"
            );
        }
        if (filter === "all") {
            filteredPlants = plants;
        }

        displayPlants(filteredPlants);
        searchBox.value = "";
    });
});

// --- START ---
loadData();
