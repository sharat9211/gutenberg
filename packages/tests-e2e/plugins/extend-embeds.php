<?php
/**
 * Plugin Name: Gutenberg Test Extend Embeds
 * Plugin URI: https://github.com/WordPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-extend-embeds
 */

/**
 * A fake preview endpoint for use when testing embed extentions that
 * have a custom preview endpoint.
 */
function extend_embeds_preview() {
	return '<p>This is a preview from a custom endpoint.</p>';
}

/**
 * Registers a custom script for the plugin.
 */
function init_extend_embeds() {
	wp_enqueue_script(
		'gutenberg-test-extend-embeds',
		plugins_url( 'extend-embeds/index.js', __FILE__ ),
		array(
			'wp-element',
			'wp-editor',
			'wp-i18n',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'extend-embeds/index.js' ),
		true
	);
	add_action( 'rest_api_init', function () {
		register_rest_route( 'extend-embeds/v1', '/preview/', array(
			'methods' => 'GET',
			'callback' => 'extend_embeds_preview',
		) );
	} );
}

add_action( 'init', 'init_extend_embeds' );
