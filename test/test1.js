function Tekitizy (selector, options) {
  this.selector = selector
  if (options && options.hasOwnProperty('carroussel_id')) {
    this.carroussel_id = options.carroussel_id
  } else {
    this.carroussel_id = 'tekitizy_carroussel'
  }
  this.index = 0
  this.listImg = []
  this.prevNext = options.prevNext
  this.play = options.play
  this.auto = options.autoPlay
  this.imageDuration = options.imageDuration
  this.effect = options.effect
  // this.selector <- selector (paramètre)
  // this.carrousel_id <- 'tekitizy_carroussel' ou options.carroussel_id
}

// Tekitizy.setup('.post img',{ carrousse_id: 'my-tekitizy' })
// Tekitizy.setup('.post img')
Tekitizy.setup = function (imgSelector, opts) {
  $(document).ready(function () {
    tekitizy = new Tekitizy(imgSelector, opts)
    tekitizy.setup()
  })
}

Tekitizy.prototype.setup = function () {
  this.drawCarroussel(this.carroussel_id)
  this.appendZoomBtn(this.selector, this.clickZoomBtn)
  this.listenToButtons()
  this.indexImages()
  // ...
}

Tekitizy.prototype.listenToButtons = function () {
  // this -> instance Tekitizy
  var _this = this
  $('.tekitizy-open-btn').on('click', function () {
    // this -> noeud
    // _this -> instance Tekitizy
    _this.actionShow($(this))
  })

  $('.tekitizy-close-btn').on('click', function () {
    _this.actionClose()
  })

  $('.tekitizy-next-btn').on('click', function () {
    _this.actionNext()
  })

  $('.tekitizy-prev-btn').on('click', function () {
    _this.actionPrev()
  })

  $('.tekitizy-play-btn').on('click', function () {
    _this.actionPlay()
  })

  $('.tekitizy-pause-btn').on('click', function () {
    _this.actionPause()
  })
}

Tekitizy.prototype.drawCarroussel = function (id) {
  var carroussel = ''

  carroussel += '<div class="tekitizy-carroussel" id=' + id + '>'
  carroussel += '<div class="tekitizy-image-container">'
  carroussel += '<img class="tekitizy-image-content" src="">'
  carroussel += '<div class="tekitizy-image-title"></div>'
  carroussel += '</div>'
  carroussel += '<img class="tekitizy-button tekitizy-close-btn" src="../images/croix_rouge.png">'
  carroussel += '<img class="tekitizy-button tekitizy-next-btn" src="../images/next.png">'
  carroussel += '<img class="tekitizy-button tekitizy-prev-btn" src="../images/prev.png">'
  carroussel += '<img class="tekitizy-button tekitizy-play-btn" src="../images/play.png">'
  carroussel += '<img class="tekitizy-button tekitizy-pause-btn" src="../images/pause.png">'
  carroussel += '</div>'
  // Ajouter les boutons, la figure ..
  this.carroussel = $(carroussel)
  this.carroussel.appendTo($('body'))
}

Tekitizy.prototype.appendZoomBtn = function (selector) {
  $(selector).each(function () {
    var $el
    var image_src
    $el = $(this)
    image_src = $el.attr('src')
    $el.wrap('<div></div>') // image
      .parent() // container
        .addClass('tekitizy-container') // container
        .append('<i class="tekitizy-open-btn fa fa-search" data-src="' + image_src + '"  aria-hidden="true"></i>')
  })
}

Tekitizy.prototype.indexImages = function () {
  var i = 0
  var _this = this
  
  $('.tekitizy-container').each(function () {
    $(this).find('.tekitizy-open-btn').attr('data-index', i)
    i++
    _this.listImg.push($(this).find('img'))
  })
}

// affiche une image
Tekitizy.prototype.actionShow = function (zoom) {
  this.carroussel.addClass('tekitizy-carroussel-open')
  var index = zoom.attr('data-index')
  this.index = index
  var url = this.listImg[index].attr('src')
  $('.tekitizy-image-content').attr('src', url)
  console.log(this)
}

Tekitizy.prototype.actionNext = function () {

  var index = parseInt(this.index) + 1
  var nextimg = $('.tekitizy-open-btn[data-index="' + index + '"]')
  if (this.listImg[index]) {
    var nextimgsrc = this.listImg[index].attr('src')
    $('.tekitizy-image-content').attr('src', nextimgsrc)
    this.index = index
  }
}

Tekitizy.prototype.actionPrev = function () {
  var index = parseInt(this.index) - 1
  var nextimg = $('.tekitizy-open-btn[data-index="' + index + '"]')
  if (this.listImg[index]) {
    var nextimgsrc = this.listImg[index].attr('src')
    $('.tekitizy-image-content').attr('src', nextimgsrc)
    this.index = index
  }
}

Tekitizy.prototype.actionPlay = function () {
  var _this = this
  var direction = 'right'
  this.auto = true
  console.log(this)
  var interval = setInterval(function() { 
    if(_this.auto == false){
      clearInterval(interval)
    }
    if(direction == 'right'){
      _this.actionNext()
      if(_this.listImg.length-1 == _this.index){
        direction = 'left';
      }
    } else {
      _this.actionPrev()
      if(0 == _this.index){
        direction = 'right';
      }
    }
  }, _this.imageDuration*1000);
}

Tekitizy.prototype.actionPause = function () {
  this.auto = false;
}

Tekitizy.prototype.actionClose = function () {
  this.carroussel.removeClass('tekitizy-carroussel-open')
}

// Tekitizy.setup('.post img',{ 'carroussel_id': 'my-tekitizy-carroussel' })
