<?php
/**
 * Server-side rendering of the `core/archives` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/archives` block on server.
 *
 * @see WP_Widget_Archives
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with archives added.
 */
function render_block_core_embed_youtube( $attributes, $content ) {
	$extra = '';
	if ( ! isset( $attributes['extraOptions'] ) ) {
		return $content;
	}
	if ( isset( $attributes['extraOptions']['autoplay'] ) && $attributes['extraOptions']['autoplay'] ) {
		$extra .= '&autoplay=1';
	}
	if ( isset( $attributes['extraOptions']['start'] ) && $attributes['extraOptions']['start'] > 0 ) {
		$extra .= '&start=' . intval( $attributes['extraOptions']['start'] );
	}
	$content = str_replace( 'feature=oembed', 'feature=oembed' . $extra, $content );
	return $content;
}

/**
 * Register archives block.
 */
function register_block_core_embed_youtube() {
	register_block_type(
		'core-embed/youtube',
		array(
			'attributes'      => array(
			),
			'render_callback' => 'render_block_core_embed_youtube',
		)
	);
}

add_action( 'init', 'register_block_core_embed_youtube' );
