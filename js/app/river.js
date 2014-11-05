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

		$.ajax({
			url: _pathMap[_getPath()] || _pathMap['default'],
			statusCode: {
				429: function(){
					_riverFlow = setTimeout( function(){ requestData(); }, _config._TO_MANY_REQUEST_TIME );
				}
			}
		})
		.done(function(data){
			if (data.status == 429) _riverFlow = setTimeout( function(){ requestData(); }, _config._TO_MANY_REQUEST_TIME );
			_buildRiver( 'google' , data.response );
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
		i, j,z , temp, c = 0, news, 
		article, arr = [], idFound = false;

		arr = _cache;

		for(i in data){
			if (c === 10) break; 
			for(j in data[i]){
				if(c === 10) break;
				temp = data[i][j];
				idFound = false;

				for(z in arr){
					if(temp.id == arr[z].id){
						idFound = true;	
						break;
					} 
				}

				if(!idFound){
					news = {
						id 	    : temp.id,
						time 	: temp.date,
						heading : temp.title,
						excerpt : temp.excerpt,
						images  : temp.images 
					};
					article = new Article( news, _body );
					_cache.push(article);
				}
				c++;
			}
		}	
	},

	_getPath = function(){
		'use strict';

		var 

		pathname = location.pathname.split('/'),
		lastParam = pathname[pathname.length - 2];
		return lastParam;
	};

	_requestData();

})(jQuery);


