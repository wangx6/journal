(function($){
	'use strict';

	var 

	_config = {
		_TO_MANY_REQUEST_TIME 	: 4000,
		_REQUEST_TIME 			: 60000
	},
	_input,
	_riverFlow = null,
	_body = $('body'),
	_cache = [],


	/*	request data from the server
	*	@param N/A
	*/
	_requestData = function(){
		'use strict';

		// possible security issue
		// input  = {};
		// input._token = _getToken();

		$.ajax({
			url: 'data/data.php',
			statusCode: {
				429: function(){
					_riverFlow = setTimeout( function(){ requestData(); }, _config._TO_MANY_REQUEST_TIME );
				}
			}
		})
		.done(function(data){
			if (data.status == 429) _riverFlow = setTimeout( function(){ requestData(); }, _config._TO_MANY_REQUEST_TIME );
			_buildRiver( 'google' , data.response );
			//_riverFlow = setTimeout( function() {  _requestData(); }, _config._REQUEST_TIME );
		});
	},


	/*	build river based on what it is for in
	*	our case localhost or localhost/google
	*	@param	{string} forWhat - e.g. localhost OR google
	*	@param 	{array} data
	*/
	_buildRiver = function( forWhat, data ){
		'use strict';

		var i, j, temp, c = 0;

		for(i in data){
			if (c === 10) break; 
			for(j in data[i]){
				if(c === 10) break;
				temp = data[i][j];
				_cache.push( {
					obj:{
						id 		: temp.id,
						heading : temp.title,
						excerpt : temp.excerpt,
						images  : temp.images
					}, 
					new: 1 
				} );
				c++;
			}
		}
		console.log(_cache);
		_createHTML();
		
	},

	_createHTML = function(){
		'use strict';

		var i,article;

		for(i in _cache){
			if (_cache[i].new === 0) continue;
			article = new Article( _cache[i].obj, _body );
			_cache[i].new = 0;
		}
	},

	_getToken = function(){ return 'token for anti-xxs'; };

	_requestData();

})(jQuery);


