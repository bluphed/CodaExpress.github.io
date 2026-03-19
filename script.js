let mapa;
let restauranteMarker = null;
let clienteMarker = null;
let modo = "";
let ultimoPrecio = 0;
let ultimaDistancia = 0;

function initMap() {
    mapa = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: -0.22, lng: -78.51 }
    });
    
    setTimeout(cargarRestaurante, 500);
    
    mapa.addListener("click", function(event) {
        if (modo === "restaurante") {
            if (restauranteMarker) restauranteMarker.setMap(null);
            restauranteMarker = new google.maps.Marker({
                position: event.latLng,
                map: mapa,
                label: "R"
            });
            localStorage.setItem("restaurante", JSON.stringify({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            }));
            modo = "";
            alert("✅ Local marcado");
        } 
        else if (modo === "cliente") {
            if (clienteMarker) clienteMarker.setMap(null);
            clienteMarker = new google.maps.Marker({
                position: event.latLng,
                map: mapa,
                label: "C"
            });
            modo = "";
            alert("✅ Cliente marcado");
        }
    });
}

function modoRestaurante() {
    modo = "restaurante";
    alert("📍 Toca el mapa para marcar el local");
}

function modoCliente() {
    modo = "cliente";
    alert("👤 Toca el mapa para marcar el cliente");
}

function cargarRestaurante() {
    let guardado = localStorage.getItem("restaurante");
    if (guardado && mapa) {
        try {
            let ubicacion = JSON.parse(guardado);
            if (restauranteMarker) restauranteMarker.setMap(null);
            restauranteMarker = new google.maps.Marker({
                position: ubicacion,
                map: mapa,
                label: "R"
            });
            mapa.setCenter(ubicacion);
        } catch (e) {
            console.error("Error al cargar local", e);
        }
    }
}

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
    
    document.getElementById("resultado").innerHTML = 
        "📏 Distancia: " + distancia.toFixed(2) + " km<br><br>" +
        "💰 Costo: $" + total.toFixed(2);
}

function enviarWhatsApp() {
    if (ultimoPrecio === 0) {
        alert("❌ Primero calcula el costo");
        return;
    }
    
    let numero = "593997020710";
    let mensaje = "🚚 Pedido Delivery\n\n" +
                 "📏 Distancia: " + ultimaDistancia.toFixed(2) + " km\n" +
                 "💰 Costo: $" + ultimoPrecio.toFixed(2) + "\n\n" +
                 "👤 Nombre cliente:\n📱 Celular:\n📍 Dirección:";
    
    window.open("https://api.whatsapp.com/send?phone=" + numero + 
                "&text=" + encodeURIComponent(mensaje), "_blank");
}

function abrirMenu() {
    document.getElementById("menuLateral").style.left = "0";
}

function cerrarMenu() {
    document.getElementById("menuLateral").style.left = "-250px";
}

function toggleLocales() {
    let lista = document.getElementById("listaLocales");
    lista.style.display = lista.style.display === "none" ? "block" : "none";
}

function seleccionarLocal(lat, lng) {
    let ubicacion = { lat: lat, lng: lng };
    if (restauranteMarker) restauranteMarker.setMap(null);
    restauranteMarker = new google.maps.Marker({
        position: ubicacion,
        map: mapa,
        label: "R"
    });
    mapa.setCenter(ubicacion);
    localStorage.setItem("restaurante", JSON.stringify(ubicacion));
    cerrarMenu();
    alert("✅ Local seleccionado");
}
