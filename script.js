// MOSTRAR LOGIN
function mostrarLogin(){

    document.getElementById("login").style.display = "block";
    document.getElementById("registro").style.display = "none";

}

// MOSTRAR REGISTRO
function mostrarRegistro(){

    document.getElementById("login").style.display = "none";
    document.getElementById("registro").style.display = "block";

}

// MOSTRAR / OCULTAR CONTRASEÑA
function togglePassword(idInput, icono){

    const input = document.getElementById(idInput);

    if(input.type === "password"){

        input.type = "text";
        icono.textContent = "🙈";

    }else{

        input.type = "password";
        icono.textContent = "👁";

    }

}

// CREAR USUARIO
const registroForm = document.getElementById("registroForm");

registroForm.addEventListener("submit", function(event){

    event.preventDefault();

    let usuario = document.getElementById("nuevoUsuario").value;

    let password = document.getElementById("nuevoPassword").value;

    // GUARDAR DATOS
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("password", password);

    let mensaje = document.getElementById("mensajeRegistro");

    mensaje.innerHTML = "Cuenta creada correctamente";
    mensaje.style.color = "green";

    registroForm.reset();

});

// INICIAR SESIÓN
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    let usuario = document.getElementById("usuarioLogin").value;

    let password = document.getElementById("passwordLogin").value;

    let usuarioGuardado = localStorage.getItem("usuario");

    let passwordGuardada = localStorage.getItem("password");

    let mensaje = document.getElementById("mensajeLogin");

    if(usuario === usuarioGuardado && password === passwordGuardada){

        mensaje.innerHTML = "Inicio de sesión correcto";
        mensaje.style.color = "green";

        setTimeout(() => {

            // CAMBIAR POR TU PÁGINA
            window.location.href = "DocFirma.html";

        }, 1000);

    }else{

        mensaje.innerHTML = "Usuario o contraseña incorrectos";
        mensaje.style.color = "red";

    }

});