/**
 * Internal dependencies
 */
import { getEmbedSaveComponent } from './save';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { RichText } from '@wordpress/editor';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * If there is a custom save, we need to put the default save into
 * `deprecated` so that existing blocks can be updated to the custom save.
 */
export const getEmbedDeprecatedMigrations = ( attributes, options ) => {
	const deprecated = [
		{
			attributes,
			save( { attributes } ) {
				const { url, caption, type, providerNameSlug } = attributes;

				if ( ! url ) {
					return null;
				}

				const embedClassName = classnames( 'wp-block-embed', {
					[ `is-type-${ type }` ]: type,
					[ `is-provider-${ providerNameSlug }` ]: providerNameSlug,
				} );

				return (
					<figure className={ embedClassName }>
						{ `\n${ url }\n` /* URL needs to be on its own line. */ }
						{ ! RichText.isEmpty( caption ) && <RichText.Content tagName="figcaption" value={ caption } /> }
					</figure>
				);
			},
		},
	];
	if ( undefined === options.save ) {
		return deprecated;
	}
	return [
		{
			attributes,
			save: getEmbedSaveComponent( {} ),
		},
		 ...deprecated
	];
};
