// ============================================
// DETECTAR SI ES LINK CORTO
// ============================================
function esLinkCorto(link) {
    return link.includes("maps.app.goo.gl");
}

// ============================================
// OBTENER COORDENADAS DESDE BACKEND
// ============================================
async function obtenerCoordenadasDesdeBackend(link) {
    try {
        const response = await fetch('https://TU_BACKEND.onrender.com/expandir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ link })
        });

        const data = await response.json();

        if (data.lat && data.lng) {
            return { lat: data.lat, lng: data.lng };
        } else {
            return null;
        }

    } catch (error) {
        console.error("Error backend:", error);
        return null;
    }
}