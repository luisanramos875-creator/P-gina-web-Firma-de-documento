// MOSTRAR DOCUMENTO
document.getElementById("formDocumento")
.addEventListener("submit", function(event){

    event.preventDefault();

    let archivo =
    document.getElementById("archivo").files[0];

    if(archivo){

        // URL TEMPORAL
        let urlArchivo =
        URL.createObjectURL(archivo);

        // MOSTRAR PDF
        document.getElementById("visorPDF").src =
        urlArchivo;

        // MOSTRAR SECCIÓN
        document.getElementById("documentoVista")
        .style.disp
        lay = "block";

    }

});
async function firmarPDF(){

    // OBTENER PDF
    const archivo =
    document.getElementById("archivo").files[0];

    // OBTENER NOMBRE
    const nombreFirma =
    document.getElementById("firma").value;

    if(!archivo){

        alert("Debe seleccionar un PDF");
        return;

    }

    if(nombreFirma === ""){

        alert("Debe escribir su nombre");
        return;

    }

    // LEER PDF
    const bytesPDF = await archivo.arrayBuffer();

    // CARGAR PDF
    const pdfDoc =
    await PDFLib.PDFDocument.load(bytesPDF);

    // OBTENER PRIMERA PÁGINA
    const paginas = pdfDoc.getPages();

    const primeraPagina = paginas[0];

    // TAMAÑO DE LA PÁGINA
    const { width, height } =
    primeraPagina.getSize();

    // AGREGAR FIRMA
    primeraPagina.drawText(nombreFirma,{

        x: width - 220,
        y: 50,

        size: 24,

    });

    // GUARDAR PDF
    const pdfFirmado =
    await pdfDoc.save();

    // CREAR ARCHIVO DESCARGABLE
    const blob =
    new Blob([pdfFirmado],{
        type: "application/pdf"
    });

    // CREAR LINK
    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "documento_firmado.pdf";

    // DESCARGAR
    link.click();

}