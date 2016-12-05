function Tekitizy (selector, options) {
  this.selector = selector
  if (options && options.hasOwnProperty('carroussel_id')) {
    this.carroussel_id = options.carroussel_id
  } else {
    this.carroussel_id = 'tekitizy_carroussel'
  }
  this.index = 0
  // this.selector <- selector (paramètre)
  // this.carrousel_id <- 'tekitizy_carroussel' ou options.carroussel_id
}

// Tekitizy.setup('.post img',{ carrousse_id: 'my-tekitizy' })
// Tekitizy.setup('.post img')
Tekitizy.setup = function (imgSelector, opts) {
  $(document).ready(function () {
    var tekitizy
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
    // image
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
  var i = 1
  $('.tekitizy-container').each(function () {
    $(this).find('.tekitizy-open-btn').attr('data-index', i)
    i++
  })
}

// affiche une image
Tekitizy.prototype.actionShow = function (zoom) {
  this.carroussel.addClass('tekitizy-carroussel-open')
  var index = zoom.attr('data-index')
  this.index = index
  var url = zoom.prev().attr('src')
  $('.tekitizy-image-content').attr('src', url)
}

Tekitizy.prototype.actionNext = function () {
  var _this = this

  var index = parseInt(_this.index) + 1

  var nextimg = $('.tekitizy-open-btn[data-index="' + index + '"]')

  if (nextimg[0]) {
    var nextimgsrc = nextimg.prev().attr('src')
    $('.tekitizy-image-content').attr('src', nextimgsrc)
    _this.index = index
  }
}

Tekitizy.prototype.actionPrev = function () {
  var _this = this

  var index = parseInt(_this.index) - 1

  var previmg = $('.tekitizy-open-btn[data-index="' + index + '"]')

  if (previmg[0]) {
    var previmgsrc = previmg.prev().attr('src')
    $('.tekitizy-image-content').attr('src', previmgsrc)
    _this.index = index
  }
}

Tekitizy.prototype.actionPlay = function () {

}

Tekitizy.prototype.actionPause = function () {

}

Tekitizy.prototype.actionClose = function () {
  this.carroussel.removeClass('tekitizy-carroussel-open')
}

// Tekitizy.setup('.post img',{ 'carroussel_id': 'my-tekitizy-carroussel' })
