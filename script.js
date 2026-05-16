const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;
    let mensaje = document.getElementById("mensaje");

    // Usuario y contraseña

    let usuarioCorrecto="Luis";
    let passwordCorrecta="1234";

    if(usuario === usuarioCorrecto && password === passwordCorrecta){

        mensaje.innerHTML = "Inicio de sesión correcto";
        mensaje.style.color = "green";

        // Ir a la otra página
        setTimeout(() => {

            window.location.href = "DocFirma.html";

        }, 1000);

    }else{

        mensaje.innerHTML = "Usuario o contraseña incorrectos";
        mensaje.style.color = "red";

    }

});

