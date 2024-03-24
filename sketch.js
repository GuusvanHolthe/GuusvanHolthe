let data;
let scene = 0; // Definieer de variabele scene en stel deze in op 0
let clickedFeature = -1; // Definieer de variabele clickedFeature en stel deze in op -1

function preload() {
    data = loadJSON("https://raw.githubusercontent.com/mia-mmt2-2324/earthquakes/main/4.5_day.geojson");
}

function setup() {
    console.log(data); // Controleren of de data correct is ingeladen. Data functioneert.
    createCanvas(1000, 2000);
}

function draw() {
    if (scene === 0) {
        background(250, 133, 63);

        text("titel=" + data.metadata.title, 700, 20);

        /// Volgorde van aardbevingmagnitudes op basis van sterkte.
        data.features.sort((a, b) => a.properties.mag - b.properties.mag);

        for (let i = 0; i < data.features.length; i++) {
            stroke(0);
            fill(205, 133, 63);
            rect(0, i * 100, width, 100);
            fill(0);
            text("magnitude=" + data.features[i].properties.title, 105, 60 + i * 100);

            let magnitude = data.features[i].properties.mag;

            
            fill(getColor(magnitude)); 
            noStroke(); 

            /// X- en Y-positie informatie sterren
            let xPos = 30; 
            let yPos = 50 + i * 100; 

            /// Grootte sterren vergrootfactor (*2).
            let starSize = map(magnitude, 0, 10, 2, 20) * 2; 

            /// Stergrootte binnenkant.
            beginShape();
            for (let j = 0; j < 360; j += 72) {
                let x = xPos + cos(radians(j)) * starSize;
                let y = yPos + sin(radians(j)) * starSize;
                vertex(x, y);
                x = xPos + cos(radians(j + 36)) * (starSize / 2); 
                y = yPos + sin(radians(j + 36)) * (starSize / 2);
                vertex(x, y);
            }
            endShape(CLOSE);
        }
        textSize(25);
        text(data.metadata.title + data.metadata.api, 100, 25);
        textSize(15);
        text("url=" + data.metadata.url, 100, 1350);

    } else if (scene === 1) {
    background(205, 133, 63);
    
    /// Vertoonde informatie van desbetreffende aardbeving in scène 1!!
    text("id= " + data.features[clickedFeature].id, 20, 20);
    text("type= " + data.features[clickedFeature].type, 20, 40);
    text('mag= ' + data.features[clickedFeature].properties.mag, 20, 60);
    text('place= ' + data.features[clickedFeature].properties.place, 20, 80);

    /// Datuminformatie. Note  to self: maak het menselijker. Check Gitbook API.
    let timeMilliseconds = data.features[clickedFeature].properties.time;
    let date = new Date(timeMilliseconds);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dayOfWeek = date.getDay();
    let daysOfWeek = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    let monthsOfYear = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    text('time= ' + daysOfWeek[dayOfWeek] + ' ' + day + ' ' + monthsOfYear[month - 1] + ' ' + year, 20, 100);
    text("coordinates= " + data.features[clickedFeature].geometry.coordinates, 20, 120);

    let magnitude = data.features[clickedFeature].properties.mag;

    
    fill(getColor(magnitude)); 
    noStroke(); 

    /// X- en Y-positie van het midden van de sterren
    let xPos = 30;  
    let yPos = 170; 

    /// Vergrotingsfactor (*2) van de sterren
    let starSize = map(magnitude, 0, 10, 2, 20) * 2; 

    /// Vergroting van de sterren op basis van magnitude en hun respectievelijke kleur
    if (getColor(magnitude) === color(255, 0, 0)) { /// Rood
        starSize *= 1.5;
    } else if (getColor(magnitude) === color(128, 0, 128)) { /// Paars
        starSize *= 2;
    }

    /// Stergrootte hoeken binnenkant
    beginShape();
    for (let j = 0; j < 360; j += 72) {
        let x = xPos + cos(radians(j)) * starSize;
        let y = yPos + sin(radians(j)) * starSize;
        vertex(x, y);
        x = xPos + cos(radians(j + 36)) * (starSize / 2); 
        y = yPos + sin(radians(j + 36)) * (starSize / 2);
        vertex(x, y);
    }
    endShape(CLOSE);
    
    /// Rechthoek scène 1. Hier zit de pijl in
    fill(255); ///Wit
    rect(30, 250, 100, 40);

    /// Pijl scène 1. In rechthoek
    fill(0); /// Zwart
    triangle(40, 270, 60, 260, 60, 280);
}
}

/// Muis interactie informatie en terugklikoptie
function mouseClicked() {
    if (scene === 0) {
        for (let i = 0; i < data.features.length; i++) {
            if (mouseX > 0 && mouseX < width && mouseY > i * 100 && mouseY < i * 100 + 100) {
                scene = 1;
                clickedFeature = i;
            }
        }
        scene = 1;
    } else if (scene === 1 && mouseX > 30 && mouseX < 130 && mouseY > 250 && mouseY < 290) {
        scene = 0;
        clickedFeature = -1;
    }
}

/// Kleuren per magnitudecategori3: "lichtste", "gemiddelde" en "zwaarste" aardebevingen weergegeven met de volgende kleuren:
function getColor(magnitude) {
    if (magnitude >= 4.5 && magnitude <= 4.8) {
        return color(255, 165, 0); /// Oranje voor alle magnitudes tussen 4.5 en 4.8
    } else if (magnitude >= 4.9 && magnitude <= 5.1) {
        return color(255, 0, 0); ///Rood voor alle magnitudes tussen 4.9 en 5.1
    } else if (magnitude >= 5.3 && magnitude <= 5.4) {
        return color(128, 0, 128); /// Paars voor alle magnitudes tussen 5.3 en 5.4 (de sterkste)
    } 
}
