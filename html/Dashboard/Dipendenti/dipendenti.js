document.addEventListener('DOMContentLoaded', function () {
  /* document.getElementById("themeButton").addEventListener("click", DarkTheme);*/

  const expand_btn = document.querySelector(".expand-btn");
  let activeIndex;
  expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
  });
  
  const current = window.location.href;
  
  const allLinks = document.querySelectorAll(".sidebar-links a");
  
  allLinks.forEach((elem) => {
    elem.addEventListener("click", function () {
      const hrefLinkClick = elem.href;
  
      allLinks.forEach((link) => {
        if (link.href == hrefLinkClick) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  });



  const checkbox = document.querySelector('input[type="checkbox"]');

  checkbox.addEventListener('change', function() {
    SetDark()
  });
});
  
  
document.addEventListener('DOMContentLoaded', () => {
  const DarkMode = localStorage.getItem('dark-mode')
  if(DarkMode == 1) {
    DarkTheme()
    SetSoleLuna()
  }
});
  
  
window.onload=function(){
    $.post("https://LTW/GetDipendenti");
    const id = localStorage.getItem('id')
    $.post("https://LTW/UpdateGrado", JSON.stringify({
        id: id,
    }))
  
}

window.addEventListener('message', function(event) {
  if (event.data.type === "AggiornaGrado"){
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(event.data.grade);
    localStorage.setItem('grade', event.data.grade);

  }
});
  
  function SetDark() {
  if(localStorage.getItem('dark-mode') == 0) {
    localStorage.setItem('dark-mode', 1);
  } else {
    localStorage.setItem('dark-mode', 0);
  }
  DarkTheme();
}

function SetSoleLuna() {
  var element = document.getElementById("darkmode-toggle");
  element.checked = true;
}

function DarkTheme() {
  let element = document.getElementById("container");
  element.classList.toggle("dark"); 
  const prova = document.querySelectorAll(".flexitem");
  prova.forEach((elem) => {
    elem.classList.toggle("dark")
  });
  var barra = document.getElementById("Barra");
  barra.classList.toggle("dark")
  let element2 = document.getElementById("employeeList");
  element2.classList.toggle("dark");
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM LOADERD");
    const grade = localStorage.getItem('grade');
    if (grade) {

        updateContent(parseInt(grade));
    }
    
});

window.addEventListener('message', function(event) {
  if (event.data.type === "updateUserGrade") {
    const grade = event.data.grade;
        
    localStorage.setItem('grade', grade);
  }
});

window.addEventListener("message", function(event) {
  if (event.data.type === "ui") {
    if (event.data.status == true) {
      $("#container").show()
    } else {
      $("#container").hide();
    }
  }
});
  
  
function filterEmployees() {
  const input = document.getElementById("searchBar");
  const filter = input.value.toLowerCase();
  const employeeList = document.getElementById("employeeList");
  const employees = employeeList.getElementsByClassName("flexitem");

  for (let i = 0; i < employees.length; i++) {
      const name = employees[i].getAttribute("data-name").toLowerCase();
      if (name.indexOf(filter) > -1) {
          employees[i].style.display = "flex"; // Mostra se corrisponde
      } else {
          employees[i].style.display = "none"; // Nascondi se non corrisponde
      }
  }
}
  
function unpromoteEmployee(nome, userId) {
    Swal.fire({
      title: "Gestione Dipendente",
      html: `Vuoi davvero Retrocedere <b>${nome}</b> ? `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Annulla",
  }).then((result) => {
    if (result.isConfirmed) {
      const id = localStorage.getItem('id')
      $.post("https://LTW/RetrocediDipendente", JSON.stringify({
        userId: userId,
        id: id,
      }))
      .done(() => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    }
});
  //TODO DECREMENTARE DI 1 IL GRADO DEL GIOCATORE CON QUELL'ID (GRADO - 1) fatto
}
  
function promoteEmployee(nome, userId) {
    Swal.fire({
      title: "Gestione Dipendente",
      html: `Vuoi davvero Promuovere <b>${nome}</b> ? `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Annulla",
  }).then((result) => {
    if (result.isConfirmed) {
      const id = localStorage.getItem('id')
      $.post("https://LTW/PromuoviDipendente", JSON.stringify({
        userId: userId,
        id: id,
      }))
      .done(() => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    }
});
    //TODO INCREMENTARE DI 1 IL GRADO DEL GIOCATORE CON QUELL'ID (GRADO + 1) fatto
   
}
  
function fireEmployee(nome, userId) {
    console.log("Licenzia:", nome);
    Swal.fire({
      title: "Gestione Dipendente",
      html: `Vuoi davvero Licenziare <b>${nome}</b> ? `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Annulla",
    }).then((result) => {
      if (result.isConfirmed) {
        const id = localStorage.getItem('id')
        $.post("https://LTW/LicenziaDipendente", JSON.stringify({
          userId: userId,
          id: id,
        }))
        .done(() => {
          setTimeout(() => {           //Ricarica la pagina ed aggiorna in tempo reale la lista dipendenti senza che dobbiamo aggiornarla noi quando licenzi un dipendente (dopo che premi ok)
            window.location.reload();
          }, 100);
        });
      }
  });

  //TODO RIMUOVERE GRADO DEL GIOCATORE CON QUELL'ID (IMPOSTARE GRADO = 0) fatto 
}

function addEmployee() {
  Swal.fire({
      title: "Assumi Dipendente",
      html:`
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label for="employee-id" style="width: 30%;">ID:</label>
            <input type="number" id="employee-id" class="swal2-input" placeholder="Inserisci ID" style="flex-grow: 1;">
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label for="employee-user-id" style="width: 30%;">ID Utente:</label>
            <input type="number" id="employee-user-id" class="swal2-input" placeholder="Inserisci ID Utente" style="flex-grow: 1;">
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label for="employee-grade" style="width: 30%;">Grado:</label>
            <input type="number" id="employee-grade" class="swal2-input" placeholder="Inserisci Grado" style="flex-grow: 1;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Assumi",
      cancelButtonText: "Annulla",
      preConfirm: () => {
          const employeeId = document.getElementById("employee-id").value;
          const employeeUserId = document.getElementById("employee-user-id").value;
          const employeeGrade = document.getElementById("employee-grade").value;

          if (!employeeId || !employeeUserId || !employeeGrade) {
              Swal.showValidationMessage("Per favore, compila tutti i campi.");
              return false;
          }

          return { 
              id: employeeId,
              userId: employeeUserId,
              grade: employeeGrade,
          };
      }
  }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value;
        console.log("Dipendente assunto:", data);

          //TODO DOMANI: invia dati al client e al server e salva su DB
        $.post("https://LTW/AssumiDip", JSON.stringify({
          id: parseInt(data.id),
          userId: parseInt(data.userId),
          grado : parseInt(data.grade),
        }))
        .done(() => {
          setTimeout(() => {          //Ricarica la pagina ed aggiorna in tempo reale la lista dipendenti senza che dobbiamo aggiornarla noi quando assumi un nuovo dopendente
            window.location.reload();
          }, 100);
        });

      } else if (result.isDismissed) {
          console.log("Assunzione annullata");
      }
  });
}
  
  window.addEventListener("message", function(event) {
    if (event.data.type === "GetDip") {
        const employeeList = event.data.employees;
        const listElement = document.getElementById("employeeList");
        listElement.innerHTML = '';

        // Crea gli elementi per ogni dipendente
        employeeList.forEach((employee) => {
            const employeeItem = document.createElement("div");
            employeeItem.className = "flexitem employee-item";
            employeeItem.setAttribute("data-name", `${employee.Nome} ${employee.Cognome}`);
            employeeItem.setAttribute("data-user-id", employee.ID);
            employeeItem.innerHTML = `
                <img src="../../img/profilo.jpg" alt="Foto Profilo" class="profile-pic">
                <div class="employee-info">
                    <h3>${employee.Nome} ${employee.Cognome}</h3>
                    <p>Grado: ${employee.Grado}</p>
                    <p>ID: ${employee.ID}</p>
                </div>
                <div class="employee-actions">
                    <button class="promote-btn" onclick="promoteEmployee('${employee.Nome} ${employee.Cognome}', ${employee.ID})">Promuovi</button>
                    <button class="unpromote-btn" onclick="unpromoteEmployee('${employee.Nome} ${employee.Cognome}', ${employee.ID})">Retrocedi</button>
                    <button class="fire-btn" onclick="fireEmployee('${employee.Nome} ${employee.Cognome}', ${employee.ID})">Licenzia</button>
                </div>
            `;
            listElement.appendChild(employeeItem);
            const DarkMode = localStorage.getItem('dark-mode')
            if(DarkMode == 1) { 
              const prova = document.querySelectorAll(".flexitem");
              prova.forEach((elem) => {
                elem.classList.add("dark")                                      //quando viene aggiunto un dipendente nuovo il flexbox non viene settato come gli altri in automatico
              });                                                               //in base al colore dello sfondo ed è quindi importante farlo manulamente ogni qualvolta la lista
            }else{                                                              //viene aggiornata con l'aggiunta di un nuovo impiegato
              const prova = document.querySelectorAll(".flexitem");
              prova.forEach((elem) => {
                elem.classList.remove("dark")
              });
            }
        });
    }
});
  
  
  
  