/**
 * Ciudades disponibles para buscar vuelos (origen/destino)
 */
const ciudadesDisponibles = [
    { nombre: 'Buenos Aires', codigo: 'BUE' },
    { nombre: 'Madrid', codigo: 'MAD' },
    { nombre: 'Miami', codigo: 'MIA' },
    { nombre: 'Ciudad de México', codigo: 'MEX' },
    { nombre: 'Nueva York', codigo: 'NYC' },
    { nombre: 'Roma', codigo: 'FCO' },
    { nombre: 'París', codigo: 'CDG' }
];

/**
 * Obtiene el código de aeropuerto de una ciudad por su nombre
 * @param {string} nombreCiudad - Nombre de la ciudad
 * @returns {string} Código de aeropuerto, o el mismo nombre si no se encuentra
 */
function obtenerCodigoCiudad(nombreCiudad) {
    const ciudad = ciudadesDisponibles.find(c => c.nombre === nombreCiudad);
    return ciudad ? ciudad.codigo : nombreCiudad;
}

/**
 * Guarda datos en localStorage de forma segura
 * @param {string} clave - Identificador del dato
 * @param {*} datos - Dato a guardar (se convierte a JSON)
 */
function guardarDatos(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        console.log(`✓ Guardado en localStorage: ${clave}`);
        return true;
    } catch (error) {
        console.error(`✗ Error al guardar datos en localStorage:`, error);
        return false;
    }
}

/**
 * Carga datos desde localStorage
 * @param {string} clave - Identificador del dato
 * @returns {*} Dato parseado o null si no existe
 */
function cargarDatos(clave) {
    try {
        const datos = localStorage.getItem(clave);
        if (datos) {
            console.log(`✓ Cargado desde localStorage: ${clave}`);
            return JSON.parse(datos);
        }
        return null;
    } catch (error) {
        console.error(`✗ Error al cargar datos de localStorage:`, error);
        return null;
    }
}

/**
 * Elimina datos de localStorage
 * @param {string} clave - Identificador del dato
 */
function limpiarDatos(clave) {
    try {
        localStorage.removeItem(clave);
        console.log(`✓ Eliminado de localStorage: ${clave}`);
        return true;
    } catch (error) {
        console.error(`✗ Error al limpiar datos:`, error);
        return false;
    }
}


/**
 * Valida que un email sea correcto
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

/**
 * Valida que un DNI sea valido
 * @param {string} dni - DNI a validar
 * @returns {boolean}
 */
function validarDNI(dni) {
    const soloNumeros = dni.replace(/\D/g, '');
    return soloNumeros.length >= 7 && soloNumeros.length <= 10;
}

/**
 * Valida que un teléfono sea valido
 * @param {string} telefono - Telefono a validar
 * @returns {boolean}
 */
function validarTelefono(telefono) {
    const soloNumeros = telefono.replace(/\D/g, '');
    return soloNumeros.length >= 10 && soloNumeros.length <= 15;
}

/**
 * Valida que una fecha sea valida
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean}
 */
function validarFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj instanceof Date && !isNaN(fechaObj);
}

/**
 * Valida que fechaVuelta >= fechaIda
 * @param {string} fechaIda - Fecha de ida (YYYY-MM-DD)
 * @param {string} fechaVuelta - Fecha de vuelta (YYYY-MM-DD)
 * @returns {boolean}
 */
function validarRangoFechas(fechaIda, fechaVuelta) {
    if (!fechaIda || !fechaVuelta) return true;
    const ida = new Date(fechaIda);
    const vuelta = new Date(fechaVuelta);
    return vuelta >= ida;
}

/**
 * Calcula la duración entre dos horarios en formato HH:MM
 * @param {string} horaSalida - Hora de salida (HH:MM)
 * @param {string} horaLlegada - Hora de llegada (HH:MM)
 * @returns {string} Duración formateada, ej "2 h 15m"
 */
function calcularDuracion(horaSalida, horaLlegada) {
    const [horaS, minS] = horaSalida.split(':').map(Number);
    const [horaL, minL] = horaLlegada.split(':').map(Number);

    let minutosTotales = (horaL * 60 + minL) - (horaS * 60 + minS);
    if (minutosTotales < 0) {
        minutosTotales += 24 * 60;
    }

    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;

    return minutos > 0 ? `${horas} h ${minutos}m` : `${horas} h`;
}

/**
 * Muestra un elemento HTML
 * @param {string} selectorCSS - Selector CSS del elemento
 */
function mostrar(selectorCSS) {
    const elemento = document.querySelector(selectorCSS);
    if (elemento) {
        elemento.style.display = 'block';
    }
}

/**
 * Oculta un elemento HTML
 * @param {string} selectorCSS - Selector CSS del elemento
 */
function ocultar(selectorCSS) {
    const elemento = document.querySelector(selectorCSS);
    if (elemento) {
        elemento.style.display = 'none';
    }
}

/**
 * Activa/desactiva un elemento
 * @param {string} selectorCSS - Selector CSS del elemento
 * @param {boolean} estado - true = activo, false = desactivo
 */
function alternarEstado(selectorCSS, estado) {
    const elemento = document.querySelector(selectorCSS);
    if (elemento) {
        elemento.disabled = !estado;
    }
}

/**
 * Muestra una alerta mejorada
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - 'exito', 'error', 'info'
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        animation: slideIn 0.3s ease-in-out;
    `;

    const colores = {
        exito: { bg: '#4CAF50', color: 'white' },
        error: { bg: '#f44336', color: 'white' },
        info: { bg: '#2196F3', color: 'white' }
    };

    const estilos = colores[tipo] || colores.info;
    notificacion.style.backgroundColor = estilos.bg;
    notificacion.style.color = estilos.color;

    document.body.appendChild(notificacion);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}


/**
 * Obtiene el valor de un parámetro de URL
 * @param {string} nombreParametro - Nombre del parámetro
 * @returns {string|null}
 */
function obtenerParametroURL(nombreParametro) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombreParametro);
}

/**
 * Formatea un número como moneda
 * @param {number} numero - Número a formatear
 * @param {string} moneda - Código ISO (USD, ARS, etc.)
 * @returns {string}
 */
function formatearMoneda(numero, moneda = 'USD') {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: moneda
    }).format(numero);
}

/**
 * Espera un tiempo determinado (útil con async/await)
 * @param {number} ms - Milisegundos a esperar
 */
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copia texto al portapapeles
 * @param {string} texto - Texto a copiar
 */
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarNotificacion('Copiado al portapapeles', 'exito');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}