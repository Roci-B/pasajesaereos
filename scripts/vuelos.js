const vuelosMock = [
    { id: 1, origen: 'BUE', destino: 'MAD', horaSalida: '05:45', horaLlegada: '08:00', tipo: 'Directo', duracion: '2 h 15m', precio: 500, aerolinea: 'aerolinea1', equipaje: true },
    { id: 2, origen: 'BUE', destino: 'MAD', horaSalida: '08:00', horaLlegada: '11:30', tipo: 'Con escala', duracion: '4 h 30m', precio: 350, aerolinea: 'aerolinea2', equipaje: false },
    { id: 3, origen: 'BUE', destino: 'MAD', horaSalida: '10:30', horaLlegada: '14:00', tipo: 'Directo', duracion: '2 h 15m', precio: 600, aerolinea: 'aerolinea1', equipaje: true },
    { id: 4, origen: 'BUE', destino: 'MAD', horaSalida: '12:00', horaLlegada: '16:45', tipo: 'Con escala', duracion: '5 h', precio: 300, aerolinea: 'aerolinea3', equipaje: false },
    { id: 5, origen: 'BUE', destino: 'MAD', horaSalida: '14:15', horaLlegada: '17:30', tipo: 'Directo', duracion: '2 h 15m', precio: 550, aerolinea: 'aerolinea2', equipaje: true },
    { id: 6, origen: 'BUE', destino: 'MAD', horaSalida: '16:00', horaLlegada: '21:00', tipo: 'Con escala', duracion: '4 h 30m', precio: 320, aerolinea: 'aerolinea1', equipaje: false },
    { id: 7, origen: 'BUE', destino: 'MAD', horaSalida: '18:30', horaLlegada: '21:45', tipo: 'Directo', duracion: '2 h 15m', precio: 700, aerolinea: 'aerolinea3', equipaje: true },
    { id: 8, origen: 'BUE', destino: 'MAD', horaSalida: '20:00', horaLlegada: '01:00', tipo: 'Con escala', duracion: '3 h 30m', precio: 280, aerolinea: 'aerolinea2', equipaje: false },
    { id: 9, origen: 'BUE', destino: 'MAD', horaSalida: '22:00', horaLlegada: '01:15', tipo: 'Directo', duracion: '2 h 15m', precio: 450, aerolinea: 'aerolinea3', equipaje: true },
    { id: 10, origen: 'BUE', destino: 'MAD', horaSalida: '23:59', horaLlegada: '04:30', tipo: 'Con escala', duracion: '4 h 30m', precio: 400, aerolinea: 'aerolinea1', equipaje: false },
];

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        location.reload();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const ofertaAplicada = cargarDatos('ofertaAplicada');

    if (ofertaAplicada) {
        renderizarVueloDeOferta(ofertaAplicada);
        limpiarDatos('ofertaAplicada');
    } else {
        const huboBusqueda = !!cargarDatos('busquedaDesdeFormulario');
        limpiarDatos('busquedaDesdeFormulario');

        if (!huboBusqueda) {
            limpiarDatos('datosBusquedaVuelos');
        }

        console.log('✓ Vuelos.js cargado');
        renderizarVuelos();
        configurarFiltros();

        if (huboBusqueda) {
            aplicarFiltros();
            mostrarDatosBusqueda();
        } else {
            agregarFiltrosBusqueda('Buenos Aires', 'Madrid', false);
        }
    }
});

function renderizarVueloDeOferta(oferta) {
    const contenedor = document.querySelector('.aerolineas');
    if (!contenedor) return;

    const horaSalida = '10:00';
    const horaLlegada = '18:00';

    const vueloOferta = {
        id: `oferta-${oferta.id}`,
        origen: oferta.origen,
        destino: oferta.destino,
        horaSalida,
        horaLlegada,
        tipo: 'Directo',
        duracion: calcularDuracion(horaSalida, horaLlegada),
        precio: oferta.precioOferta,
        aerolinea: 'aerolinea1',
        equipaje: true
    };

    contenedor.innerHTML = '';

    const article = document.createElement('article');
    article.className = 'aereolinea';
    article.innerHTML = `
        <img class="aerolinea_img" src="../Imagenes/fondo-transparente.png" alt="${vueloOferta.aerolinea}">
        <section class="aerolinea_horario">
            <h3>${vueloOferta.origen}</h3>
            <p>${vueloOferta.horaSalida}</p>
        </section>
        <section class="aerolinea_horario">
            <h3>${vueloOferta.destino}</h3>
            <p>${vueloOferta.horaLlegada}</p>
        </section>
        <h4 class="aerolinea_content">${vueloOferta.tipo}</h4>
        <p class="aerolinea_content">${vueloOferta.duracion}</p>
        <p class="aerolinea_content">$${vueloOferta.precio}</p>
        <a href="#" class="boton_reservar">Reservar</a>
    `;

    article.querySelector('.boton_reservar').addEventListener('click', function(e) {
        e.preventDefault();

        const datosBusqueda = cargarDatos('datosBusquedaVuelos');
        if (!datosBusqueda || !datosBusqueda.pasajeros || !datosBusqueda.clase) {
            mostrarNotificacion('Seleccioná pasajeros y clase antes de reservar.', 'error');
            return;
        }

        confirmarSeleccionVuelo(vueloOferta);
    });

    contenedor.appendChild(article);

    const [nombreOrigen, nombreDestino] = oferta.rutaCompleta.split(' → ');
    agregarFiltrosBusqueda(nombreOrigen, nombreDestino);
    actualizarContadorResultados(1);

    console.log('✓ Vuelo de oferta mostrado:', vueloOferta);
}

function agregarFiltrosBusqueda(nombreOrigen, nombreDestino, mostrarResumen = true) {
    const filtro = document.querySelector('.filtro');
    if (!filtro || document.getElementById('oferta-fecha-ida')) return;

    filtro.insertAdjacentHTML('afterbegin', `
        <div class="subtitulo">
            <h2>Tipo de viaje</h2>
        </div>
        <section class="filtrado_tipo_vuelo">
            <input type="radio" id="oferta-ida-vuelta" name="oferta-tipo" value="ida-vuelta" autocomplete="off">
            <label for="oferta-ida-vuelta">Ida y vuelta</label><br>
            <input type="radio" id="oferta-solo-ida" name="oferta-tipo" value="solo-ida" autocomplete="off" checked>
            <label for="oferta-solo-ida">Solo ida</label><br>
        </section>
        <div class="subtitulo">
            <h2>Fechas</h2>
        </div>
        <section class="filtrado_por filtro-extra">
            <label for="oferta-fecha-ida">Ida</label>
            <input type="date" id="oferta-fecha-ida" autocomplete="off">
            <label for="oferta-fecha-vuelta" style="padding-top: 12px;">Vuelta</label>
            <input type="date" id="oferta-fecha-vuelta" autocomplete="off" disabled>
        </section>
        <div class="subtitulo">
            <h2>Pasajeros</h2>
        </div>
        <section class="filtrado_por filtro-extra">
            <select id="oferta-pasajeros" autocomplete="off">
                <option value="" disabled selected>Elegí una opción</option>
                <option value="1">1 Pasajero</option>
                <option value="2">2 Pasajeros</option>
                <option value="3">3 Pasajeros</option>
            </select>
        </section>
        <div class="subtitulo">
            <h2>Clase</h2>
        </div>
        <section class="filtrado_por filtro-extra">
            <select id="oferta-clase" autocomplete="off">
                <option value="" disabled selected>Elegí una opción</option>
                <option value="economica">Económica</option>
                <option value="ejecutiva">Ejecutiva</option>
                <option value="primera">Primera Clase</option>
            </select>
        </section>
    `);

    const inputFechaIda = document.getElementById('oferta-fecha-ida');
    const inputFechaVuelta = document.getElementById('oferta-fecha-vuelta');
    const selectPasajeros = document.getElementById('oferta-pasajeros');
    const selectClase = document.getElementById('oferta-clase');
    inputFechaIda.value = formatearFechaISO(new Date());
    document.getElementById('oferta-solo-ida').checked = true;

    function guardarBusquedaOferta() {
        const tipoSeleccionado = document.querySelector('input[name="oferta-tipo"]:checked').value;
        guardarDatos('datosBusquedaVuelos', {
            tipo: tipoSeleccionado,
            origen: nombreOrigen,
            destino: nombreDestino,
            fechaIda: inputFechaIda.value,
            fechaVuelta: tipoSeleccionado === 'solo-ida' ? '' : inputFechaVuelta.value,
            pasajeros: selectPasajeros.value,
            clase: selectClase.value
        });

        actualizarEstadoBotonesReservar(!!selectPasajeros.value && !!selectClase.value);

        if (mostrarResumen) {
            mostrarDatosBusqueda();
        }
    }

    document.querySelectorAll('input[name="oferta-tipo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            inputFechaVuelta.disabled = this.value === 'solo-ida';
            guardarBusquedaOferta();
        });
    });

    inputFechaIda.addEventListener('change', guardarBusquedaOferta);
    inputFechaVuelta.addEventListener('change', guardarBusquedaOferta);
    selectPasajeros.addEventListener('change', guardarBusquedaOferta);
    selectClase.addEventListener('change', guardarBusquedaOferta);

    guardarBusquedaOferta();
}

function formatearFechaISO(fecha) {
    return fecha.toISOString().split('T')[0];
}

function actualizarEstadoBotonesReservar(habilitado) {
    document.querySelectorAll('.boton_reservar').forEach(boton => {
        boton.classList.toggle('boton_reservar-disabled', !habilitado);
    });
}

function renderizarVuelos() {
    const contenedor = document.querySelector('.aerolineas');
    if (!contenedor) return;

    const datosBusqueda = cargarDatos('datosBusquedaVuelos');
    const codigoOrigen = datosBusqueda ? obtenerCodigoCiudad(datosBusqueda.origen) : null;
    const codigoDestino = datosBusqueda ? obtenerCodigoCiudad(datosBusqueda.destino) : null;

    contenedor.innerHTML = '';

    vuelosMock.forEach(vuelo => {
        const article = document.createElement('article');
        article.className = 'aereolinea';
        article.innerHTML = `
            <img class="aerolinea_img" src="../Imagenes/fondo-transparente.png" alt="${vuelo.aerolinea}">
            <section class="aerolinea_horario">
                <h3>${codigoOrigen || vuelo.origen}</h3>
                <p>${vuelo.horaSalida}</p>
            </section>
            <section class="aerolinea_horario">
                <h3>${codigoDestino || vuelo.destino}</h3>
                <p>${vuelo.horaLlegada}</p>
            </section>
            <h4 class="aerolinea_content">${vuelo.tipo}</h4>
            <p class="aerolinea_content">${vuelo.duracion}</p>
            <p class="aerolinea_content">$${vuelo.precio}</p>
            <a href="#" class="boton_reservar" onclick="guardarVueloSeleccionado(${vuelo.id}); return false;">Reservar</a>
        `;
        contenedor.appendChild(article);
    });
}

function mostrarDatosBusqueda() {
    const datosBusqueda = cargarDatos('datosBusquedaVuelos');
    if (!datosBusqueda) return;

    let resumenBusqueda = document.querySelector('.resumen-busqueda');

    if (!resumenBusqueda) {
        resumenBusqueda = document.createElement('div');
        resumenBusqueda.className = 'resumen-busqueda';
        resumenBusqueda.style.cssText = `
            background-color: rgba(132, 163, 221, 0.3);
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 5px;
            text-align: center;
        `;

        const main = document.querySelector('main');
        const h1 = main.querySelector('h1');
        main.insertBefore(resumenBusqueda, h1.nextSibling);
    }

    const partePasajeros = datosBusqueda.pasajeros ? ` | ${datosBusqueda.pasajeros} pasajero(s)` : '';
    const parteClase = datosBusqueda.clase ? ` | ${datosBusqueda.clase}` : '';

    resumenBusqueda.innerHTML = `
        <p><strong>${datosBusqueda.origen}</strong> → <strong>${datosBusqueda.destino}</strong>
        | ${datosBusqueda.fechaIda}${partePasajeros}${parteClase}</p>
    `;

    console.log('✓ Datos de búsqueda mostrados');
}

function configurarFiltros() {
    const rangeInput = document.getElementById('range');
    const rangeLabel = document.querySelector('.rango');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    rangeInput.addEventListener('input', function() {
        const minPrecio = 300;
        const maxPrecio = 1000;
        const valorActual = this.value;
        rangeLabel.textContent = `Min $${minPrecio} - Max $${valorActual}`;
        aplicarFiltros();
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });
}

function aplicarFiltros() {
    const rangeInput = document.getElementById('range');
    const precioMaximo = parseInt(rangeInput.value);

    const directoChecked = document.getElementById('directo').checked;
    const conEscalaChecked = document.getElementById('con_escala').checked;
    const aerolinea1Checked = document.getElementById('aerolinea1').checked;
    const aerolinea2Checked = document.getElementById('aerolinea2').checked;
    const aerolinea3Checked = document.getElementById('aerolinea3').checked;
    const equipajeChecked = document.getElementById('equipaje_incluido').checked;

    const vuelos = document.querySelectorAll('.aereolinea');
    let vuelosVisibles = 0;

    vuelos.forEach((vueloElement, index) => {
        if (index >= vuelosMock.length) return;

        const vuelo = vuelosMock[index];
        let mostrarVuelo = true;

        if (vuelo.precio > precioMaximo) {
            mostrarVuelo = false;
        }

        if (mostrarVuelo) {
            const tipoVueloValido =
                (directoChecked && vuelo.tipo === 'Directo') ||
                (conEscalaChecked && vuelo.tipo === 'Con escala') ||
                (!directoChecked && !conEscalaChecked); // Si no hay ninguno seleccionado, mostrar todos

            if (!tipoVueloValido && (directoChecked || conEscalaChecked)) {
                mostrarVuelo = false;
            }
        }

        if (mostrarVuelo) {
            const aerolineaValida =
                (aerolinea1Checked && vuelo.aerolinea === 'aerolinea1') ||
                (aerolinea2Checked && vuelo.aerolinea === 'aerolinea2') ||
                (aerolinea3Checked && vuelo.aerolinea === 'aerolinea3') ||
                (!aerolinea1Checked && !aerolinea2Checked && !aerolinea3Checked); // Si no hay ninguno seleccionado, mostrar todos

            if (!aerolineaValida && (aerolinea1Checked || aerolinea2Checked || aerolinea3Checked)) {
                mostrarVuelo = false;
            }
        }

        if (mostrarVuelo && equipajeChecked && !vuelo.equipaje) {
            mostrarVuelo = false;
        }

        if (mostrarVuelo) {
            vueloElement.style.display = 'flex';
            vuelosVisibles++;
        } else {
            vueloElement.style.display = 'none';
        }
    });

    actualizarContadorResultados(vuelosVisibles);
}

function actualizarContadorResultados(cantidad) {
    let contador = document.querySelector('.contador-resultados');

    if (!contador) {
        contador = document.createElement('div');
        contador.className = 'contador-resultados';
        const main = document.querySelector('main');
        main.insertBefore(contador, document.querySelector('.resultados'));
    }

    if (cantidad === 0) {
        contador.innerHTML = '<p style="color: #f44336; font-weight: bold;">No hay vuelos que cumplan con los criterios de búsqueda</p>';
    } else {
        contador.innerHTML = `<p style="color: #4CAF50; font-weight: bold;">✓ ${cantidad} vuelo(s) encontrado(s)</p>`;
    }

    contador.style.cssText = `
        text-align: center;
        padding: 0.5rem;
        margin: 1rem 0;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.1);
    `;
}

function guardarVueloSeleccionado(vueloId) {
    const vuelo = vuelosMock.find(v => v.id === vueloId);
    if (vuelo) {
        const datosBusqueda = cargarDatos('datosBusquedaVuelos');

        if (!datosBusqueda || !datosBusqueda.pasajeros || !datosBusqueda.clase) {
            mostrarNotificacion('Seleccioná pasajeros y clase antes de reservar.', 'error');
            return;
        }

        const vueloAGuardar = { ...vuelo, origen: obtenerCodigoCiudad(datosBusqueda.origen), destino: obtenerCodigoCiudad(datosBusqueda.destino) };

        confirmarSeleccionVuelo(vueloAGuardar);
    }
}

function confirmarSeleccionVuelo(vuelo) {
    guardarDatos('vueloSeleccionado', vuelo);
    mostrarNotificacion('Vuelo guardado. Redirigiendo...', 'exito');
    setTimeout(() => { window.location.href = 'detalleVuelo.html'; }, 500);
}

function ordenarVuelos(criterio) {
    const contenedorVuelos = document.querySelector('.aerolineas');
    const vuelos = Array.from(document.querySelectorAll('.aereolinea'));

    vuelos.sort((a, b) => {
        const indiceA = Array.from(document.querySelectorAll('.aereolinea')).indexOf(a);
        const indiceB = Array.from(document.querySelectorAll('.aereolinea')).indexOf(b);

        const vueloA = vuelosMock[indiceA];
        const vueloB = vuelosMock[indiceB];

        if (criterio === 'precio-asc') {
            return vueloA.precio - vueloB.precio;
        } else if (criterio === 'precio-desc') {
            return vueloB.precio - vueloA.precio;
        } else if (criterio === 'duracion-asc') {
            const minutosA = extraerMinutos(vueloA.duracion);
            const minutosB = extraerMinutos(vueloB.duracion);
            return minutosA - minutosB;
        }
        return 0;
    });

    vuelos.forEach(vuelo => {
        contenedorVuelos.appendChild(vuelo);
    });

    console.log(`✓ Vuelos ordenados por: ${criterio}`);
}

function extraerMinutos(duracion) {
    const partes = duracion.match(/(\d+)\s*h\s*(\d+)\s*m/);
    if (partes) {
        const horas = parseInt(partes[1]);
        const minutos = parseInt(partes[2]);
        return horas * 60 + minutos;
    }
    return 0;
}

console.log('✓ Vuelos.js cargado - Filtros activos');