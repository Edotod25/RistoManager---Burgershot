document.addEventListener('DOMContentLoaded', function () {
  /* document.getElementById("themeButton").addEventListener("click", DarkTheme);*/

  const expand_btn = document.querySelector(".expand-btn");
  let activeIndex;
  expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
    AggiornaCoordinate();
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

purple = "rgba(95,0,250,1.0)"
purple01 = "rgba(80,0,255,0.1)"
orange = "rgba(255,128,0,1.0)"
orange01 = "rgba(255,128,0,0.1)"

window.onload=function(){
$.post("https://LTW/DashboardData");
$.post("https://LTW/AndamentoPrenotazioni");
const id = localStorage.getItem('id')
$.post("https://LTW/UpdateGrado", JSON.stringify({
        id: id,
      }))


window.addEventListener("message", function(event) {
    if (event.data.type === "AggiornaGrado"){
      //console.log(event.data.grade);
      localStorage.setItem('grade', event.data.grade);

    }
    else if (event.data.type === "dashboard") {
      var flexitem1 = document.getElementById("fi1"); // Correzione del nome
      var flexitem2 = document.getElementById("fi2");
      var flexitem3 = document.getElementById("fi3");
      var flexitem4 = document.getElementById("fi4");
      
      flexitem1.querySelector(".quantity1").textContent = event.data.NDip;
      flexitem2.querySelector(".quantity2").textContent = event.data.NOrdini;
      flexitem3.querySelector(".quantity3").textContent = event.data.NPrenot;
      flexitem4.querySelector(".quantity4").textContent = event.data.Saldo;
    } else if (event.data.type === "grafico") {
      const xValues = event.data.giorni;
      const yValues = event.data.clienti;

      new Chart("GraficoLinee", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            fill: false,
            lineTension: 0.4,
            backgroundColor: "rgba(255,128,0,1.0)",
            borderColor: "rgba(255,128,0,0.1)",
            data: yValues
          }]
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            text: "Andamento prenotazioni ultimi 7 giorni"
          }
        }
      });
    }
  });

};

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
  var scrollOrd = document.getElementById("table-container");
  scrollOrd.classList.toggle("dark")
}

function updateContent(grade) {    
  if (grade == 0) {
    /* document.getElementById("tooltip").style.display = "none";
    document.getElementById("gestioneDipendenti").style.display = "none"; */
  } else if (grade == 1) {
    //console.log("grado 1")
    document.getElementById("dashboardDefault").style.display = "none";
    document.getElementById("dashboardDipendenti").style.display = "block";
    document.getElementById("gestioneDipendenti").style.display = "none";
    
  } else if (grade == 2) {
    document.getElementById("fi4").style.display = "block";
    document.getElementById("dashboardDefault").style.display = "none";
    document.getElementById("dashboadAmministratore").style.display = "block";
    document.getElementById("gestioneDipendenti").style.display = "block";
    
    //console.log("grado 2")
  } else {
    //console.log("grado Pinguino")
  }
}

document.addEventListener('DOMContentLoaded', () => {
	//console.log("DOM CARICATO Dashboard");
    const grade = localStorage.getItem('grade');
    //console.log(grade);
    if (grade) {
        updateContent(parseInt(grade));
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




