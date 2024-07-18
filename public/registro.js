const form = document.getElementById('formulario-registro-envio');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const datos = {
        user: formData.get('user'),
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('username')
    };

    if (!datos.user || !datos.email || !datos.password || !datos.username) {
        document.getElementById('mensajeError').innerText = 'Todos los campos deben estar llenos';
        return;
    }

    try {
        const response = await fetch('/validar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            // Redirigir o realizar alguna acción adicional
            form.reset();
            window.location.href = 'inicio.html';
        } else {
            document.getElementById('mensajeError').innerText = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mensajeError').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
    }
});
