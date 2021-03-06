const headerBottom = $('.header').offset().top + $('.header').height();
const navBarHeight = $('.navBarBackground').offset().top + $('.navBarBackground').height();
  
$(".navBarBackground").css("opacity", 0);

$(window).on('scroll', function() {

  // we round here to reduce a little workload
  stop = Math.round($(window).scrollTop());
  if (($(".navBarBackground").css("opacity") == 0) && (stop > headerBottom - navBarHeight)) { 
    $(".navBarBackground").css("background", $(".header").css("background")); 
    $(".navBarBackground").animate({opacity: 1}, 400);
  } else if (($(".navBarBackground").css("opacity") == 1) && (stop <= headerBottom - navBarHeight)) {
    $(".navBarBackground").animate({opacity: 0}, 200);
  }
});

