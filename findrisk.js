console.log("FindRisk wurde geladen.");

let currentPage = 0;

// Alle Seiten finden
const pages = document.querySelectorAll(".page");

// Alle Weiter-Buttons finden
const nextButtons = document.querySelectorAll(".next");


// Bestimmte Seite anzeigen
function showPage(index)
{
    for(let i = 0; i < pages.length; i++)
    {
        pages[i].classList.remove("active");
    }

    pages[index].classList.add("active");
}


// Geschlecht finden
const geschlRadios = document.querySelectorAll("input[name='geschl']");

for(let i = 0; i < geschlRadios.length; i++)
{
    geschlRadios[i].addEventListener("change", function()
    {
        var geschl = this.value;

        var container = document.getElementById("waist-options");
		
		// Andere Geschlechtsauswahl ausblenden
        for(let j = 0; j < geschlRadios.length; j++)
        {
            if(geschlRadios[j] != this)
            {
                geschlRadios[j].parentElement.style.display = "none";
            }
        }

        if(geschl == "weiblich")
        {
			container.style.marginTop = "1px";
			
            container.innerHTML = `
                <label>
                    <input type="radio" name="q3" value="0"> Unter 80 cm
                </label>

                <label>
                    <input type="radio" name="q3" value="3"> 80 bis 88 cm
                </label>

                <label>
                    <input type="radio" name="q3" value="4"> Über 88 cm
                </label>
            `;
        }

        if(geschl == "männlich")
        {
			container.style.marginTop = "18px";
			
            container.innerHTML = `
                <label>
                    <input type="radio" name="q3" value="0"> Unter 94 cm
                </label>

                <label>
                    <input type="radio" name="q3" value="3"> 94 bis 102 cm
                </label>

                <label>
                    <input type="radio" name="q3" value="4"> Über 102 cm
                </label>
            `;
        }
    });
}


// Seite überprüfen
function validatePage(pageIndex)
{
    const page = pages[pageIndex];

    const radios = page.querySelectorAll("input[type='radio']");

    const errorBox = page.querySelector(".error");

    errorBox.style.display = "none";

    // Taillenumfang überprüfen
    if(pageIndex == 3)
    {
        const geschlecht = page.querySelector("input[name='geschl']:checked");

        const taille = page.querySelector("input[name='q3']:checked");

        if(geschlecht == null || taille == null)
        {
            errorBox.style.display = "block";
            return false;
        }

        return true;
    }

    if(radios.length == 0)
    {
        return true;
    }

    for(var r of radios)
    {
        if(r.checked)
        {
            return true;
        }
    }

    errorBox.style.display = "block";

    return false;
}


// Weiter-Buttons
for(let i = 0; i < nextButtons.length; i++)
{
    nextButtons[i].addEventListener("click", function()
    {
        // ID überprüfen
        if(currentPage == 0)
        {
            const userIdInput = document.getElementById("userId");

            var userId = userIdInput.value.trim();

            const errorBox = pages[0].querySelector(".error");

            if(userId == "")
            {
                errorBox.style.display = "block";
                return;
            }
            else
            {
                errorBox.style.display = "none";
            }
        }

        // Antworten überprüfen
        let ok = validatePage(currentPage);

        if(!ok)
        {
            return;
        }

        // Zur nächsten Seite
        if(currentPage < pages.length - 1)
        {
            currentPage++;

            showPage(currentPage);
        }

        // Punkte aktualisieren
        berechneSumme();
    });
}


// Punkte berechnen
function berechneSumme()
{
    var summe = 0;

    // Alle 8 Fragen durchgehen
    for(let i = 1; i <= 8; i++)
    {
        var antwort = document.querySelector(
            "input[name='q" + i + "']:checked"
        );

        if(antwort != null)
        {
            summe = summe + parseInt(antwort.value);
        }
    }

    // Gesamtpunktzahl anzeigen
    document.getElementById("score").innerHTML = summe;

    return summe;
}


// Bei jeder ausgewählten Antwort neu berechnen
document.addEventListener("change", function(event)
{
    if(event.target.type == "radio")
    {
        berechneSumme();
    }
});


// Risikogruppe bestimmen
function berechneRisiko(punkte)
{
    if(punkte < 7)
    {
        return "Niedriges Risiko";
    }
    else if(punkte <= 11)
    {
        return "Leicht erhöhtes Risiko";
    }
    else if(punkte <= 14)
    {
        return "Mittleres Risiko";
    }
    else if(punkte <= 20)
    {
        return "Hohes Risiko";
    }
    else
    {
        return "Sehr hohes Risiko";
    }
}


// Ergebnis anzeigen
function zeigeErgebnis()
{
    var punkte = berechneSumme();

    var risiko = berechneRisiko(punkte);

    document.getElementById("riskGroup").innerHTML = risiko;
}


// Ergebnis beim Öffnen der Ergebnisseite anzeigen
function showPage(index)
{
    for(let i = 0; i < pages.length; i++)
    {
        pages[i].classList.remove("active");
    }

    pages[index].classList.add("active");

    if(index == pages.length - 1)
    {
        zeigeErgebnis();
    }
}


// CSV-Datei herunterladen
document.getElementById("downloadCsv").addEventListener("click", function()
{
    // ID auslesen
    var userId = document.getElementById("userId").value.trim();

    // CSV-Datei vorbereiten
    var csv = "Feld;Antwort;Punkte\n";

    // User-ID speichern
    csv += "UserID;" + userId + ";\n";

    // Geschlecht speichern
    var geschlecht = document.querySelector("input[name='geschl']:checked");

    if(geschlecht != null)
    {
        csv += "Geschlecht;" + geschlecht.value + ";\n";
    }

    // Antworten der 8 Fragen speichern
    for(let i = 1; i <= 8; i++)
    {
        var antwort = document.querySelector(
            "input[name='q" + i + "']:checked"
        );

        if(antwort != null)
        {
            var antwortText = antwort.parentElement.textContent.trim();

            csv += "Frage " + i + ";" + antwortText + ";" + antwort.value + "\n";
        }
    }

    // Gesamtpunktzahl speichern
    var gesamtpunkte = berechneSumme();

    csv += "Gesamtpunktzahl;;" + gesamtpunkte + "\n";

    // Risikogruppe speichern
    csv += "Risikogruppe;" + berechneRisiko(gesamtpunkte) + ";\n";

    // CSV-Datei erstellen
    var blob = new Blob(["\uFEFF" + csv],
    {type: "text/csv;charset=utf-8;"});

    var url = URL.createObjectURL(blob);

    // Download starten
    var link = document.createElement("a");

    link.href = url;
    link.download = "findrisk_" + userId + ".csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
});
