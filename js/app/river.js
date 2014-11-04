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

		var i, j, z, article, imgCtnr, img, temp, news = [], c = 0;

		if (_cache.length === 0){
			for(i in data){
				if (c === 10) break; 
				for(j in data[i]){
					if(c === 10) break;
					
					temp = data[i][j];
					news.id = temp.id;
					news.heading = temp.title;
					news.excerpt = temp.excerpt;
					news.images = temp.images;

					article = new Article( news, _body );
					_cache.push( {obj:article, new:1 } );
					c++;
				}
			}
			console.log(_cache);
		}else {
			_flow( data );
		}
	},


	/*	new flow, dynamically refresh the incoming news
	*	@param {array} data
	*/
	_flow = function( data ){
		'use strict';

		var 

		numOfFreshNews = 0,c = 0 ,i , j;

		for(i in data){
			if (c === 10) break; 
			for(j in data[i]){
				if(c === 10) break;
				
				temp = data[i][j];
				if(temp.id == _cache[0].id) return;
					
				news.id = temp.id;
				news.heading = temp.title;
				news.excerpt = temp.excerpt;
				news.images = temp.images;

				article = new Article( news, _body );
				_cache.unshift( { obj:article , new: 1 } );
				c++;
			}
		}
	},

	_getToken = function(){ return 'token for anti-xxs'; };

	_requestData();

})(jQuery);


