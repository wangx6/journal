(function($){
	'use strict';

	var 

	_config = {
		_TO_MANY_REQUESTS_TIME 	: 4000,
		_REQUEST_TIME 			: 7000
	},
	_riverFlow = null,
	_body = $('body'),
	_cache = [],
	_path = '',
	_pathMap = {
		google: '../data/data.php',
		'default':'data/data.php'
	},


	/*	request data from the server
	*	@param N/A
	*/
	_requestData = function(){
		'use strict';		

		var path = _getPath();
		$.ajax({
			url: _pathMap[path] || _pathMap['default'],
			complete: function(xhr, textStatus) {
		        if(xhr.status == 429) _riverFlow = _repeatAction( _config._TO_MANY_REQUEST_TIME );
		    }
		})
		.done(function(data){
			_buildRiver( path , data.response.articles );
			_riverFlow = _repeatAction( _config._REQUEST_TIME );
		});
	},


	/*	build river based on what it is for in
	*	our case localhost or localhost/google
	*	@param	{string} forWhat - e.g. localhost OR google
	*	@param 	{array} data
	*/
	_buildRiver = function( forWhat, data ){
		'use strict';

		var 
		i, c = 0, news, article;

		for(i in data){
			if(c === 10) break;
			if(!_cache[data[i].id]){
				news = {
					id 		: data[i].id,
					time 	: data[i].date,
					heading	: data[i].title,
					excerpt	: data[i].excerpt,
					images	: data[i].images 
				};
				article = new Article( news, _body );
				_cache[data[i].id] = article;
			}
			c++;
		}
		console.log(Object.keys(_cache).length);
	},

	_repeatAction = function(time){
		return setTimeout( function(){ _requestData(); }, time );
	},

	_getPath = function(){
		'use strict';

		var 

		pathname = location.pathname.split('/');
		return pathname[pathname.length - 2];
	};

	_requestData();

})(jQuery);


