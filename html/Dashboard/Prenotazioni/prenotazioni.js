function DarkTheme() {
  
    let element = document.getElementById("container");
    element.classList.toggle("dark"); 
    const prova = document.querySelectorAll(".flexitem");
    prova.forEach((elem) => {
      elem.classList.toggle("dark")
    });
    var barra = document.getElementById("Barra");
    barra.classList.toggle("dark")
    var lista = document.getElementById("lista");
    lista.classList.toggle("dark")
    var mappa = document.getElementById("mappa");
    mappa.classList.toggle("dark");
    var modal1 = document.getElementById("contenuto-modale1");
    modal1.classList.toggle("dark");
    var modal2 = document.getElementById("contenuto-modale2");
    modal2.classList.toggle("dark");
        var cleanupModal = document.getElementById("cleanupModalContent");
        if (cleanupModal) {
            cleanupModal.classList.toggle("dark");
        }
  }


function AggiornaCoordinate() {
    var img = document.getElementById('mappaImg');

    var scaleX = img.width / Gazella;
    var scaleY = img.height / Zebra;

    const aree = document.querySelectorAll('.area');

    aree.forEach(area => {
        const originalLeft = parseInt(area.getAttribute('data-original-left'));
        const originalTop = parseInt(area.getAttribute('data-original-top'));
        const originalWidth = parseInt(area.getAttribute('data-original-width'));
        const originalHeight = parseInt(area.getAttribute('data-original-height'));

        area.style.left = `${Math.round(originalLeft * scaleX)}px`;
        area.style.top = `${Math.round(originalTop * scaleY)}px`;
        area.style.width = `${Math.round(originalWidth * scaleX)}px`;
        area.style.height = `${Math.round(originalHeight * scaleY)}px`;
    });
}

function syncCleanupButtonVisibility() {
    const button = document.getElementById('cleanOldReservationsBtn');
    if (!button) {
        return;
    }

    const grade = parseInt(localStorage.getItem('grade') || '0', 10);
    button.style.display = grade === 2 ? 'block' : 'none';
}

function syncCleanupModalTheme() {
    const modalContent = document.getElementById('cleanupModalContent');
    if (!modalContent) {
        return;
    }

    const isDark = document.getElementById('container')?.classList.contains('dark');
    modalContent.classList.toggle('dark', Boolean(isDark));
}

function openCleanupModal() {
    syncCleanupModalTheme();
    document.getElementById('cleanupModal').style.display = 'block';
}

function closeCleanupModal() {
    document.getElementById('cleanupModal').style.display = 'none';
}

function confermaPuliziaPrenotazioniVecchie() {
    $.post('https://LTW/PulisciPrenotazioniVecchie', JSON.stringify({}));
    closeCleanupModal();
    setTimeout(() => {
        caricaPrenotazioni();
        aggiornaMappa();
    }, 350);
}

window.addEventListener('message', function(event) {
    if (event.data.type === 'setUserGrade' || event.data.type === 'AggiornaGrado') {
        syncCleanupButtonVisibility();
    }
});

window.onload = function() {
    const aree = document.querySelectorAll('.area');
    aree.forEach(area => {
        area.setAttribute('data-original-left', area.style.left);
        area.setAttribute('data-original-top', area.style.top);
        area.setAttribute('data-original-width', area.style.width);
        area.setAttribute('data-original-height', area.style.height);

        area.addEventListener('click', function() {
            var giorno = document.getElementById("date-input").value;
            var ora = document.getElementById("time").value;
            // Azione da eseguire quando si fa clic su un'area
            //console.log(`Hai cliccato sull'area: ${this.id}`);
            if (area.classList.contains("rosso")) {
                $.post('https://LTW/GetinfoTavolo', JSON.stringify({ Tavolo: this.id, Ora : ora, Data : giorno }));

                window.addEventListener("message", function(event) {
                    if (event.data.type === 'InfoTavolo') {
                        const InfoTavolo = event.data;

                        openModalTable1(InfoTavolo.Nome, InfoTavolo.Numero, InfoTavolo.Data, InfoTavolo.Tavolo, InfoTavolo.Ora);
                    }
                });
            } else {
                $.post('https://LTW/GetTavoloVuoto', JSON.stringify({
                    Tavolo: this.id,
                    Ora: ora,
                    Data: giorno
                }));

                window.addEventListener("message", function(event) {
                    if (event.data.type === 'TavoloVuoto') {
                        const TavoloVuoto = event.data;
                        openModalTable2(TavoloVuoto.Numero, TavoloVuoto.Tavolo);
                    }
                })
                
                //console.log("aaa");
            }
        });
    });

    Gazella = document.getElementById('mappaImg').naturalWidth;
    Zebra = document.getElementById('mappaImg').naturalHeight;

    AggiornaCoordinate();

    var storedDate = localStorage.getItem('data');
    if (storedDate == "") {
        var giorno = document.getElementById("date-input").value;
        localStorage.setItem('data', giorno);
        storedDate = giorno
    }
    var dateObject = new Date(storedDate);

    var storedTime = localStorage.getItem('ora');
    if (storedTime == "") {
        var ora = document.getElementById("time").value;
        localStorage.setItem('ora', ora);
        storedTime = ora;
    } else {
        var timeParts = storedTime.split(':');
        var hours = parseInt(timeParts[0], 10);
        var minutes = parseInt(timeParts[1], 10);
        var timeString = `${hours}:${minutes}`;
    }

    document.getElementById('time').value = timeString;
    document.getElementById('date-input').valueAsDate = dateObject;
};

window.onresize = function() {
    AggiornaCoordinate();
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM CARICATO Ordini");
    const grade = localStorage.getItem('grade');
    if (grade == 2) {
        document.getElementById("gestioneDipendenti").style.display = "block";
    } else {
        console.log("grado Impossibile")
    }
    syncCleanupButtonVisibility();

});

$(document).ready(function() {
    caricaPrenotazioni();
    aggiornaMappa();

    window.sortTable = function(columnIndex) {
        const table = document.getElementById("tabellaPrenotazioni");
        let switching = true;
        let shouldSwitch;
        let direction = "asc";
        let switchcount = 0;

        while (switching) {
            switching = false;
            let rows = table.rows;

            for (var i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                let x = rows[i].getElementsByTagName("TD")[columnIndex];
                let y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

                if (direction == "asc" && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                } else if (direction == "desc" && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && direction === "asc") {
                    direction = "desc";
                    switching = true;
                }
            }
        }
    };
})

function caricaPrenotazioni() {
    var giorno = document.getElementById("date-input").value
    //console.log(giorno)
    function loadReservations() {
        $.post('https://LTW/GetPrenotazioniServer', JSON.stringify({ valore: giorno })); 
    }

    loadReservations();

    window.addEventListener("message", function(event) {
        if (event.data.type === 'SendPrenotazioniClient') {
            const prenot = event.data.data;
            const tbody = $("#tabellaPrenotazioni tbody");
            tbody.empty();

            prenot.forEach(prenotato => {
                const row = `<tr>
                    <td>${prenotato.Nome}</td>
                    <td>${prenotato.Tavolo}</td>
                    <td>${prenotato.Numero}</td>
                    <td>${prenotato.Ora}</td>
                    <td class="td">
                        <button class="rimuoviTavoloBtn" onclick="rimuoviTavolo('${prenotato.Nome}', ${prenotato.Tavolo}, ${prenotato.Numero}, '${prenotato.Ora}', '${prenotato.Data}')">Rimuovi</button>
                    </td>
                </tr>`;
                tbody.append(row)
            });
        }
    });
}

window.rimuoviTavolo = function(Nome, Tavolo, Numero, Ora, Data) {
    //console.log("dfgdtythftyhjyf")
    $.post('https://LTW/RimuoviTavoloPrenotato', JSON.stringify({ 
        Nome: Nome,
        Tavolo: Tavolo,
        Numero: Numero,
        Ora: Ora,
        Data: Data, 

    }), function() { 
        
        aggiornaMappa();
        caricaPrenotazioni();
        setTimeout(() => {
            window.location.reload();
        }, 5);
    });
};



function aggiornaMappa() {
    var giorno = document.getElementById("date-input").value;
    var ora = document.getElementById("time").value;

    /* console.log(giorno);
    console.log(ora); */
    localStorage.setItem('data', giorno);
    localStorage.setItem('ora', ora);
    
    $.post('https://LTW/AggiornaMappa', JSON.stringify({ giorno: giorno, ora: ora }));

    
    window.addEventListener("message", function(event) {
        if (event.data.type === 'AggiornaMappaDalClient') {
            const colora = event.data.data;

            // ogni volta tutti i tavoli vengono prima impostati su verde
            const aree = document.querySelectorAll('.area');
            aree.forEach(area => {
                area.classList.remove('rosso');
            });

            // Colora di rosso i tavoli prenotati in base agli ID ricevuti che corrispondono al numero di tavoli sul server
            colora.forEach(tavolo => {
                const tavoloElement = document.getElementById(tavolo.Tavolo);
                if (tavoloElement) {
                    tavoloElement.classList.add('rosso');
                }
            });
        }
    });
}



// Finestre Modali Tavoli


function openModalTable1(Nome, Numero, Data, Tavolo, Ora) {
    document.getElementById("ModaleTavoli1").style.display = "block";

    var modalContent = document.querySelector("#ModaleTavoli1 .contenuto-modale");

    modalContent.innerHTML = `
        <span class="close" onclick="closeModalTable1()">&times;</span>
        <p style="color: red; margin-bottom: 8px;"><strong>Tavolo n° ${Tavolo}</strong></p>
        <p style="margin-bottom: 8px; margin-top: 20px"><strong>Nome Prenotazione:</strong> ${Nome}</p>
        <p style="margin-bottom: 8px;"><strong>Numero di Persone:</strong> ${Numero}</p>
        <p style="margin-bottom: 8px;"><strong>Data:</strong> ${Data}</p>
        <p style="margin-bottom: 8px;"><strong>Ora Prenotazione:</strong> ${Ora}</p>
        <div style="text-align: center; margin-top: 20px;">
            <button class="bottoneRimuovi" style="background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 24px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
                transition-duration: 0.4s;" onclick="rimuoviTavolo('${Nome}', ${Tavolo}, ${Numero}, '${Ora}', '${Data}')">Libera Tavolo</button>
        </div>
    `;
}


function closeModalTable1() {
    document.getElementById("ModaleTavoli1").style.display = "none";
}

function openModalTable2(Numero, Tavolo) {
    document.getElementById("ModaleTavoli2").style.display = "block";

    var giorno = document.getElementById("date-input").value;
    var ora = document.getElementById("time").value;

    var modalContent = document.querySelector("#ModaleTavoli2 .contenuto-modale")
    /* console.log(Numero)
    console.log(Tavolo) */

    modalContent.innerHTML = `
    <span class="close" onclick="closeModalTable2()">&times;</span>
    <p><span style="color: green; font-weight: bold; margin-bottom: 18px;"><strong>Tavolo n° ${Tavolo}</strong></span></p>
        <p style="margin-bottom: 8px; margin-top: 28px;"><strong>Numero di posti:</strong> ${Numero}</p>
        <p style="margin-bottom: 15px;">
        <label class="modal-field-label" for="nomePrenotazione"><strong>Nome Prenotazione:</strong></label>
        <input type="text" id="nomePrenotazione" required>
        </p>
        <p style="margin-bottom: 8px;">
            <label class="modal-field-label" for="numeroPersone"><strong>Numero di Persone:</strong></label>
            <input type="number" id="numeroPersone" placeholder="Numero massimo: ${Numero}" required>
        </p>
        <div style="text-align: center;">
            <button style="background-color: #4CAF50; /* Green */
                            border: none;
                            color: white;
                            padding: 10px 24px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin-top: 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            transition-duration: 0.4s;" onclick="confermaPrenotazione(${Tavolo}, '${ora}', '${giorno}')">Conferma</button>
            <button style="background-color: #f44336; /* Red */
                            border: none;
                            color: white;
                            padding: 10px 24px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin-top: 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            transition-duration: 0.4s;" onclick="closeModalTable2()" >Annulla</button>
        </div>
    `;
}


function closeModalTable2() {
    document.getElementById("ModaleTavoli2").style.display = "none";
}

function confermaPrenotazione(Tavolo, Ora, Data) {
    var nomePrenotazione = document.getElementById("nomePrenotazione").value;
    var numeroPersone = document.getElementById("numeroPersone").value;

    if (nomePrenotazione.trim() === '' || numeroPersone.trim() === '') { // Blocca se i campi non sono stati compilati
        console.log("Si prega di compilare tutti i campi.");
        return;
    }

    $.post('https://LTW/ConfermaPrenotazione', JSON.stringify({ 
        Nome: nomePrenotazione,
        Tavolo: Tavolo,
        Numero: parseInt(numeroPersone),
        Ora: Ora,
        Data: Data,
    }));
    
    closeModalTable2();
    aggiornaMappa();
    caricaPrenotazioni();
    setTimeout(() => {
        window.location.reload();
    }, 105);
}

document.onkeyup = function (data) {
	if (data.which == 27) {
		$.post('https://LTW/exit', JSON.stringify({}));
		return
	}
};