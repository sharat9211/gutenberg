/**
 * Internal dependencies
 */

import { LINE_SEPARATOR } from './special-characters';
import { normaliseFormats } from './normalise-formats';
import { getLineIndex } from './get-line-index';
import { getParentLineIndex } from './get-parent-line-index';
import { getLastChildIndex } from './get-last-child-index';

/**
 * Outdents any selected list items if possible.
 *
 * @param {Object} value Value to change.
 *
 * @return {Object} The changed value.
 */
export function outdentListItems( value ) {
	const { text, formats, start, end } = value;
	const startingLineIndex = getLineIndex( value, start );

	// Return early if the starting line index cannot be further outdented.
	if ( formats[ startingLineIndex ] === undefined ) {
		return value;
	}

	const newFormats = formats.slice( 0 );
	const parentFormats = formats[ getParentLineIndex( value, startingLineIndex ) ] || [];
	const endingLineIndex = getLineIndex( value, end );
	const lastChildIndex = getLastChildIndex( value, endingLineIndex );

	// Outdent all list items from the starting line index until the last child
	// index of the ending list. All children of the ending list need to be
	// outdented, otherwise they'll be orphaned.
	for ( let index = startingLineIndex; index <= lastChildIndex; index++ ) {
		// Skip indices that are not line separators.
		if ( text[ index ] !== LINE_SEPARATOR ) {
			continue;
		}

		// Omit the indentation level where the selection starts.
		newFormats[ index ] = parentFormats.concat(
			newFormats[ index ].slice( parentFormats.length + 1 )
		);

		if ( newFormats[ index ].length === 0 ) {
			delete newFormats[ index ];
		}
	}

	return normaliseFormats( {
		text,
		formats: newFormats,
		start,
		end,
	} );
}
