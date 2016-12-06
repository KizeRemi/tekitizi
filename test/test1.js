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
  this.auto = options.autoPlay
  this.imageDuration = options.imageDuration
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
  this.listenToButtons()
  this.indexImages()
  if (this.auto) {
    this.actionPlay()
  }
  // ...
}

Tekitizy.prototype.listenToButtons = function () {
  var _this = this
  $('.tekitizy-open-btn').on('click', function () {
    _this.actionShow($(this))
    if (_this.options.autoPlay) {
      _this.actionPlay()
    }
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
}

Tekitizy.prototype.drawCarroussel = function (id) {
  var carroussel = ''

  carroussel += '<div class="tekitizy-carroussel" id=' + id + '>'
  carroussel += '<div class="tekitizy-image-container">'
  carroussel += '<img class="tekitizy-image-content" src="">'
  if (this.options.effect) {
    carroussel += '<img class="tekitizy-image-slide" src="">'
  }
  carroussel += '<div class="tekitizy-image-title"></div>'
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
  // Ajouter les boutons, la figure ..
  this.carroussel = $(carroussel)
  this.carroussel.appendTo($('body'))
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
  var url = this.listImg[index].src
  $('.tekitizy-image-content').attr('src', url)
  $('.tekitizy-image-title').html(this.listImg[index].title)
  if (this.options.effect) {
    var nextIndex = 0
    if (this.listImg[parseInt(index) + 1]) {
      nextIndex = parseInt(index) + 1
    }
    var urlSlide = this.listImg[nextIndex].src
    $('.tekitizy-image-slide').attr('src', urlSlide)
  }
}

Tekitizy.prototype.actionNext = function () {
  var index = parseInt(this.index) + 1

  if (this.listImg[index]) {
    if (this.options.effect) {
      this.slideEffect()
    } else {
      var nextImgSrc = this.listImg[index].src
      $('.tekitizy-image-content').attr('src', nextImgSrc)
    }

    $('.tekitizy-image-title').html(this.listImg[index].title)
    this.index = index
  }
}

Tekitizy.prototype.actionPrev = function () {
  var index = parseInt(this.index) - 1

  if (this.listImg[index]) {
    var prevImgSrc = this.listImg[index].src
    $('.tekitizy-image-content').attr('src', prevImgSrc)
    $('.tekitizy-image-title').html(this.listImg[index].title)
    this.index = index
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

Tekitizy.prototype.slideEffect = function () {
  var _this = this
  var marginLeft = parseInt($('.tekitizy-image-content').css('marginLeft'))
  var contentLeft = 2 * (marginLeft - $('.tekitizy-image-content').width())
  $('.tekitizy-image-slide').css('display', 'inline-block')

  $('.tekitizy-image-content').animate({
    marginLeft: contentLeft,
  }, 600, function () {
    var contentSrc = $('.tekitizy-image-slide').attr('src')
    $('.tekitizy-image-content').attr('src', contentSrc).css('marginLeft', marginLeft)

    var index = 0
    if (_this.listImg[_this.index + 1]) {
      index = _this.index + 1
    }

    var slideSrc = _this.listImg[index].src

    $('.tekitizy-image-slide').attr('src', slideSrc).css('display', 'none')
  })
}
