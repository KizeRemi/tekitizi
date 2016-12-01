function Tekitizy (selector, options) {
  this.selector = selector
  if (options && options.hasOwnProperty('carroussel_id')) {
    this.carroussel_id = options.carroussel_id
  } else {
    this.carroussel_id = 'tekitizy_carroussel'
  }
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
  this.appendZoomBtn(this.selector,this.clickZoomBtn)
  this.listenToButtons()
  // ...
}

Tekitizy.prototype.listenToButtons = function () {
  // this -> instance Tekitizy
  var _this = this

  $('.tekitizy-open-btn').on('click',function () {
    // this -> noeud
    // _this -> instance Tekitizy
    _this.actionShow($(this).attr('data-src'))
  })
}

Tekitizy.prototype.drawCarroussel = function (id) {
  var carroussel = ''

  carroussel += '<div class="tekitizy-carroussel" id=' + id + '></div>'
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

// affiche une image
Tekitizy.prototype.actionShow = function (url) {
  alert(url)
  this.carroussel.addClass('tekitizy-carroussel-open')
}

Tekitizy.prototype.actionNext = function () {

}

Tekitizy.prototype.actionPrev = function () {

}

Tekitizy.prototype.actionPlay = function () {

}

Tekitizy.prototype.actionPause = function () {

}

Tekitizy.prototype.actionClose = function () {
  this.carroussel.removeClass('tekitizy-carroussel-open')
}

// Tekitizy.setup('.post img',{ 'carroussel_id': 'my-tekitizy-carroussel' })
