!function(window,$){
	'use strict';
	
	var 

	/* 	artical class
	*	@param {object} news 
	* 	
	*	return this (chain)
	*/
	Article = function( news, body ){

		this.body = body;
		this.id = news.id;
		this.wrap = $('<div>',{ class:'news-ctnr' });
		this.imgCtnr = $('<div>',{ class:'img-ctnr' });
		this.images = [];
		this.heading = null;
		this.content = null;
		this.timeStamp = null;
		this.excerpt = null;
		this.readMore = null;

		this.alive( news );
	};


	// HANDLER
	Article.prototype.alive = function( news ) {

		var self = this;

		if(!news || !news.heading || !news.excerpt || !news.images) return this;
		this.heading = $('<h3>').html(news.heading);
		this.timeStamp = $('<span>').html(news.time);
		this.excerpt = $('<p>').html(news.excerpt);
		this.readMore = $('<span>')
			.addClass('read-more-btn')
			.html('read more')
			.on('click',function(){ 
				self.content.toggle(); 
				$(this).text($(this).text() == 'read more' ? 'read less' : 'read more');
			})
		this.content = $('<p>').html(news.content).hide();
		this.images = news.images;
		this.organizeImages( this.images );
		this.wrap
			.attr('data',this.id)
			.append(this.heading)
			.append(this.timeStamp)
			.append(this.excerpt)
			.append(this.readMore)
			.append(this.content)
			.append(this.imgCtnr)
			.prependTo(this.body).hide().fadeIn();
			
		return this;
	};


	/* 	HANDLER
	*  	@param {array} images
	*/
	Article.prototype.organizeImages = function( images ){

		var 

		self = this, i;

		if(!images) return this;
		for( i in images ){
			if(images[i].width >= 400){
				$('<img>')
					.attr('src',images[i].image).appendTo(this.imgCtnr)
					.attr('image',images[i].image);
				break;
			}
		}
		return this;
	}

	window.Article = Article;

}(window,jQuery);
