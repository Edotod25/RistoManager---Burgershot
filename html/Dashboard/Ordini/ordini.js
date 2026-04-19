document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM CARICATO Ordini");
    const grade = localStorage.getItem('grade');
    if (grade == 2) {
        document.getElementById("gestioneDipendenti").style.display = "block";
    
        console.log("grado 2!!!!!!!!!!!!!!")
    } else {
        console.log("grado Pinguino")
    }
});


$(document).ready(function() {
    // Carica gli ordini dal server
    loadOrders();

    function loadOrders() {
        $.post('https://LTW/GetOrdiniServer'); 
    }

    window.addEventListener("message", function(event) {
        if (event.data.type === 'SendOrdiniClient') {
            const orders = event.data.data;
            const tbody = $("#ordineTable tbody");
            tbody.empty();

            function getStatusTextAndClass(accettato) {
                switch (accettato) {
                    case 0:
                        return { text: "In attesa", class: "red" };
                    case 1:
                        return { text: "In lavorazione", class: "yellow" };
                    case 2:
                        return { text: "Pronto per il ritiro", class: "green" };
                    default:
                        return { text: "Sconosciuto", class: "grey" };
                }
            }

            orders.forEach(order => {
                /* let statusClass = '';
                switch (order.status) {
                    case 'Non accettato':
                        statusClass = 'red';
                        break;
                    case 'In lavorazione':
                        statusClass = 'yellow';
                        break;
                    case 'Pronto per il ritiro':
                        statusClass = 'green';
                        break;
                } */
                
                const statusInfo = getStatusTextAndClass(order.Accettato);

                var payed = "No"
                if (order.Pagato == 1) {
                    payed = "Si"
                }

                const row = `<tr>
                    <td>${order.CodPren}</td>
                    <td>${order.Ordine}</td>
                    <td>${parseFloat(order.Totale)}</td>
                    <td>${payed}</td>
                    <td class="${statusInfo.class}">${statusInfo.text}</td>
                    <td class="td">
                        <button class="avviaLavorazione" onclick="avviaLavorazione(${order.ID})">Lavora</button>
                        <button class="prontoRitiro" onclick="prontoRitiro(${order.ID})">Pronto</button>
                       
                    </td>
                    <td> <button class="delete-button" onclick="eliminaOrdine(${order.ID})">
                    <i class="fas fa-trash-alt"></i>
                    </button></td>
                </tr>`;
                tbody.append(row);
            });
        }
    });

    
    window.avviaLavorazione = function(orderId) {
        $.post('https://LTW/AccettaOrdine', JSON.stringify({ id: orderId }), function() { // l'ordine passa allo stato 1 su DB "In Lavorazione"
       
            
            loadOrders();
            setTimeout(() => {
                window.location.reload();
            }, 50);
        });
    };

    
    window.prontoRitiro = function(orderId) {
        $.post('https://LTW/RitiraOrdine', JSON.stringify({ id: orderId }), function() { // l'ordine passa allo stato 2 su DB "Pronto per il ritiro"
        
        loadOrders();
        setTimeout(() => {
            window.location.reload();
          }, 50);
        });
    };

    
    window.eliminaOrdine = function(orderId) {
        $.post('https://LTW/EliminaOrdine', JSON.stringify({ id: orderId }), function() { // l'ordine vieen rimosso da DB
        
        loadOrders();
        setTimeout(() => {
            window.location.reload();
          }, 50);
        });
    };

    // Ordinamento tabella
    window.sortTable = function(columnIndex) {
        const table = document.getElementById("ordineTable");
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
});
