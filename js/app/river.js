!function($){
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

		var path = _getPath();
		$.ajax({
			url: _pathMap[path] || _pathMap['default'],
			complete: function(xhr, textStatus) {
		        if(xhr.status == 429) _riverFlow = _repeatAction( _config._TO_MANY_REQUEST_TIME );
		        console.log(xhr.status, textStatus);
		    }
		})
		.done(function(data){
			data = _filterData(path, data);
			_buildRiver( path , data.response.articles );
			_riverFlow = _repeatAction( _config._REQUEST_TIME );
		})
		.fail(function(){
			clearTimeout(_riverFlow);
			_requestData();
		});
	},


	/*	build river based on what it is for in
	*	our case localhost or localhost/google
	*	@param	{string} forWhat - e.g. localhost OR google
	*	@param 	{array} data
	*/
	_buildRiver = function( forWhat, data ){

		var 
		i, v, c = 0, news, article;

		for(i in data){
			v = data[i];
			if(c === 10) break;
			if(!_cache[v.id]){
				news = {
					id 		: v.id,
					time 	: v.date,
					heading	: v.title,
					excerpt	: v.excerpt,
					content : v.content,
					images	: v.images 
				};
				article = new Article( news, _body );
				_cache[v.id] = article;
			}
			c++;
		}
		
			
		
		//console.log(Object.keys(_cache).length);
	},

	_repeatAction = function(time){
		return setTimeout( function(){ _requestData(); }, time );
	},

	_filterData = function(option, data){
		
		var filter = {
			google: (function(){
				/**
				*	TODO: add filter mechanism to identify the type data required 
				*/
				return data;
			})(),
			default: (function(){
				return data;
			})()
		};
		return filter[option] || filter['default'];
	},

	_getPath = function(){

		var 
		pathname = location.pathname.split('/');
		return pathname[pathname.length - 2];
	};

	_requestData();

}(jQuery);


