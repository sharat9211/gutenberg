/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

export const YouTubeInspectorControls = class extends Component {
	constructor() {
		super( ...arguments );
		const { extraOptions = {} } = this.props.attributes;
		this.setAttributes = this.setAttributes.bind( this );
		this.commitAttributes = debounce( this.props.setAttributes, 1000 );
		this.state = {
			autoplay: extraOptions.autoplay || false,
			start: extraOptions.start || 0,
		};
	}

	setAttributes( attributes ) {
		const { extraOptions = {} } = this.props.attributes;
		this.setState( attributes );
		this.commitAttributes( { extraOptions: { ...extraOptions, ...attributes } } );
	}

	render() {
		const { autoplay, start } = this.state;
		const onChangeAutoplay = ( value ) => {
			this.setAttributes( { autoplay: value } );
		};
		const onChangeStart = ( value ) => {
			this.setAttributes( { start: value } );
		};

		return (
			<InspectorControls>
				<PanelBody title={ __( 'YouTube Settings' ) } className="blocks-youtube-extra">
					<ToggleControl
						label={ __( 'Autoplay' ) }
						checked={ autoplay }
						onChange={ onChangeAutoplay }
					/>
					<TextControl
						type="number"
						value={ start }
						onChange={ onChangeStart }
						label={ __( 'Start time (seconds)' ) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
};

export const YouTubePreviewTransform = ( preview, attributes ) => {
	let extraQueryParams = '';
	if ( ! attributes.extraOptions ) {
		return preview;
	}
	const { start } = attributes.extraOptions;
	if ( undefined !== start && parseInt( start ) > 0 ) {
		extraQueryParams = extraQueryParams + '&start=' + parseInt( start );
	}
	if ( extraQueryParams ) {
		const transformedPreview = { ...preview };
		transformedPreview.html = transformedPreview.html.replace( 'feature=oembed', 'feature=oembed' + extraQueryParams );
		return transformedPreview;
	}
	return preview;
};
