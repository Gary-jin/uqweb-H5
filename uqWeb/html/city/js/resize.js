
function size(){
    var width=$(window).width();
    if(width > 750){
        $('html').css('font-size',function(){
            return 200;
        });
        return;
    }else {
        $('html').css('font-size',function(){
            return 100*width/375;
        });
    }
}
size();
$(window).resize(function(){
    size();
});