// Seleccionar TODOS los botones con esa clase
const buttons = document.querySelectorAll('.contact-quote-btn');

// Agregar el evento a cada uno
buttons.forEach(button => {
    button.addEventListener('click', function() {
        window.location.href = 'sms:3054097671?body=Hi, I need a quote';
    });
});