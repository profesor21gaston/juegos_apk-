let num1, num2, respuestaCorrecta;
let progresoGuardado = [];

function inicializarApp() {
    const datosLocal = localStorage.getItem('progresoMatematico');
    if (datosLocal) {
        progresoGuardado = JSON.parse(datosLocal);
    }
    crearMatriz();
    reiniciarLogica();
}

function toggleReglas() {
    const modal = document.getElementById("modalReglas");
    modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
}

function crearMatriz() {
    const matriz = document.getElementById("matrizProgreso");
    matriz.innerHTML = "";
    matriz.appendChild(crearCelda("", "header"));
    for(let i=1; i<=10; i++) matriz.appendChild(crearCelda(i, "header"));

    for(let f=2; f<=9; f++) {
        matriz.appendChild(crearCelda(f, "header"));
        for(let c=1; c<=10; c++) {
            const id = `c-${f}-${c}`;
            const celda = crearCelda(f * c, "cell");
            celda.id = id;
            if (progresoGuardado.includes(id)) {
                celda.classList.add("unlocked");
            }
            matriz.appendChild(celda);
        }
    }
}

function crearCelda(texto, clase) {
    const div = document.createElement("div");
    div.className = clase;
    div.innerText = texto;
    return div;
}

function reiniciarLogica() {
    const modo = document.getElementById("modo").value;
    document.getElementById("tabla").style.display = (modo === "aleatorio") ? "none" : "block";
    generarEjercicio();
}

function generarEjercicio() {
    const modo = document.getElementById("modo").value;
    let pendientes = [];

    // Buscar combinaciones que NO estén en progresoGuardado
    if (modo === "aleatorio") {
        for (let f = 2; f <= 9; f++) {
            for (let c = 1; c <= 10; c++) {
                if (!progresoGuardado.includes(`c-${f}-${c}`)) {
                    pendientes.push({n1: f, n2: c});
                }
            }
        }
    } else {
        let f = parseInt(document.getElementById("tabla").value);
        for (let c = 1; c <= 10; c++) {
            if (!progresoGuardado.includes(`c-${f}-${c}`)) {
                pendientes.push({n1: f, n2: c});
            }
        }
    }

    // Si no hay más pendientes
    if (pendientes.length === 0) {
        document.getElementById("pregunta").innerText = "¡FIN!";
        document.getElementById("status-display").innerText = "MAPA COMPLETADO AL 100%";
        document.getElementById("status-display").className = "reaction-correct";
        return;
    }

    // Elegir una de las pendientes al azar (o la primera si es modo orden)
    let elegido = (modo === "aleatorio") 
        ? pendientes[Math.floor(Math.random() * pendientes.length)]
        : pendientes[0];

    num1 = elegido.n1;
    num2 = elegido.n2;
    respuestaCorrecta = num1 * num2;

    document.getElementById("pregunta").innerText = `${num1} × ${num2}`;
    const rInput = document.getElementById("inputRespuesta");
    rInput.value = "";
    rInput.focus();
}

function verificarRespuesta() {
    const rInput = document.getElementById("inputRespuesta");
    const status = document.getElementById("status-display");
    const val = parseInt(rInput.value);

    if (val === respuestaCorrecta) {
        status.innerText = "¡SINCRONIZADO!";
        status.className = "reaction-correct";
        
        const celdaId = `c-${num1}-${num2}`;
        const celda = document.getElementById(celdaId);
        if(celda) {
            celda.classList.add("unlocked");
            if (!progresoGuardado.includes(celdaId)) {
                progresoGuardado.push(celdaId);
                localStorage.setItem('progresoMatematico', JSON.stringify(progresoGuardado));
            }
        }
        setTimeout(generarEjercicio, 800);
    } else {
        status.innerText = "ERROR DETECTADO";
        status.className = "reaction-error";
        rInput.value = "";
        rInput.focus();
    }
}

function pistaCambiarPregunta() {
    const status = document.getElementById("status-display");
    status.innerText = "REGENERANDO CÓDIGO...";
    status.className = "reaction-info";
    setTimeout(generarEjercicio, 500);
}

function pistaConsultarCompanero() {
    alert("SISTEMA: Gira y pregunta a un compañero cómo resolver " + num1 + " x " + num2);
}

function pistaCambiarRoles() {
    alert("SISTEMA: ¡Relevo! Pasale el dispositivo a un compañero para esta operación.");
}

function limpiarTodo() {
    if(confirm("¿Seguro que quieres borrar todo tu progreso guardado?")) {
        localStorage.removeItem('progresoMatematico');
        progresoGuardado = [];
        crearMatriz();
        reiniciarLogica();
        document.getElementById("status-display").innerText = "MEMORIA BORRADA";
    }
}