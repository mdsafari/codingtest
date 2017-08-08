var $ = require('jquery');
$(document).ready(function() {
    
    var $dscr = $('.sticky_bar'),
        $switch = $('.toggle-link');
 

        
    $switch.on('click',function(){
    
    if ($dscr.is(':visible')) {
        $dscr.slideUp();
        $switch.html("+");
    } else {
        $dscr.slideDown();
        $switch.html("-");
    }
    
    
    });
        
   



});