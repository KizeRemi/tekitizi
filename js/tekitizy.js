function Tekitizy (selector, options) {
  this.selector = selector
  this.options = options
  if (options && options.hasOwnProperty('carroussel_id')) {
    this.carroussel_id = options.carroussel_id
  } else {
    this.carroussel_id = 'tekitizy_carroussel'
  }
  this.options = options
  this.index = 0
  this.listImg = []
  this.page = 0
  this.effect = options.effect
  this.auto = options.autoPlay
  this.imageDuration = options.imageDuration
  this.thumbnails = options.thumbnails
}

// Tekitizy.setup('.post img',{ carrousse_id: 'my-tekitizy' })
// Tekitizy.setup('.post img')
Tekitizy.setup = function (imgSelector, opts) {
  $(document).ready(function () {
    var tekitizy = new Tekitizy(imgSelector, opts)
    tekitizy.setup()
  })
}

Tekitizy.prototype.setup = function () {
  this.drawCarroussel(this.carroussel_id)
  this.appendZoomBtn(this.selector, this.clickZoomBtn)
  this.indexImages()
  if(this.thumbnails){
    this.drawThumbNails()
  } // ...
  this.listenToButtons()
  if (this.auto) {
    this.actionPlay()
  }
}

Tekitizy.prototype.listenToButtons = function () {
  var _this = this
  $('.tekitizy-open-btn').on('click', function () {
    _this.actionShow($(this))
    if (_this.options.autoPlay) {
      _this.actionPlay()
    }
    _this.drawImages()
  })

  $('.tekitizy-close-btn').on('click', function () {
    _this.actionPause()
    _this.actionClose()
  })

  $('.tekitizy-next-btn').on('click', function () {
    _this.actionPause()
    _this.actionNext()
  })

  $('.tekitizy-prev-btn').on('click', function () {
    _this.actionPause()
    _this.actionPrev()
  })

  $('.tekitizy-play-btn').on('click', function () {
    if (!_this.auto) {
      _this.actionPlay()
    }
  })

  $('.tekitizy-pause-btn').on('click', function () {
    _this.actionPause()
  })

  if(this.thumbnails){
    $('.tekitizy-chevron-left').on('click', function () {
      _this.actionThumbPrev()
    })

    $('.tekitizy-chevron-right').on('click', function () {
      _this.actionThumbNext()
    })   

    $('.tekitizy-thumbnail-image-content').on('click', function () {
      var index = $(this).attr('data-index')
      _this.actionShowThumb(index)
    })  
  }
}

Tekitizy.prototype.drawCarroussel = function (id) {
  var carroussel = ''

  carroussel += '<div class="tekitizy-carroussel" id=' + id + '>'
  carroussel += '<div class="tekitizy-image-slider">'
  carroussel += '<div class="tekitizy-list-container"></div>'
  carroussel += '</div>'
  carroussel += '<img class="tekitizy-button tekitizy-close-btn" src="../images/croix_rouge.png">'
  if (this.options.prevNext) {
    carroussel += '<img class="tekitizy-button tekitizy-next-btn" src="../images/next.png">'
    carroussel += '<img class="tekitizy-button tekitizy-prev-btn" src="../images/prev.png">'
  }
  if (this.options.play) {
    carroussel += '<img class="tekitizy-button tekitizy-play-btn" src="../images/play.png">'
    carroussel += '<img class="tekitizy-button tekitizy-pause-btn" src="../images/pause.png">'
  }
  carroussel += '</div>'
  carroussel += '<div class="tekitizy-image-title"></div>'
  carroussel += '</div>'
  carroussel += '</div>'
  // Ajouter les boutons, la figure ..
  this.carroussel = $(carroussel)
  this.carroussel.appendTo($('body'))
}

Tekitizy.prototype.drawImages= function (id) {
  _this = this
  var margin = $('.tekitizy-image-slider').width()
  $.each( _this.listImg, function( key, value ) {
    $('.tekitizy-list-container').append('<div class="tekitizy-image-container"><img class="tekitizy-image-content" data-index="'+key+'" src="'+value.src+'"></div>').width()
    $('.tekitizy-image-container').last().css('margin-left', margin*key)
  });
}

Tekitizy.prototype.drawThumbNails= function () {
  _this = this
  $('.tekitizy-carroussel').append('<div class="tekitizy-thumbnail"><div class="thumbnail-list-container"></div></div>')
  $('.tekitizy-thumbnail').append('<div class="tekitizy-chevron-left"><i class="fa fa-chevron-left tekitizy-chevron-left" aria-hidden="true"></i></div>')
  $.each( _this.listImg, function( key, value ) {
    if( key%3 == 0){
      _this.page = key/3
    }
    $('.thumbnail-list-container').append('<div class="tekitizy-thumbnail-image-container"><img class="tekitizy-thumbnail-image-content" data-page="'+ _this.page +'" data-index="'+key+'" src="'+value.src+'"></div>')
  });
  _this.page = 0
  $('.tekitizy-thumbnail').append('<div class="tekitizy-chevron-right"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>')

}


Tekitizy.prototype.appendZoomBtn = function (selector) {
  $(selector).each(function () {
    var $el
    var imageSrc
    $el = $(this)
    imageSrc = $el.attr('src')
    $el.wrap('<div></div>') // image
      .parent() // container
        .addClass('tekitizy-container') // container
        .append('<i class="tekitizy-open-btn fa fa-search" data-src="' + imageSrc + '"  aria-hidden="true"></i>')
  })
}
 
Tekitizy.prototype.indexImages = function () {
  var i = 0
  var _this = this
  $('.tekitizy-container').each(function () {
    var zoom = $(this).find('.tekitizy-open-btn')
    zoom.attr('data-index', i)
    i++
    var title = $(this).find('img').attr('alt')
    _this.listImg.push({src: zoom.attr('data-src'), title: title  })
  })
}

  // affiche une image
Tekitizy.prototype.actionShow = function (zoom) {
  this.carroussel.addClass('tekitizy-carroussel-open')
  var index = zoom.attr('data-index')
  this.index = index
  var margin = $('.tekitizy-image-slider').width()
  $('.tekitizy-list-container').css('margin-left', '-'+margin*index+'px')
}

Tekitizy.prototype.actionNext = function () {
  _this = this
  var index = parseInt(this.index) + 1
  var margin =  $('.tekitizy-image-slider').width()
  if (this.listImg[index]) {
    if(this.thumbnails){
      $('.tekitizy-thumbnail-image-content[data-index="'+this.index+'"]').css('opacity','0.5')
    }
    if(this.effect){
      $( ".tekitizy-list-container" ).animate({
          marginLeft: '-'+index*100+'%'
      }, 500);    
    } else {
      $( ".tekitizy-list-container" ).css('margin-left' , '-'+index*100+'%')        
    }
    $('.tekitizy-image-title').html(this.listImg[index].title)
    this.index = index
    if(this.thumbnails){
      $('.tekitizy-thumbnail-image-content[data-index="'+index+'"]').css('opacity','1')
      if(index%3 == 0){
      _this.actionThumbPage()      
      }
    }
  }
}

Tekitizy.prototype.actionPrev = function () {
  var index = parseInt(this.index) - 1
  var margin = $('.tekitizy-image-slider').width()
  if (this.listImg[index]) {
    if(this.thumbnails){
      $('.tekitizy-thumbnail-image-content[data-index="'+this.index+'"]').css('opacity','0.5')
    }
    if(this.effect){
      $( ".tekitizy-list-container" ).animate({
          marginLeft: '-'+index*100+'%'
      }, 500);    
    } else {
      $( ".tekitizy-list-container" ).css('margin-left' , '-'+index*100+'%')        
    }

    $('.tekitizy-image-title').html(this.listImg[index].title)
    this.index = index
    if(this.thumbnails){
      $('.tekitizy-thumbnail-image-content[data-index="'+index+'"]').css('opacity','1')
      if(index%3 == 2){
      _this.actionThumbPage()      
      }
    }
  }
}

Tekitizy.prototype.actionPlay = function () {
  this.actionPause()
  var _this = this
  this.player = setInterval(function () {
    if (_this.listImg.length - 1 == _this.index) {
      _this.index = -1
    }
    _this.actionNext()
  }, _this.imageDuration * 1000)
}

Tekitizy.prototype.actionPause = function () {
  this.auto = false;
  clearInterval(this.player)
}

Tekitizy.prototype.actionClose = function () {
  this.actionPause()
  this.carroussel.removeClass('tekitizy-carroussel-open')
}

Tekitizy.prototype.actionShowThumb = function (index) {
  this.actionPause()
  $('.tekitizy-thumbnail-image-content[data-index="'+this.index+'"]').css('opacity','0.5')
  this.index = index
  var margin = $('.tekitizy-image-slider').width()
  if(this.effect){
    $( ".tekitizy-list-container" ).animate({
        marginLeft: '-'+index*100+'%'
    }, 500);    
  } else {
    $( ".tekitizy-list-container" ).css('margin-left' , '-'+index*100+'%')        
  }
  $('.tekitizy-thumbnail-image-content[data-index="'+this.index+'"]').css('opacity','1')
}

Tekitizy.prototype.actionThumbPage = function () {
  var margin = $('.tekitizy-thumbnail').width()
  _this = this
  var currentPage= $('.tekitizy-thumbnail-image-content[data-index="'+_this.index+'"]').attr('data-page')
  _this.page = currentPage
  $( ".thumbnail-list-container" ).animate({
      marginLeft: '-'+currentPage*100+'%'
  }, 500);
}

Tekitizy.prototype.actionThumbNext = function () {
  var maxPage = Math.ceil(this.listImg.length/3)
  this.actionPause()
  var margin = $('.tekitizy-thumbnail').width()
  _this = this
  if(this.page+1 < maxPage){
    _this.page = _this.page + 1
    $( ".thumbnail-list-container" ).animate({
        marginLeft: '-'+_this.page*100+'%'
    }, 500);   
  }
}

Tekitizy.prototype.actionThumbPrev = function () {
  this.actionPause()
  var maxPage = Math.ceil(this.listImg.length/3)
  var margin = $('.tekitizy-thumbnail').width()
  _this = this
  if(this.page-1 >= 0){
    _this.page = _this.page-1
    $( ".thumbnail-list-container" ).animate({
        marginLeft: '-'+_this.page*100+'%'
    }, 500);
  }

}
