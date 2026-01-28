// ========================================
// EmailJS Form Handler
// ========================================

// CONFIGURACIÓN - Reemplaza estos valores con tus credenciales de EmailJS
const EMAILJS_CONFIG = {
    serviceID: 'service_d160lpk',      // Reemplazar con tu Service ID
    templateID: 'template_oz389s7',    // Reemplazar con tu Template ID
    publicKey: 'OW-Rh7vIA8MGeTHW9'       // Reemplazar con tu Public Key
};

// Inicializar EmailJS cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS con tu Public Key
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Obtener el formulario
    const form = document.querySelector('form');
    
    // Agregar evento de submit al formulario
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Maneja el envío del formulario
 * @param {Event} event - Evento del formulario
 */
function handleFormSubmit(event) {
    // Prevenir el comportamiento por defecto del formulario
    event.preventDefault();
    
    // Obtener el botón de submit
    const submitButton = event.target.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;
    
    // Deshabilitar el botón mientras se envía
    submitButton.disabled = true;
    submitButton.textContent = 'ENVIANDO...';
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    
    // Obtener los valores del formulario
    const formData = getFormData(event.target);
    
    // Validar que los campos obligatorios estén completos
    if (!validateForm(formData)) {
        resetButton(submitButton, originalButtonText);
        showMessage('Por favor, completa todos los campos requeridos.', 'error');
        return;
    }
    
    // Enviar el email usando EmailJS
    emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        formData
    )
    .then(function(response) {
        console.log('Email enviado exitosamente!', response.status, response.text);
        
        // Mostrar mensaje de éxito
        showMessage('Su mensaje ha sido enviado y será contestado a la brevedad posible.', 'success');
        
        // Limpiar el formulario
        event.target.reset();
        
        // Restaurar el botón
        resetButton(submitButton, originalButtonText);
    })
    .catch(function(error) {
        console.error('Error al enviar el email:', error);
        
        // Mostrar mensaje de error
        showMessage('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
        
        // Restaurar el botón
        resetButton(submitButton, originalButtonText);
    });
}

/**
 * Obtiene los datos del formulario
 * @param {HTMLFormElement} form - Elemento del formulario
 * @returns {Object} Datos del formulario
 */
function getFormData(form) {
    // Obtener los inputs del formulario
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const zipInput = form.querySelector('input[type="text"]');
    const serviceType = form.querySelector('select');
    
    // Retornar objeto con los datos
    // Nota: Los nombres de las variables deben coincidir con los 
    // nombres de las variables en tu template de EmailJS
    return {
        from_name: nameInput ? nameInput.value.trim() : '',
        from_email: emailInput ? emailInput.value.trim() : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        zip_code: zipInput ? zipInput.value.trim() : '',
        service_type : serviceType ? serviceType.value: ''
    };
}

/**
 * Valida los datos del formulario
 * @param {Object} formData - Datos del formulario
 * @returns {boolean} true si es válido, false si no
 */
function validateForm(formData) {
    // Validar que nombre, email y teléfono no estén vacíos
    if (!formData.from_name || !formData.from_email || !formData.phone) {
        return false;
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) {
        return false;
    }
    
    return true;
}

/**
 * Restaura el estado original del botón
 * @param {HTMLButtonElement} button - Botón a restaurar
 * @param {string} originalText - Texto original del botón
 */
function resetButton(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
}

/**
 * Muestra un mensaje al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success' o 'error')
 */
function showMessage(message, type) {
    // Crear el elemento del mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    
    // Estilos del mensaje
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
    `;
    
    // Colores según el tipo
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
        messageDiv.style.color = 'white';
    } else {
        messageDiv.style.backgroundColor = '#f44336';
        messageDiv.style.color = 'white';
    }
    
    // Agregar al body
    document.body.appendChild(messageDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    /* Responsive para mensajes en móviles */
    @media (max-width: 768px) {
        .form-message {
            left: 20px !important;
            right: 20px !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(style);