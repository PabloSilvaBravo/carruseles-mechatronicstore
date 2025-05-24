<?php
/**
 * Plugin Name:       Mechatronic Logo Carousel
 * Plugin URI:        https://www.mechatronicstore.cl/
 * Description:       Muestra un carrusel de logos personalizable mediante una clase CSS.
 * Version:           1.0.0
 * Author:            Tu Nombre (o Mechatronic Store)
 * Author URI:        https://www.mechatronicstore.cl/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mechatronic-logo-carousel
 * Domain Path:       /languages
 */

// Prevenir acceso directo al archivo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Encola los scripts y estilos del carrusel.
 */
function mlc_enqueue_carousel_assets() {
    // La clase CSS que el usuario debe añadir a su elemento Fila (Row) en UX Builder
    // Podrías hacer esto una opción del plugin en el futuro.
    $carousel_target_class = 'mi-carrusel-de-logos';

    // Encolar el CSS del plugin
    wp_enqueue_style(
        'mlc-carousel-style', // Handle
        plugin_dir_url( __FILE__ ) . 'css/carousel-style.css', // Ruta al archivo CSS
        array(), // Dependencias
        '1.0.0' // Versión
    );

    // Encolar el JavaScript del plugin
    wp_enqueue_script(
        'mlc-carousel-script', // Handle
        plugin_dir_url( __FILE__ ) . 'js/carousel-script.js', // Ruta al archivo JS
        array(), // Dependencias (puedes añadir 'jquery' si lo usaras)
        '1.0.0', // Versión
        true // Cargar en el footer
    );

    // Pasar datos de PHP a JavaScript (como la clase objetivo)
    // JavaScript podrá acceder a esto mediante `mlcCarouselSettings.targetClass`
    wp_localize_script(
        'mlc-carousel-script', // El handle del script al que se adjuntan los datos
        'mlcCarouselSettings', // Nombre del objeto JavaScript que contendrá los datos
        array(
            'targetClass' => $carousel_target_class,
            // Puedes añadir más datos aquí si los necesitas en JS
        )
    );
}
add_action( 'wp_enqueue_scripts', 'mlc_enqueue_carousel_assets' );

// Importante: Ya no necesitas la función que tenías en functions.php para inyectar el script.
// El plugin se encargará de encolar el JS y CSS de forma correcta.
// Asegúrate de ELIMINAR la función `mechatronic_class_based_logo_carousel_script()` de tu functions.php
// una vez que este plugin esté activo y funcionando.