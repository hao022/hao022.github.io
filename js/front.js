/* global $this: true */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "animationsSlider" }] */

if ($.cookie('themeCSSpath')) {
  $('link#theme-stylesheet').attr('href', $.cookie('themeCSSpath'))
}
if ($.cookie('themeLayout')) {
  $('body').addClass($.cookie('themeLayout'))
}

$(function () {
  sliderHomepage()
  sliders()
  fullScreenContainer()
  productDetailGallery(4000)
  navigationDropdowns()
  themeControl()
  productDetailSizes()
  utils()
  animations()
  counters()
  demo()
  contactFormAjax()
})

// Ajax contact
function contactFormAjax () {
  const form = $('.contact-form-ajax')
  if (typeof form === 'undefined') return false
  form.submit(function () {
    $this = $(this)
    $.post($(this).attr('action'),
      $this.serialize(),
      function () {
        $this[0].reset() // clear form

        $('#contact-message')
          .html('<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>Thank you for getting in touch. We will get back to you soon!</div>')
          .fadeIn()
      }
      , 'json')
    return false
  })
}

/* for demo purpose only - can be deleted */
function demo () {
  if ($.cookie('themeCSSpath')) {
    $('link#theme-stylesheet').attr('href', $.cookie('themeCSSpath'))
  }

  $('#colour').change(function () {
    if ($(this).val() !== '') {
      const themeCSSpath = 'css/style.' + $(this).val() + '.css'

      $('link#theme-stylesheet').attr('href', themeCSSpath)

      $.cookie('themeCSSpath', themeCSSpath, { expires: 365, path: '/' })
    }

    return false
  })

  $('#layout').change(function () {
    if ($(this).val() !== '') {
      const themeLayout = $(this).val()

      $('body').removeClass('wide')
      $('body').removeClass('boxed')

      $('body').addClass(themeLayout)

      $.cookie('themeLayout', themeLayout, { expires: 365, path: '/' })
    }

    return false
  })
}

/* slider homepage */
function sliderHomepage () {
  if ($('#slider').length) {
    // var owl = $('#slider')

    $('#slider').owlCarousel({
      autoPlay: 3000,
      items: 4,
      itemsDesktopSmall: [900, 3],
      itemsTablet: [600, 3],
      itemsMobile: [500, 2]
    })
  }
}

/* sliders */
function sliders () {
  if ($('.owl-carousel').length) {
    $('.customers').owlCarousel({
      items: ($('.customers').attr('data-items') || 6),
      slideSpeed: ($('.customers').attr('data-slide-speed') || 2000),
      paginationSpeed: ($('.customers').attr('data-pagination-speed') || 1000),
      autoPlay: $('.customers').attr('data-autoplay') === 'true',
      itemsDesktopSmall: [990, 4],
      itemsTablet: [768, 2],
      itemsMobile: [480, 1]
    })

    $('.testimonials').owlCarousel({
      items: ($('.testimonials').attr('data-items') || 4),
      slideSpeed: ($('.testimonials').attr('data-slide-speed') || 2000),
      paginationSpeed: ($('.testimonials').attr('data-pagination-speed') || 1000),
      autoPlay: $('.testimonials').attr('data-autoplay') === 'true' ? 3000 : false, // 直接设置自动播放间隔为3s
      itemsDesktopSmall: [990, 3],
      itemsTablet: [768, 2],
      itemsMobile: [480, 1]
    })

    $('.homepage').owlCarousel({
      navigation: false, // Show next and prev buttons
      navigationText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
      slideSpeed: ($('.homepage').attr('data-slide-speed') || 2000),
      paginationSpeed: ($('.homepage').attr('data-pagination-speed') || 1000),
      autoPlay: ($('.homepage').attr('data-autoplay') || 'true') === 'true' ? 3000 : false, // 直接设置自动播放间隔为3s
      stopOnHover: true,
      singleItem: true,
      lazyLoad: false,
      addClassActive: true,
      afterInit: function () {
        // animationsSlider()
      },
      afterMove: function () {
        // animationsSlider()
      }
    })
  }
}

/* Bootstrap owns dropdown state on every viewport. On desktop, pointer entry
   and exit drive the same toggle API as clicks, keeping .open and aria state
   in sync instead of mixing CSS-only hover with Bootstrap state. */
function navigationDropdowns () {
  const dropdowns = $('#navbar .navbar-nav > li.dropdown')
  const desktop = window.matchMedia('(min-width: 768px)')

  dropdowns.on('mouseenter mouseleave', function (event) {
    if (!desktop.matches) return

    const dropdown = $(this)
    const shouldOpen = event.type === 'mouseenter'
    if (dropdown.hasClass('open') !== shouldOpen) {
      dropdown.children('.dropdown-toggle').first().dropdown('toggle')
    }
  })
}

/* The critical theme choice is applied inline in <head> to avoid a flash.
   This function owns the interactive controls once the DOM is ready. */
function themeControl () {
  const storageKey = 'huatuo-theme'
  const root = document.documentElement
  const toggle = document.querySelector('[data-theme-toggle]')
  if (!toggle) return
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  const icon = toggle.querySelector('use')
  const menu = toggle.parentElement.querySelector('.theme-menu')
  const options = Array.from(menu.querySelectorAll('[data-theme-value]'))
  const themeLinks = document.querySelectorAll('[data-theme-link]')
  let preference = storedTheme() || 'dark'

  function storedTheme () {
    try {
      const theme = window.localStorage.getItem(storageKey)
      return ['light', 'dark', 'auto'].includes(theme) ? theme : null
    } catch {
      return null
    }
  }

  function applyTheme () {
    const theme = preference === 'auto'
      ? (systemTheme.matches ? 'dark' : 'light')
      : preference

    root.dataset.theme = theme
    options.forEach(function (option) {
      const active = option.dataset.themeValue === preference
      option.setAttribute('aria-pressed', String(active))
      if (active) {
        icon.setAttribute('href', option.querySelector('use').getAttribute('href'))
        const label = toggle.dataset.label + ' (' + option.querySelector('.theme-option-label').textContent + ')'
        toggle.setAttribute('aria-label', label)
        toggle.title = label
      }
    })

    themeLinks.forEach(function (link) {
      const url = new URL(link.href)
      url.searchParams.set('theme', theme)
      link.href = url.toString()
    })
  }

  applyTheme()
  root.setAttribute('data-theme-controls-ready', '')

  options.forEach(function (option) {
    option.addEventListener('click', function () {
      preference = option.dataset.themeValue
      try {
        window.localStorage.setItem(storageKey, preference)
      } catch {
        // Keep the selected preference in memory when storage is unavailable.
      }
      applyTheme()
      toggle.focus()
    })
  })

  // Bootstrap 3's dropdown keyboard handler only navigates links, not buttons.
  toggle.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    event.stopPropagation()
    if (!toggle.parentElement.classList.contains('open')) $(toggle).dropdown('toggle')
    options[event.key === 'ArrowDown' ? 0 : options.length - 1].focus()
  })

  menu.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
      // Let the focused button handle Space without Bootstrap closing the menu first.
      event.stopPropagation()
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    if (event.key === 'Escape') {
      $(toggle).dropdown('toggle')
      toggle.focus()
      return
    }
    const index = options.indexOf(document.activeElement)
    let next = event.key === 'ArrowUp' ? index - 1 : index + 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = options.length - 1
    options[(next + options.length) % options.length].focus()
  })

  const followSystem = function () {
    if (preference === 'auto') applyTheme()
  }
  if (systemTheme.addEventListener) {
    systemTheme.addEventListener('change', followSystem)
  } else {
    systemTheme.addListener(followSystem)
  }

  window.addEventListener('storage', function (event) {
    if (event.key === storageKey || event.key === null) {
      preference = storedTheme() || 'dark'
      applyTheme()
    }
  })
}

/* animations */
function animations () {
  let delayTime = 0
  $('[data-animate]').css({ opacity: '0' })
  $('[data-animate]').waypoint(function () {
    delayTime += 150
    $(this).delay(delayTime).queue(function (next) {
      $(this).toggleClass('animated')
      $(this).toggleClass($(this).data('animate'))
      delayTime = 0
      next()
      // $(this).removeClass('animated')
      // $(this).toggleClass($(this).data('animate'))
    })
  }, {
    offset: '90%',
    triggerOnce: true
  })

  $('[data-animate-hover]').hover(function () {
    $(this).css({ opacity: 1 })
    $(this).addClass('animated')
    $(this).removeClass($(this).data('animate'))
    $(this).addClass($(this).data('animate-hover'))
  }, function () {
    $(this).removeClass('animated')
    $(this).removeClass($(this).data('animate-hover'))
  })
}

function animationsSlider () {
  let delayTimeSlider = 400

  $('.owl-item:not(.active) [data-animate-always]').each(function () {
    $(this).removeClass('animated')
    $(this).removeClass($(this).data('animate-always'))
    $(this).stop(true, true, true).css({ opacity: 0 })
  })

  $('.owl-item.active [data-animate-always]').each(function () {
    delayTimeSlider += 500

    $(this).delay(delayTimeSlider).queue(function () {
      $(this).addClass('animated')
      $(this).addClass($(this).data('animate-always'))

      console.log($(this).data('animate-always'))
    })
  })
}

/* counters */
function counters () {
  $('.counter').counterUp({
    delay: 10,
    time: 1000
  })
}

/* picture zoom */
function pictureZoom () {
  $('.product .image, .post .image, .photostream div').each(function () {
    const imgHeight = $(this).find('img').height()
    if (imgHeight) {
      $(this).height(imgHeight)
    }
  })
}

/* full screen intro */
function fullScreenContainer () {
  const screenWidth = $(window).width() + 'px'
  let screenHeight = '500px'

  if ($(window).height() > 500) {
    screenHeight = $(window).height() + 'px'
  }

  $('#intro, #intro .item').css({
    width: screenWidth,
    height: screenHeight
  })
}

function utils () {
  /* tooltips */
  $('[data-toggle="tooltip"]').tooltip()

  /* click on the box activates the radio */
  $('#checkout').on('click', '.box.shipping-method, .box.payment-method', function () {
    const radio = $(this).find(':radio')
    radio.prop('checked', true)
  })

  /* click on the box activates the link in it */
  $('.box.clickable').on('click', function () {
    window.location = $(this).find('a').attr('href')
  })

  /* external links in new window */
  $('.external').on('click', function (e) {
    e.preventDefault()
    window.open($(this).attr('href'))
  })

  /* animated scrolling */
  $('.scroll-to, .scroll-to-top').click(function (event) {
    const fullUrl = this.href
    const parts = fullUrl.split('#')

    if (parts.length > 1) {
      scrollTo(fullUrl)
      event.preventDefault()
    }
  })

  function scrollTo (fullUrl) {
    const parts = fullUrl.split('#')
    const trgt = parts[1]
    const targetOffset = $('#' + trgt).offset()
    let targetTop = targetOffset.top - 100

    if (targetTop < 0) {
      targetTop = 0
    }

    $('html, body').animate({
      scrollTop: targetTop
    }, 1000)
  }
}

/* product detail gallery */
function productDetailGallery (confDetailSwitch) {
  $('.thumb:first').addClass('active')
  let timer = setInterval(autoSwitch, confDetailSwitch)

  $('.thumb').click(function (e) {
    switchImage($(this))
    clearInterval(timer)
    timer = setInterval(autoSwitch, confDetailSwitch)
    e.preventDefault()
  })

  $('#mainImage').hover(function () {
    clearInterval(timer)
  }, function () {
    timer = setInterval(autoSwitch, confDetailSwitch)
  })

  function autoSwitch () {
    let nextThumb = $('.thumb.active').closest('div').next('div').find('.thumb')
    if (nextThumb.length === 0) {
      nextThumb = $('.thumb:first')
    }
    switchImage(nextThumb)
  }

  function switchImage (thumb) {
    $('.thumb').removeClass('active')
    const bigUrl = thumb.attr('href')
    thumb.addClass('active')
    $('#mainImage img').attr('src', bigUrl)
  }
}

/* product detail sizes */
function productDetailSizes () {
  $('.sizes a').click(function (e) {
    e.preventDefault()
    $('.sizes a').removeClass('active')
    $('.size-input').prop('checked', false)
    $(this).addClass('active')
    $(this).next('input').prop('checked', true)
  })
}

$.fn.alignElementsSameHeight = function () {
  $('.same-height-row').each(function () {
    let maxHeight = 0
    let children = $(this).find('.same-height')
    children.height('auto')

    if ($(window).width() > 768) {
      children.each(function () {
        if ($(this).innerHeight() > maxHeight) {
          maxHeight = $(this).innerHeight()
        }
      })
      children.innerHeight(maxHeight)
    }

    maxHeight = 0
    children = $(this).find('.same-height-always')
    children.height('auto')
    children.each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).innerHeight()
      }
    })
    children.innerHeight(maxHeight)
  })
}

let windowWidth
$(function () {
  windowWidth = $(window).width()

  $(this).alignElementsSameHeight()
  pictureZoom()
})

$(window).resize(function () {
  const newWindowWidth = $(window).width()

  if (windowWidth !== newWindowWidth) {
    setTimeout(function () {
      $(this).alignElementsSameHeight()
      fullScreenContainer()
      pictureZoom()
    }, 205)
    windowWidth = newWindowWidth
  }
})
