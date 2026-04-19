function addID(){
	document.getElementById("idUtente").textContent = ("ID UTENTE: " + localStorage.getItem('id'))
}

function fillBookingName() {
	const nome = localStorage.getItem('nome') || '';
	const cognome = localStorage.getItem('cognome') || '';
	const fullName = `${nome} ${cognome}`.trim();
	const input = document.getElementById('nomepren');

	if (input && fullName) {
		input.value = fullName;
	}
}

function updateContent(grade) {    
    if (grade === 0) {
        console.log("grado 0");
		document.getElementById("Accedi").style.display = "none";
    	document.getElementById("Profilo").style.display = "block";
		document.getElementById("Dashboard").style.display = "none";
    } else if (grade === 1) {
		document.getElementById("Accedi").style.display = "none";
    	document.getElementById("Profilo").style.display = "block";
    	document.getElementById("Dashboard").style.display = "block";
        console.log("grado 1")
    } else if (grade === 2) {
		document.getElementById("Accedi").style.display = "none";
    	document.getElementById("Profilo").style.display = "block";
    	document.getElementById("Dashboard").style.display = "block";
        console.log("grado 2")
    } else {
        console.log("grado boh")
    }
}


window.addEventListener('message', function(event) {
    if (event.data.type === "setUserGrade") {
		const grade = parseInt(event.data.grade);
		const ID = event.data.userId;
		const nome = event.data.nome || "";
		const cognome = event.data.cognome || "";
		console.log(ID)
        
        // Memorizza l'ID nel localStorage
        localStorage.setItem('grade', grade);
		localStorage.setItem('id', ID);
		localStorage.setItem('nome', nome);
		localStorage.setItem('cognome', cognome);

        // Aggiorna il contenuto in base all'ID
        updateContent(grade);
		addID();
		fillBookingName();
    }
});

// All'avvio della pagina il grado dell'utenet viene letto dal localStorage(se già presente)
document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM LOADERD");
	setMinDate();
	addID()
    const grade = localStorage.getItem('grade');
    if (grade) {

        updateContent(parseInt(grade));
		//localStorage.clear();
    }
	fillBookingName();
	    // set campi data e ora av vio pagina
		const now = new Date();
    
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		
		const timeString = `${hours}:${minutes}`;
		
		document.getElementById('timepren').value = timeString;
		document.getElementById('datapren').valueAsDate = now; 
	
});

function openLogout() {
	/* console.log("ESCIIIIIIIIIIII") */
	
    $.post("https://LTW/LogoutUser", JSON.stringify({}));
    
    // Rimozione utente dal localStorage al logout
    localStorage.removeItem('grade');
    localStorage.removeItem('id'); 
	localStorage.removeItem('nome');
	localStorage.removeItem('cognome');
    localStorage.removeItem('data');
    localStorage.removeItem('ora');
    console.log("Utente disconnesso e localStorage cancellato.");
    
    // Aggiorna il contenuto della pagina se ci si disconnette
    document.getElementById("Accedi").style.display = "block";
    document.getElementById("Profilo").style.display = "none";
    document.getElementById("MenuATendina").style.display = "none";
}


function openModalLogin() {
    document.getElementById("myModalLogin").style.display = "block";
}

function closeModalLogin() {
    document.getElementById("myModalLogin").style.display = "none";
}

function openModalRegister() {
    document.getElementById("ModalRegister").style.display = "block";
}

function closeModalRegister() {
    document.getElementById("ModalRegister").style.display = "none";
}

function openModalFgPsw() {
    document.getElementById("ModalFgPsw").style.display = "block";
}

function closeModalFgPsw() {
    document.getElementById("ModalFgPsw").style.display = "none";
} 

function loginUser() {
    document.getElementById("Accedi").style.display = "none";
    document.getElementById("Profilo").style.display = "block";
}

function toggleProfiloTendina() {
	var temp = document.getElementById("MenuATendina")
	if(temp.style.display === "block") {
		temp.style.display = "none";
	} else {
		temp.style.display = "block";
	}
}



window.onload=function(){
	
	document.getElementById('registerForm').addEventListener('submit', function(e){
		console.log("We")
		e.preventDefault();
		let Nome = $("#nome").val();
		let Cognome = $("#cognome").val();
		let Data = $("#data").val();
		let Username = $("#usernamelog").val();
		let Password = $("#passwordlog").val();
		let Domanda = $("#domanda").val();
		let Risposta = $("#risposta").val();
		console.log(Nome)

		$.post("https://LTW/RegistraUtente", JSON.stringify({
			nome: Nome,
			cognome: Cognome,
			data: Data,
			username: Username,
			password: Password,
			domanda : Domanda,
			risposta : Risposta,
		}));
	});

	document.getElementById('nome').addEventListener('input', function (event) {
		var input = event.target;
		var value = input.value;
		input.value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
	});
	document.getElementById('nomepren').addEventListener('input', function (event) {
		var input = event.target;
		var value = input.value;
		input.value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
	});
	document.getElementById('cognome').addEventListener('input', function (event) {
		var input = event.target;
		var value = input.value;
		input.value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
	});


	document.getElementById('FormPrenotazione').addEventListener('submit', function(event){
        event.preventDefault();
		/* console.log("prevvv") */
        let Nome = $("#nomepren").val();
        let Numero = $("#numeropren").val();
        let Data = $("#datapren").val();
        let Ora = $("#timepren").val();
		/* console.log("aaaa") */
        
        $.post("https://LTW/PrenotaTavolo", JSON.stringify({
            nome: Nome,
            numero: Numero,
            giorno: Data,
            ora: Ora
        }));
    });

	

	window.addEventListener("message", function(event) {
		if (event.data.type === "registrationError") {
			Swal.fire({
				icon: 'error',
				title: 'Errore',
				text: event.data.message,
				confirmButtonText: 'OK'
			});
		} else if (event.data.type === "closeRegisterWindow") {
			closeModalRegister();
		} else if (event.data.type === "invalidLogin"){
			Swal.fire({
				icon: 'error',
				title: 'Errore',
				text: event.data.message,
				confirmButtonText: 'OK'
			});
		} else if (event.data.type === "validLogin"){
			Swal.fire({
				icon: 'success',
				title: 'Successo',
				text: event.data.message,
				confirmButtonText: 'OK'
			});
		}else if (event.data.type === "closeLoginWindow") {
			closeModalLogin();
		}else if (event.data.type === "ui") {
			if (event.data.status == true) {
				$("#container").show()
			} else {
				$("#container").hide();
			}
		}else if (event.data.type === "loginUser"){
			loginUser();
		}else if (event.data.type === "loginWorker"){

		}else if (event.data.type === "loginAdmin"){

		}
		else if (event.data.type === "AggiornaGrado"){
			const grade = parseInt(event.data.grade);
			localStorage.setItem('grade', grade);
			updateContent(grade);
			addID();
			fillBookingName();
		}
	});


	document.getElementById('loginForm').addEventListener('submit', function(event){
		event.preventDefault();
		let Username = $("#username").val();
		let Password = $("#password").val();

		addID()

		$.post("https://LTW/LoginUtente", JSON.stringify({
			username: Username,
			password: Password
		}));
	});
	
	document.getElementById('FgPswForm').addEventListener('submit', function(event){
		event.preventDefault(); 
		let Username = $("#usernamepsw").val();
		let Data = $("#datapsw").val();
		let Domanda = $("#domandapsw").val();
		let Risposta = $("#rispostapsw").val();
		let Password = $("#passwordfgpsw").val();

		$.post("https://LTW/ResetPswUtente", JSON.stringify({
			username: Username,
			data: Data,
			domanda: Domanda,
			risposta: Risposta,
			password: Password
		}));
	});
}

// funzione per chiudere l'interfaccia del tablet quando si preme ESC sulla tastiuera

document.onkeyup = function (data) {
	if (data.which == 27) {
		$.post('https://LTW/exit', JSON.stringify({}));
		return
	}
};


function toggleRisposta() {
    var select = document.getElementById('domanda');
    var rispostaDiv = document.getElementById('risposta-div');

    if (select.value === "") {
        rispostaDiv.style.display = "none"; // Nasconde il campo Risposta sichè non si sceglie la domanda di sicurezza
    } else {
        rispostaDiv.style.display = "block"; // Mostra il campo Risposta
    }
}


// Funzioni per gestire data e ora maggiori di quelle attuali quando si fa una prenotazione

function getCurrentDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getCurrentTime() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
}

function setMinDate() {
	const dateInput = document.getElementById("datapren");
	dateInput.min = getCurrentDate();
}

function setMinTime() {
	const timeInput = document.getElementById("timepren");
	const dateInput = document.getElementById("datapren").value;

	if (dateInput === getCurrentDate()) {
		timeInput.min = getCurrentTime();
	} else {
		timeInput.min = "00:00";
		//per forza sennò non azzera negli altri giorni
	}
}


function toggleMenuRidimensionato() {
    var menuTendina = document.getElementById("navigatRidimensionato");
    if (menuTendina.style.display === "flex") {
        menuTendina.style.display = "none";
    } else {
		menuTendina.style.display = "flex";
    }
}
 






