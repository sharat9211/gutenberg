( function() {
	// Set up a data store to fetch a preview from the plugin's API
	// so we can test that the selectors are used correctly by the embed blocks.
	const { data, apiFetch, hooks } = wp;
	const { registerStore } = data;
	const { addFilter } = hooks;

	const DEFAULT_STATE = {
		preview: false,
	};

	const actions = {
		setPreview( preview ) {
			return {
				type: 'SET_PREVIEW',
				preview,
			};
		},
		fetchFromAPI( path ) {
			return {
				type: 'FETCH_FROM_API',
				path,
			};
		},
	};

	registerStore( 'extend-embeds', {
		reducer( state = DEFAULT_STATE, action ) {
			switch ( action.type ) {
				case 'SET_PREVIEW':
					return {
						...state,
						preview: action.preview,
					};
			}

			return state;
		},

		actions,

		selectors: {
			getPreview( state ) {
				const { preview } = state;
				return preview;
			},
			isFetchingPreview() {
				return select( 'extend-embeds' ).isResolving( 'extend-embeds', 'getPreview' );
			},
		},

		controls: {
			FETCH_FROM_API( action ) {
				return apiFetch( { path: action.path } );
			},
		},

		resolvers: {
			* getPreview() {
				const path = '/extend-embeds/v1/preview/';
				const preview = yield actions.fetchFromAPI( path );
				return actions.setPreview( preview );
			},
		},
	} );

	// Register a filter that adds the components and selectors to the target embed block.

} )();