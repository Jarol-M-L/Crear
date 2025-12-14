   const nombreRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telefonoRegex = /^[0-9]{7,12}$/;
    const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    const registroForm = document.getElementById('registroForm');
    const loginForm = document.getElementById('loginForm');
    const recuperarForm = document.getElementById('recuperarForm');

    let intentosFallidos = 0;
    let cuentaBloqueada = false;

    registroForm.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const contrasena = document.getElementById('contrasena').value;

      document.getElementById('errorNombre').textContent = nombreRegex.test(nombre) ? '' : 'Nombre inválido.';
      document.getElementById('errorCorreo').textContent = correoRegex.test(correo) ? '' : 'Correo inválido.';
      document.getElementById('errorTelefono').textContent = telefonoRegex.test(telefono) ? '' : 'Teléfono inválido.';
      document.getElementById('errorContrasena').textContent = contrasenaRegex.test(contrasena) ? '' : 'Contraseña insegura.';

      if (
        nombreRegex.test(nombre) &&
        correoRegex.test(correo) &&
        telefonoRegex.test(telefono) &&
        contrasenaRegex.test(contrasena)
      ) {
        localStorage.setItem('usuario', JSON.stringify({ nombre, correo, telefono, contrasena }));
        registroForm.hidden = true;
        loginForm.hidden = false;
      }
    });

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const correo = document.getElementById('loginCorreo').value.trim();
      const contrasena = document.getElementById('loginContrasena').value;
      const loginError = document.getElementById('loginError');
      const recuperarLink = document.getElementById('recuperarLink');

      const usuario = JSON.parse(localStorage.getItem('usuario'));

      if (cuentaBloqueada) {
        loginError.textContent = 'Cuenta bloqueada por intentos fallidos.';
        recuperarLink.hidden = false;
        return;
      }

      if (usuario && correo === usuario.correo && contrasena === usuario.contrasena) {
        loginError.textContent = `Bienvenido al sistema, ${usuario.nombre}`;
        intentosFallidos = 0;
      } else {
        intentosFallidos++;
        if (intentosFallidos >= 3) {
          cuentaBloqueada = true;
          loginError.textContent = 'Cuenta bloqueada por intentos fallidos.';
          recuperarLink.hidden = false;
        } else {
          loginError.textContent = 'Usuario o contraseña incorrectos.';
        }
      }
    });

    document.getElementById('mostrarPass').addEventListener('change', function () {
      const input = document.getElementById('loginContrasena');
      input.type = this.checked ? 'text' : 'password';
    });

    document.getElementById('mostrarRegistroPass').addEventListener('change', function () {
      const input = document.getElementById('contrasena');
      input.type = this.checked ? 'text' : 'password';
    });

    document.getElementById('recuperarLink').addEventListener('click', e => {
      e.preventDefault();
      loginForm.hidden = true;
      recuperarForm.hidden = false;
    });

    recuperarForm.addEventListener('submit', e => {
      e.preventDefault();
      const nueva = document.getElementById('nuevaContrasena').value;
      const errorNueva = document.getElementById('errorNuevaContrasena');
      const mensaje = document.getElementById('recuperarMensaje');

      if (!contrasenaRegex.test(nueva)) {
        errorNueva.textContent = 'Contraseña insegura.';
        return;
      }

      let usuario = JSON.parse(localStorage.getItem('usuario'));
      usuario.contrasena = nueva;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      cuentaBloqueada = false;
      intentosFallidos = 0;
      errorNueva.textContent = '';
      mensaje.textContent = 'Contraseña actualizada. Ahora puede iniciar sesión.';

      setTimeout(() => {
        recuperarForm.hidden = true;
        loginForm.hidden = false;
        mensaje.textContent = '';
      }, 2000);
    });