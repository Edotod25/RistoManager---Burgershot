function addID(){
	document.getElementById("idUtente").textContent = ("ID UTENTE: " + localStorage.getItem('id'))
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
        
        // Memorizza il grado nel localStorage
        localStorage.setItem('grade', grade);
		localStorage.setItem('id', ID);
		localStorage.setItem('nome', nome);
		localStorage.setItem('cognome', cognome);

        
        updateContent(grade);
		addID();
    }
});

document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM LOADERD");
	addID()
    const grade = localStorage.getItem('grade');
    if (grade) {

        updateContent(parseInt(grade)); // Il grado potrebbe essere sconosciuto al riavvio
		//localStorage.clear();
    }
	
});

function openLogout() {
	console.log("ESCIIIIIIIIIIII")
    // Invia un messaggio al client Lua per indicare il logout
    $.post("https://LTW/LogoutUser", JSON.stringify({}));
    console.log(localStorage)
    // Rimuove l'utente dal localStorage
    localStorage.removeItem('grade'); 
    localStorage.removeItem('id');
	localStorage.removeItem('nome');
	localStorage.removeItem('cognome');
    localStorage.removeItem('data');
    localStorage.removeItem('ora');

    //console.log("Utente disconnesso e localStorage cancellato.");
    
    // Aggiorna il contenuto della pagina per riflettere il logout
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



window.addEventListener("message", function(event) {
	if (event.data.type === "ui") {
		if (event.data.status == true) {
			$("#container").show()
		} else {
			$("#container").hide();
		}
	}
});


window.onload=function(){
	const id = localStorage.getItem('id')
		if (id && id.trim() !== "") {
			$.post("https://LTW/UpdateGrado", JSON.stringify({
			id: id,
		}))
	}

	document.getElementById('nome').addEventListener('input', function (event) {
		var input = event.target;
		var value = input.value;
		input.value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
	});
	document.getElementById('cognome').addEventListener('input', function (event) {
		var input = event.target;
		var value = input.value;
		input.value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
	});

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


	window.addEventListener("message", function(event) {
		if (event.data.type === "AggiornaGrado"){
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log(event.data.grade);
			const grade = parseInt(event.data.grade);
			localStorage.setItem('grade', grade);
			updateContent(grade);
			addID();
		
		}		
		else if (event.data.type === "registrationError") {
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
		}else if (event.data.type === "loginUser"){
			loginUser();
		}else if (event.data.type === "loginWorker"){

		}else if (event.data.type === "loginAdmin"){

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

function SetNavigatore() {
	$.post('https://LTW/SetNavigatore');
}


function toggleMenuRidimensionato() {
    var menuTendina = document.getElementById("navigatRidimensionato");
    if (menuTendina.style.display === "flex") {
        menuTendina.style.display = "none";
    } else {
		menuTendina.style.display = "flex";
    }
}
