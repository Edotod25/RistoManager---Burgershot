$(document).ready(function() {
    $(".add").click(function() {
        var flexitem = $(this).closest('.flexitem');
        var itemName = flexitem.find('.Oggetto').text(); // Ottieni il nome dell'oggetto dalla classe
        var priceElement = flexitem.find('.Prezzo');
        var price = parseFloat(priceElement.text());
        var prezzo = 0;
        prezzo = (prezzo + price).toFixed(2);
        priceElement.text(price);
        var quantityElement = flexitem.find(".quantity");
        var quantity = parseInt(quantityElement.text());
        quantity++;
        quantityElement.text(quantity);
        console.log(quantity);
        updateRiepilogo(itemName, quantity, prezzo);
    });

    $(".sub").click(function() {
        var flexitem = $(this).closest('.flexitem');
        var itemName = flexitem.find('.Oggetto').text(); // Ottieni il nome dell'oggetto dalla classe
        var priceElement = flexitem.find('.Prezzo');
        var price = parseFloat(priceElement.text());
        priceElement.text(price);
        var quantityElement = flexitem.find(".quantity");
        var quantity = parseInt(quantityElement.text());
        if (quantity > 0) {
            quantity--;
            quantityElement.text(quantity);
            var prezzo = 0;
            prezzo = (prezzo + price).toFixed(2);
            
            //console.log(quantity);
            updateRiepilogo(itemName, quantity, prezzo);
        }
    });
});

function updateRiepilogo(itemName, quantity, price) {
    // Rimuovere il prezzo dall'itemName da mettere nella lista del riepilogo
    var itemNameWithoutPrice = itemName.split("$")[0].trim();

    var riepilogoList = $("#riepilogoLista");
    var listItem = riepilogoList.find("li[data-item='" + itemNameWithoutPrice + "']");

    if (quantity === 0) {
        listItem.remove();
    } else {
        var newItem = "<li data-item='" + itemNameWithoutPrice + "'>" + quantity + " x " + itemNameWithoutPrice + " $" + price + "</li>";

        if (listItem.length === 0) {
            riepilogoList.append(newItem);
        } else {
            var newPrice = (quantity * price).toFixed(2);
            newItem = "<li data-item='" + itemNameWithoutPrice + "'>" + quantity + " x " + itemNameWithoutPrice + " $" + newPrice + "</li>";
            listItem.replaceWith(newItem);
        }
    }
    
    var total = calculateTotal();
    $("#ChkoutBtn").text("Totale: $" + total);
}


function calculateTotal() {
    var total = 0;
    $("#riepilogoLista li").each(function() {
        // Estrai il prezzo dal testo della lista
        var listItemText = $(this).text();
        var match = listItemText.match(/\$(\d+\.\d+)/); // Estrai il prezzo dalla stringa
        if (match) {
            var itemPrice = parseFloat(match[1]);
            total += itemPrice;
        }
    });
    return total.toFixed(2);
}

function totalButton() {
    var total = calculateTotal();

    var riepilogoList = $("#riepilogoLista li").map(function() {
        return $(this).text(); // Ottieni il testo dell'elemento <li>
    }).get(); // Converto la lista degli elementi in un array di stringhe

    // Unisci tutte le voci della lista in una singola stringa, separata da virgole o newline
    var lista = riepilogoList.join(";\n");

    Swal.fire({
        title: "Totale",
        text: "Il totale dell'ordine è $" + total,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Annulla",
        reverseButtons: true 
    }).then((result) => {
        //console.log("Totale" + total);
        if (total > 0) {
            if (result.isConfirmed) {
                codiceprenotazione = (Math.random() + 1).toString(36).substring(7).toUpperCase();
                console.log("Confermato" + lista + total);
                // Azioni da eseguire quando si clicca "OK"
                total = parseFloat(total)
                Swal.fire({
                    title: "Pagamento",
                    text: "Scegli un metodo di pagamento",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Paga ora", 
                    cancelButtonText: "Paga al ritiro", 
                    reverseButtons: true 
                }).then((result) => {
                    if (result.isConfirmed) { // L'utente ha cliccato "Paga ora"
                        console.log("Pagamento immediato selezionato.");
                        Swal.fire({
                            title: "Ordine effettuato",
                            html: `Il codice di ritiro è <b>${codiceprenotazione}</b>`,
                            icon: "success",
                            confirmButtonText: "OK",
                        });

                        $.post("https://LTW/Ordina", JSON.stringify({
                            lista : lista,
                            totale : total,
                            codiceprenotazione : codiceprenotazione,
                            pagato : 1,
                        }));

                    } else if (result.isDismissed) { // L'utente ha cliccato "Paga al ritiro"
                        console.log("Pagamento al ritiro selezionato.");
                        Swal.fire({
                            title: "Ordine effettuato",
                            html: `Il codice di ritiro è <b>${codiceprenotazione}</b>`,
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        $.post("https://LTW/Ordina", JSON.stringify({
                            lista : lista,
                            totale : total,
                            codiceprenotazione : codiceprenotazione,
                            pagato : 0,
                        }));
                    }
                });
        } else{
            console.log("totale: 0");
        }
            

        } else if (result.isDismissed) {
            console.log("Annullato");
           
        }
    });
    console.log("ok")
}
/* 
function success(){
    Swal.fire({
        title: "Ordine effettuato",
        html: `Il codice di ritiro è <b>${codiceprenotazione}</b>`,
        icon: "info",
        confirmButtonText: "OK",
    });
}

 */