
// ============================================
// DETECTAR SI ES LINK CORTO
// ============================================
function esLinkCorto(link) {
    return link.includes("maps.app.goo.gl") || 
           link.includes("goo.gl/maps") ||
           link.includes("shorturl.at");
}

// ============================================
// EXTRAER COORDENADAS DIRECTAMENTE DE LA URL
// ============================================
function extraerCoordenadasDeUrl(url) {
    // Patrones para diferentes formatos de Google Maps
    const patrones = [
        // Formato @lat,lng (el más común)
        /@(-?\d+\.\d+),(-?\d+\.\d+)/,
        // Formato !3dlat!4dlng (usado en enlaces móviles)
        /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
        // Formato ?q=lat,lng
        /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
        // Formato /search/lat,lng
        /\/search\/(-?\d+\.\d+),(-?\d+\.\d+)/,
        // Formato ll=lat,lng
        /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
        // Formato center=lat,lng
        /[?&]center=(-?\d+\.\d+),(-?\d+\.\d+)/
    ];

    for (let patron of patrones) {
        const match = url.match(patron);
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return { lat, lng };
            }
        }
    }
    return null;
}

// ============================================
// PROCESAR LINK CORTO SIGUIENDO REDIRECCIONES
// ============================================
async function procesarLinkCorto(link) {
    try {
        // Seguir redirecciones para obtener URL final
        const response = await fetch(link, { 
            method: 'HEAD', 
            redirect: 'follow',
            cache: 'no-cache'
        });
        const finalUrl = response.url;
        console.log('URL expandida:', finalUrl);
        
        // Extraer coordenadas de la URL final
        return extraerCoordenadasDeUrl(finalUrl);
    } catch (error) {
        console.error('Error al seguir redirección:', error);
        return null;
    }
}

// ============================================
// OBTENER COORDENADAS DESDE LINK (VERSIÓN CORREGIDA)
// ============================================
async function obtenerCoordenadasDesdeLink(link) {
    // Primero intentar extraer directamente
    let coords = extraerCoordenadasDeUrl(link);
    if (coords) return coords;
    
    // Si es link corto, seguir redirección
    if (esLinkCorto(link)) {
        coords = await procesarLinkCorto(link);
        if (coords) return coords;
    }
    
    return null;
}
