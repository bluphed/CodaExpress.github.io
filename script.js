// Nueva función para confirmar ubicación desde link de WhatsApp
function confirmarUbicacionLink() {
    let link = document.getElementById("ubicacionLink").value;
    
    if (!link) {
        alert("❌ Por favor pega un link de ubicación");
        return;
    }
    
    // Intentar extraer coordenadas del link (formato Google Maps)
    // Esto es simplificado, en realidad necesitarías una API para geocodificar
    alert("🔍 Función en desarrollo: Se integrará con API de geocodificación");
    
    // Por ahora, abrimos el link en una nueva pestaña
    window.open(link, "_blank");
}

// Nueva función para cambiar local desde el selector
function cambiarLocalDesdeSelector() {
    let selector = document.getElementById("selectorLocal");
    let valor = selector.value;
    
    if (valor) {
        let coordenadas = valor.split(",");
        let lat = parseFloat(coordenadas[0]);
        let lng = parseFloat(coordenadas[1]);
        seleccionarLocal(lat, lng);
    }
}

// Modificar la función enviarWhatsApp para incluir los nuevos datos
function enviarWhatsApp() {
    if (ultimoPrecio === 0) {
        alert("❌ Primero calcula el costo");
        return;
    }
    
    // Obtener datos del cliente
    let nombre = document.getElementById("nombreCliente").value || "No especificado";
    let celular = document.getElementById("celularCliente").value || "No especificado";
    let referencia = document.getElementById("referenciaCliente").value || "No especificado";
    let ubicacionLink = document.getElementById("ubicacionLink").value || "No proporcionado";
    
    let numero = "593997020710";
    let mensaje = "🚚 *NUEVO PEDIDO DELIVERY*\n\n" +
                 "━━━━━━━━━━━━━━━━\n\n" +
                 "📍 *DISTANCIA Y COSTO*\n" +
                 "📏 Distancia: " + ultimaDistancia.toFixed(2) + " km\n" +
                 "💰 Costo: $" + ultimoPrecio.toFixed(2) + "\n\n" +
                 "━━━━━━━━━━━━━━━━\n\n" +
                 "👤 *DATOS DEL CLIENTE*\n" +
                 "• Nombre: " + nombre + "\n" +
                 "• Celular: " + celular + "\n" +
                 "• Referencia: " + referencia + "\n\n" +
                 "━━━━━━━━━━━━━━━━\n\n" +
                 "📍 *UBICACIÓN*\n" +
                 "Link: " + ubicacionLink + "\n\n" +
                 "━━━━━━━━━━━━━━━━\n\n" +
                 "✅ _Pedido generado desde la app_";
    
    let url = "https://api.whatsapp.com/send?phone=" + numero + 
              "&text=" + encodeURIComponent(mensaje);
    
    window.open(url, "_blank");
}

// Modificar la función calcular para mostrar resultado más bonito
function calcular() {
    if (!restauranteMarker || !clienteMarker) {
        alert("❌ Debes marcar local y cliente");
        return;
    }
    
    let distancia = google.maps.geometry.spherical.computeDistanceBetween(
        restauranteMarker.getPosition(),
        clienteMarker.getPosition()
    ) / 1000;
    
    let total = 1 + (distancia * 0.5);
    total = Math.ceil(total * 4) / 4;
    
    ultimoPrecio = total;
    ultimaDistancia = distancia;
    
    // Mostrar resultado con nuevo formato
    document.getElementById("resultado").innerHTML = 
        '<div class="result-active">' +
        '<i class="fas fa-check-circle" style="color:#27ae60; font-size:36px;"></i>' +
        '<div class="distancia">📏 ' + distancia.toFixed(2) + ' km</div>' +
        '<div class="costo">💰 $' + total.toFixed(2) + '</div>' +
        '<p style="color:#7f8c8d; font-size:14px; margin-top:10px;">' +
        'Incluye: costo base $1 + $0.50 por km</p>' +
        '</div>';
}
