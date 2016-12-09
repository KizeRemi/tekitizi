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

Tekitizy.setup = function (imgSelector, opts) {
  $(document).ready(function () {
    var tekitizy = new Tekitizy(imgSelector, opts)
    tekitizy.setup()
    tekitizy.actionPause()
  })
}

/* Initializing the slider */
Tekitizy.prototype.setup = function () {
  this.drawCarroussel(this.carroussel_id)
  this.appendZoomBtn(this.selector, this.clickZoomBtn)
  this.indexImages()
  if (this.thumbnails) {
    this.drawThumbNails()
  } // ...
  this.listenToButtons()
  if (this.auto) {
    this.actionPlay()
  }
}

/* Events of each buttons */
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

  if (this.thumbnails) {
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

/* Construction of slider */
Tekitizy.prototype.drawCarroussel = function (id) {
  var carroussel = ''

  carroussel += '<div class="tekitizy-carroussel" id=' + id + '>'
  carroussel += '<div class="tekitizy-image-slider">'
  carroussel += '<div class="tekitizy-list-container"></div>'
  carroussel += '</div>'
  carroussel += '<i class="fa fa-window-close-o tekitizy-button tekitizy-close-btn" aria-hidden="true"></i>'
  if (this.options.prevNext) {
    carroussel += '<i class="fa fa-arrow-right tekitizy-button tekitizy-next-btn" aria-hidden="true"></i>'
    carroussel += '<i class="fa fa-arrow-left tekitizy-button tekitizy-prev-btn" aria-hidden="true"></i>'
  }
  if (this.options.play) {
    carroussel += '<i class="fa fa-play-circle-o tekitizy-button tekitizy-play-btn" aria-hidden="true"></i>'
    carroussel += '<i class="fa fa-pause-circle-o tekitizy-button tekitizy-pause-btn" aria-hidden="true"></i>'
  }
  carroussel += '</div>'
  carroussel += '<div class="tekitizy-image-title tekitizy-carroussel-closed"></div>'
  carroussel += '</div>'
  carroussel += '</div>'
  this.carroussel = $(carroussel)
  this.carroussel.appendTo($('body'))
}

/* Add all images in tekitizy container */
Tekitizy.prototype.drawImages = function (id) {
  var _this = this
  var margin = $('.tekitizy-image-slider').width()
  $.each(_this.listImg, function (key, value) {
    $('.tekitizy-list-container').append('<div class="tekitizy-image-container"><img class="tekitizy-image-content" data-index="' + key + '" src="' + value.src + '"></div>').width()
    $('.tekitizy-image-container').last().css('margin-left', margin * key)
  })
  $('.tekitizy-image-container').css('width', margin)
}

/* Construction of thumbnails */
Tekitizy.prototype.drawThumbNails = function () {
  var _this = this
  $('.tekitizy-carroussel').append('<div class="tekitizy-thumbnail"><div class="thumbnail-list-container"></div></div>')
  $('.tekitizy-thumbnail').append('<div class="tekitizy-chevron-left"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>')
  $.each(_this.listImg, function (key, value) {
    if (key % 3 === 0) {
      _this.page = key / 3
    }
    $('.thumbnail-list-container').append('<div class="tekitizy-thumbnail-image-container"><img class="tekitizy-thumbnail-image-content" data-page="' + _this.page + '" data-index="' + key + '" src="' + value.src + '"></div>')
  })
  var width = $('.tekitizy-thumbnail-image-container').width()
  $('.thumbnail-list-container').css('width', width * (_this.listImg.length) + 10 * _this.listImg.length)
  _this.page = 0
  $('.tekitizy-thumbnail').append('<div class="tekitizy-chevron-right"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>')
}

/* Add a zoom in each image in element */
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
    _this.listImg.push({ src: zoom.attr('data-src'), title: title })
  })
}

  // affiche une image
Tekitizy.prototype.actionShow = function (zoom) {
  this.carroussel.addClass('tekitizy-carroussel-open')
  this.carroussel.removeClass('tekitizy-carroussel-closed')
  var index = zoom.attr('data-index')
  this.index = index
  var margin = $('.tekitizy-image-slider').width()
  $('.tekitizy-image-title').html(this.listImg[index].title)
  $('.tekitizy-list-container').css('margin-left', '-' + margin * index + 'px')
}

Tekitizy.prototype.actionNext = function () {
  var _this = this
  var index = parseInt(this.index) + 1
  if (this.listImg[index]) {
    if (this.thumbnails) {
      $('.tekitizy-thumbnail-image-content[data-index="' + this.index + '"]').css('opacity', '0.5')
    }
    if (this.effect) {
      $('.tekitizy-list-container').animate({
        marginLeft: '-' + index * 100 + '%'
      }, 500)
    } else {
      $('.tekitizy-list-container').css('margin-left', '-' + index * 100 + '%')
    }
    $('.tekitizy-image-title').html(this.listImg[index].title)
    this.index = index
    if (this.thumbnails) {
      $('.tekitizy-thumbnail-image-content[data-index="' + index + '"]').css('opacity', '1')
      if (index % 3 === 0) {
        _this.actionThumbPage()
      }
    }
  }
}

Tekitizy.prototype.actionPrev = function () {
  var index = parseInt(this.index) - 1
  var _this = this
  if (this.listImg[index]) {
    if (this.thumbnails) {
      $('.tekitizy-thumbnail-image-content[data-index="' + this.index + '"]').css('opacity', '0.5')
    }
    if (this.effect) {
      $('.tekitizy-list-container').animate({
        marginLeft: '-' + index * 100 + '%'
      }, 500)
    } else {
      $('.tekitizy-list-container').css('margin-left', '-' + index * 100 + '%')
    }

    $('.tekitizy-image-title').html(this.listImg[index].title)
    this.index = index
    if (this.thumbnails) {
      $('.tekitizy-thumbnail-image-content[data-index="' + index + '"]').css('opacity', '1')
      if (index % 3 === 2) {
        _this.actionThumbPage()
      }
    }
  }
}

Tekitizy.prototype.actionPlay = function () {
  this.actionPause()
  var _this = this
  this.player = setInterval(function () {
    if (_this.listImg.length - 1 === parseInt(_this.index)) {
      _this.index = -1
    }
    _this.actionNext()
  }, _this.imageDuration * 1000)
}

Tekitizy.prototype.actionPause = function () {
  this.auto = false
  clearInterval(this.player)
}

Tekitizy.prototype.actionClose = function () {
  this.actionPause()
  this.carroussel.removeClass('tekitizy-carroussel-open')
  this.carroussel.addClass('tekitizy-carroussel-closed')
}

Tekitizy.prototype.actionShowThumb = function (index) {
  this.actionPause()
  $('.tekitizy-thumbnail-image-content[data-index="' + this.index + '"]').css('opacity', '0.5')
  this.index = index
  if (this.effect) {
    $('.tekitizy-list-container').animate({
      marginLeft: '-' + index * 100 + '%'
    }, 500)
  } else {
    $('.tekitizy-list-container').css('margin-left', '-' + index * 100 + '%')
  }
  $('.tekitizy-thumbnail-image-content[data-index="' + this.index + '"]').css('opacity', '1')
}

Tekitizy.prototype.actionThumbPage = function () {
  var _this = this
  var currentPage = $('.tekitizy-thumbnail-image-content[data-index="' + _this.index + '"]').attr('data-page')
  _this.page = currentPage
  $('.thumbnail-list-container').animate({
    marginLeft: '-' + currentPage * 100 + '%'
  }, 500)
}

Tekitizy.prototype.actionThumbNext = function () {
  var maxPage = Math.ceil(this.listImg.length / 3)
  this.actionPause()
  if (parseInt(this.page) + 1 < maxPage) {
    this.page = parseInt(this.page) + 1
  }
  var _this = this
  $('.thumbnail-list-container').animate({
    marginLeft: '-' + _this.page * 100 + '%'
  }, 500)
}

Tekitizy.prototype.actionThumbPrev = function () {
  this.actionPause()
  if (parseInt(this.page) - 1 >= 0) {
    this.page = parseInt(this.page) - 1
  }
  var _this = this
  $('.thumbnail-list-container').animate({
    marginLeft: '-' + _this.page * 100 + '%'
  }, 500)
}
