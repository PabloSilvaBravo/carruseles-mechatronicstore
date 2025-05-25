<?php
/**
 * Plugin Name:       Carruseles MechatronicStore
 * Plugin URI:        https://www.mechatronicstore.cl/
 * Description:       Muestra un carrusel de logos personalizable mediante una clase CSS.
 * Version:           1.2.1
 * Author:            Pablo Mechatronics
 * Author URI:        https://www.mechatronicstore.cl/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       carruseles-mechatronicstore
 * Domain Path:       /languages
 */

// Prevenir acceso directo al archivo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Encola los scripts y estilos del carrusel.
 */
function mlc_enqueue_carousel_assets_v1_2_1() { // Nombre de función y versión actualizados
    $carousel_target_class = 'mi-carrusel-de-logos'; 

    wp_enqueue_style(
        'mlc-carousel-style',
        plugin_dir_url( __FILE__ ) . 'css/carousel-style.css',
        array(),
        '1.2.1' // Nueva versión para cache busting
    );

    wp_enqueue_script(
        'mlc-carousel-script',
        plugin_dir_url( __FILE__ ) . 'js/carousel-script.js',
        array(), 
        '1.2.1', // Nueva versión para cache busting
        true 
    );

    wp_localize_script(
        'mlc-carousel-script',
        'mlcCarouselSettings',
        array(
            'targetClass' => $carousel_target_class,
        )
    );
}
add_action( 'wp_enqueue_scripts', 'mlc_enqueue_carousel_assets_v1_2_1' );