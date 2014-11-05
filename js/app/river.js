(function($){
	'use strict';

	var 

	_config = {
		_TO_MANY_REQUESTS_TIME 	: 4000,
		_REQUEST_TIME 			: 4000
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
			statusCode: {
				429: function(){
					_riverFlow = setTimeout( function(){ requestData(); }, _config._TO_MANY_REQUEST_TIME );
				}
			}
		})
		.done(function(data){
			if (data.status == 429) _riverFlow = setTimeout( function(){ requestData(); }, _config._TO_MANY_REQUEST_TIME );
			_buildRiver( path , data.response.articles );
			_riverFlow = setTimeout( function() {  _requestData(); }, _config._REQUEST_TIME );
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
		i, j, z , news, 
		article, arr = [], idFound = false;

		arr = _cache;

		for(i in data){
			if(arr.length === 10) break;

			idFound = false;
			for(z in arr){
				if(data[i].id == arr[z].id){
					idFound = true;	
					break;
				} 
			}

			if(!idFound){
				news = {
					id 		: data[i].id,
					time 	: data[i].date,
					heading	: data[i].title,
					excerpt	: data[i].excerpt,
					images	: data[i].images 
				};
				article = new Article( news, _body );
				_cache.push(article);
			}
		}
	},

	_getPath = function(){
		'use strict';

		var 

		pathname = location.pathname.split('/'),
		return pathname[pathname.length - 2];
	};

	_requestData();

})(jQuery);


