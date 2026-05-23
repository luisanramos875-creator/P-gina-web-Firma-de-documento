// =====================================
// ESPERAR QUE CARGUE EL HTML
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarSistema();

    }
);

// =====================================
// VARIABLES GLOBALES
// =====================================

let canvas;

let ctx;

let dibujando = false;

let firmaSeleccionada = null;

// =====================================
// INICIAR SISTEMA
// =====================================

function iniciarSistema(){

    // OBTENER CANVAS
    canvas =
    document.getElementById("canvasFirma");

    // VALIDAR
    if(!canvas){

        console.log(
            "No existe el canvas"
        );

        return;

    }

    // CONTEXTO
    ctx =
    canvas.getContext("2d");

    // TAMAÑO
    canvas.width = 500;

    canvas.height = 200;

    // EVENTOS
    canvas.addEventListener(
        "mousedown",
        iniciarFirma
    );

    canvas.addEventListener(
        "mousemove",
        dibujarFirma
    );

    canvas.addEventListener(
        "mouseup",
        detenerFirma
    );

}

// =====================================
// MENÚ
// =====================================

function abrirOpcion(opcion){

    document.getElementById(
        "menuPrincipal"
    ).style.display = "none";

    if(opcion === "firmar"){

        document.getElementById(
            "opcionFirmar"
        ).style.display = "block";

    }else{

        document.getElementById(
            "opcionCrear"
        ).style.display = "block";

    }

}

// =====================================
// VOLVER
// =====================================

function volverMenu(){

    document.getElementById(
        "menuPrincipal"
    ).style.display = "block";

    document.getElementById(
        "opcionFirmar"
    ).style.display = "none";

    document.getElementById(
        "opcionCrear"
    ).style.display = "none";

}

// =====================================
// INICIAR FIRMA
// =====================================

function iniciarFirma(event){

    dibujando = true;

    ctx.beginPath();

    ctx.moveTo(
        event.offsetX,
        event.offsetY
    );

}

// =====================================
// DIBUJAR
// =====================================

function dibujarFirma(event){

    if(!dibujando) return;

    ctx.lineWidth = 2;

    ctx.lineCap = "round";

    ctx.lineTo(
        event.offsetX,
        event.offsetY
    );

    ctx.stroke();

}

// =====================================
// DETENER
// =====================================

function detenerFirma(){

    dibujando = false;

}

// =====================================
// LIMPIAR
// =====================================

function limpiarCanvas(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

// =====================================
// GUARDAR FIRMA
// =====================================

function guardarFirma(){

    let nombre =
    document.getElementById(
        "nombreUsuario"
    ).value;

    let mensaje =
    document.getElementById(
        "mensaje"
    );

    if(nombre === ""){

        mensaje.innerHTML =
        "Ingrese un nombre";

        mensaje.style.color =
        "red";

        return;

    }

    // IMAGEN
    let imagen =
    canvas.toDataURL("image/png");

    // FIRMAS
    let firmas =
    JSON.parse(
        localStorage.getItem(
            "firmasUsuarios"
        )
    ) || [];

    // GUARDAR
    firmas.push({

        nombre: nombre,

        imagen: imagen

    });

    localStorage.setItem(

        "firmasUsuarios",

        JSON.stringify(firmas)

    );

    mensaje.innerHTML =
    "Firma guardada correctamente";

    mensaje.style.color =
    "green";

    limpiarCanvas();

    document.getElementById(
        "nombreUsuario"
    ).value = "";

}

// =====================================
// BUSCAR FIRMAS
// =====================================

function buscarFirmas(){

    let texto =
    document.getElementById(
        "buscarFirma"
    ).value.toLowerCase();

    let resultado =
    document.getElementById(
        "resultadoBusqueda"
    );

    resultado.innerHTML = "";

    let firmas =
    JSON.parse(
        localStorage.getItem(
            "firmasUsuarios"
        )
    ) || [];

    firmas.forEach(function(firma){

        if(
            firma.nombre
            .toLowerCase()
            .includes(texto)
        ){

            resultado.innerHTML += `

                <div
                    class="firmaUsuario"
                    onclick='seleccionarFirma(${JSON.stringify(firma)})'
                >

                    <h3>${firma.nombre}</h3>

                    <img src="${firma.imagen}">

                </div>

            `;

        }

    });

}

// =====================================
// SELECCIONAR FIRMA
// =====================================

function seleccionarFirma(firma){

    firmaSeleccionada = firma;

    let mensaje =
    document.getElementById(
        "mensajep1"
    );

    mensaje.innerHTML =
    "Firma seleccionada: " +
    firma.nombre;

    mensaje.style.color =
    "green";

}

// =====================================
// FIRMAR PDF INTELIGENTE
// =====================================

async function firmarDocumento(){

    const archivo =
    document.getElementById(
        "archivoPDF"
    ).files[0];

    const mensaje =
    document.getElementById(
        "mensajep1"
    );

    // VALIDAR PDF
    if(!archivo){

        mensaje.innerHTML =
        "Seleccione un PDF";

        mensaje.style.color =
        "red";

        return;

    }

    // VALIDAR FIRMA
    if(!firmaSeleccionada){

        mensaje.innerHTML =
        "Seleccione una firma";

        mensaje.style.color =
        "red";

        return;

    }

    try{

        // =====================================
        // LEER PDF
        // =====================================

        const bytesPDF =
        await archivo.arrayBuffer();

        // PDF-LIB
        const pdfDoc =
        await PDFLib.PDFDocument
        .load(bytesPDF);

        // PDF.JS
        const loadingTask =
        pdfjsLib.getDocument({

            data: bytesPDF

        });

        const pdfJS =
        await loadingTask.promise;

        // PRIMERA PÁGINA
        const paginaJS =
        await pdfJS.getPage(1);

        // TEXTO
        const contenido =
        await paginaJS
        .getTextContent();

        // =====================================
        // POSICIÓN POR DEFECTO
        // =====================================

        let posicionX = 100;

        let posicionY = 100;

        // =====================================
        // PALABRAS CLAVE
        // =====================================

        const palabrasClave = [

            "firma",
            "firmar",
            "cliente",
            "responsable",

        ];

        // =====================================
        // BUSCAR TEXTO
        // =====================================

        contenido.items.forEach(item => {

            let texto =
            item.str.toLowerCase();

            palabrasClave.forEach(palabra => {

                if(
                    texto.includes(palabra)
                ){

                    posicionX =
                    item.transform[4];

                    posicionY =
                    item.transform[5] - 80;

                }

            });

        });

        // =====================================
        // INSERTAR FIRMA
        // =====================================

        const pagina =
        pdfDoc.getPages()[0];

        const firmaIMG =
        await pdfDoc.embedPng(
            firmaSeleccionada.imagen
        );

        pagina.drawImage(firmaIMG, {

            x: posicionX,

            y: posicionY,

            width: 180,

            height: 70

        });

        // =====================================
        // GUARDAR PDF
        // =====================================

        const pdfBytes =
        await pdfDoc.save();

        // =====================================
        // DESCARGAR
        // =====================================

        const blob =
        new Blob([pdfBytes], {

            type: "application/pdf"

        });

        const link =
        document.createElement("a");

        link.href =
        URL.createObjectURL(blob);

        link.download =
        "documento_firmado.pdf";

        link.click();

        mensaje.innerHTML =
        "Documento firmado correctamente";

        mensaje.style.color =
        "green";

    }catch(error){

        console.log(error);

        mensaje.innerHTML =
        "Error al firmar PDF";

        mensaje.style.color =
        "red";

    }

}