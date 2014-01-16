var require = {
		baseUrl : 'module/',
		paths : {
			jquery : 'libraries/jquery/jquery-2.0.0.min',
			underscore : 'libraries/underscore/underscore.min',
			handlebars : 'libraries/handlebars/handlebarshelpers',
			handlebarshelpers :'libraries/handlebars/handlebars',
			css : 'libraries/require/css',
			normalize : 'libraries/require/normalize',
			async : 'libraries/require/async',
			text : 'libraries/require/text'
		},
		shim : {
			'backbone' : {
				deps : [ 'underscore', 'jquery' ],
				exports : 'Backbone'
			},
			'handlebars' : {
				deps : [ 'handlebarshelpers' ]
			},
			'persistence' : {
				exports : 'Lawnchair'
			},
			'animate' : {
				deps : [ 'jquery' ],
			},
			'uimenu' : {
				deps : [ 'uiwidget'],
			}
		},
		waitSeconds : 60,
		/* urlArgs: "v=0.25",  */
		deps : ['app/js/apploader']
};