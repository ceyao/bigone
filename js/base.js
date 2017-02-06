


if ($('.cate-trigger').length > 0) {
        $('.cate-trigger').click(function(){
            //$('.search-js-cancel-trigger').click();
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $('.cate-modal').removeClass('active');
                $('.cate-background').removeClass('active');
            } else {
                $(this).addClass('on');
                $('.cate-modal').addClass('active');
                $('.cate-background').addClass('active');
            }
        });
        $('.cate-background,.cate-modal .close-btn').click(function(){
            $('.cate-trigger').removeClass('on');
            $('.cate-modal').removeClass('active');
            $('.cate-background').removeClass('active');
        });
    }
	


    $('.float-nav-trigger').click(function(){
        $(window).scrollTop(0);
    });
   
	var wh=$(window).height();
    $(window).scroll(function(){
        var now = $(window).scrollTop();
        if ( now > wh) {
			$('.float-nav').addClass('affix');
            if ($('.float-nav').hasClass('affix') && !$('.float-nav').hasClass('onscroll')) {
                $('.float-nav').addClass('onscroll');
            }
        }else{
			$('.float-nav').removeClass('affix');
			}
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            $('.float-nav').removeClass('onscroll');
        }, 250));
    });

var local_time=wh-45-162;
$(".local-time").css("height",local_time);


var resetSearch =  function(){
        $('.search-header .suggestion-modal').addClass('hidden');
    };
    if ($('.search-js-trigger').length > 0) {
        // default search bar
        if ($('header.detail').length > 0) {
            $('.search-js-trigger').click(function(){
                if ($(this).hasClass('on')) {
                    $(this).removeClass('on');
                    $('.search-header').addClass('hidden');
                    $('header.detail').removeClass('hidden');
                    $('.search-header .input-area').blur();
                    resetSearch();
                } else {
                    $(this).addClass('on');
                    $('.search-header').removeClass('hidden');
                    $('header.detail').addClass('hidden');
                    $('.search-header .input-area').focus();
                }
            });
        } else {
            $('.search-js-trigger').click(function(){
                if ($(this).hasClass('on')) {
                    $(this).removeClass('on');
                    $('.search-header').addClass('hidden');
                    $('.sub-header').removeClass('hidden');
                    $('.search-header .input-area').blur();
                    resetSearch();
                } else {
                    $(this).addClass('on');
                    $('.search-header').removeClass('hidden');
                    $('.sub-header').addClass('hidden');
                    if (window.DM.list !== 'search') {
                        $('.search-header .input-area').focus();
                    }
                    if ($('.search-header .input-area').val() !== '') {
                        $('.search-header .search-delete-trigger').removeClass('hidden');
                    }
                }
            });
        }
        $('.search-js-cancel-trigger').click(function(){
            if ($('header.detail').length > 0) {
                $('.search-js-trigger').removeClass('on');
                $('.search-header').addClass('hidden');
                $('header.detail').removeClass('hidden');
            } else {
                if (window.DM.list !== 'search') {
                    $('.search-js-trigger').removeClass('on');
                    $('.search-header').addClass('hidden');
                    $('.sub-header').removeClass('hidden');
                } else {
                    oldfunc.goBack();        
                }
            }
            resetSearch();
        });
        $('.search-delete-trigger').click(function(){
            $('.search-header .input-area').val('');
            $('.search-header .suggestion-modal').addClass('hidden');
            $('.search-header .input-area').focus();
            $(this).addClass('hidden');
        });
        $('.search-header form').submit(function(){
            $('.search-js-cancel-trigger').click(); 
        });
        $('.search-header .suggestion-modal .result-list').on('click', '.item a', function(){
            $('.search-js-cancel-trigger').click(); 
        });

        var ajax_search_request = null;
        $('.search-header .input-area').on('input', function(){
            var keywords = $(this).val();
            var inputObj = $(this);
            if (keywords.length >= 1) {
                // go search
                var search_url = config.my_config.api.search;
                var get_data = {'keywords': keywords};
                var result_html = '';
                if(ajax_search_request != null){
                    ajax_search_request.abort();
                }
                ajax_search_request = $.getJSON(search_url, get_data).done(function(data){
                    // succ
                    var current_domain = window.DM.mobileHost + (window.DM.lang === 'en'?'':'/cn');
                    if (data.data.searchAmazon){
                        result_html = '';
                        $.each(data.data.searchAmazon, function(i,item){
                            var search_url = current_domain + '/search?q='+item;
                            if (window.DM.lang) {
                                search_url += '&lang='+window.DM.lang;
                            }
                            if (window.DM.mode) {
                                search_url += '&v='+window.DM.mode;
                            }
                            result_html += '<li class="item"><a href="'+search_url+'" class="link-md">'+item+'</a></li>';
                        });
                        $('.search-header .suggestion-modal .result-deal .result-list').html(result_html);
                    } else {
                        $('.search-header .suggestion-modal .result-store').addClass('hidden');
                    }
                    if (data.data.searchStore){
                        result_html = '';
                        $.each(data.data.searchStore, function(i,item){
                            var search_url = current_domain + '/search?q='+item.store_name;
                            if (window.DM.lang) {
                                search_url += '&lang='+window.DM.lang;
                            }
                            if (window.DM.mode) {
                                search_url += '&v='+window.DM.mode;
                            }
                            search_url += '&store=1';
                            result_html += '<li class="item"><a class="link-md" href="'+search_url+'"><img src="'+item.logo_url+'">'+item.store_name+'</a></li>';
                        });
                        if (result_html === '') {
                            $('.search-header .suggestion-modal .result-store').addClass('hidden');
                        } else {
                            $('.search-header .suggestion-modal .result-store .result-list').html(result_html);
                            $('.search-header .suggestion-modal .result-store').removeClass('hidden');
                        }
                    } else {
                        $('.search-header .suggestion-modal .result-store').addClass('hidden');
                    }
                    //if (data.data.searchAmazon.length === 0) {
                    //    var result_text = '未找到相关结果';
                    //    if (window.DM.lang === 'en') {
                    //        result_text = 'Can\'t find result'; 
                    //    }
                    //    result_html = '<li class="item"><a href="javascript:;" class="link-md">'+result_text+'</a></li>';
                    //    $('.search-header .suggestion-modal .result-deal .result-list').html(result_html);
                    //}
                    if ((data.data.searchAmazon && data.data.searchAmazon.length !== 0) || (data.data.searchStore && data.data.searchStore.length !== 0 )) {
                        $('.search-header .suggestion-modal').removeClass('hidden');
                    } else {
                        $('.search-header .suggestion-modal').addClass('hidden');
                    }
                    if(inputObj.val()==''){
                        $('.search-header .suggestion-modal').addClass('hidden');
                    }
                }).fail(function(){
                    //var result_text = '未找到相关结果';
                    //if (window.DM.lang === 'en') {
                    //    result_text = 'Can\'t find result'; 
                    //}
                    //result_html = '<li class="item"><a href="javascript:;" class="link-md">'+result_text+'</a></li>';
                    //$('.search-header .suggestion-modal .result-deal .result-list').html(result_html);
                    //$('.search-header .suggestion-modal').removeClass('hidden');
                });
            } else {
                $('.search-header .suggestion-modal').addClass('hidden');    
            }
            if (keywords.length >= 1) {
                $('.search-delete-trigger').removeClass('hidden');
            } else {
                $('.search-delete-trigger').addClass('hidden');
            }
        });
    }



var TouchSlide=function(a){a=a||{};var opts={slideCell:a.slideCell||"#touchSlide",titCell:a.titCell||".hd li",mainCell:a.mainCell||".bd",effect:a.effect||"left",autoPlay:a.autoPlay||false,delayTime:a.delayTime||200,interTime:a.interTime||6000,defaultIndex:a.defaultIndex||0,titOnClassName:a.titOnClassName||"on",autoPage:a.autoPage||false,prevCell:a.prevCell||".prev",nextCell:a.nextCell||".next",pageStateCell:a.pageStateCell||".pageState",pnLoop:a.pnLoop=="undefined "?true:a.pnLoop,startFun:a.startFun||null,endFun:a.endFun||null,switchLoad:a.switchLoad||null};var slideCell=document.getElementById(opts.slideCell.replace("#",""));if(!slideCell){return false}var obj=function(str,parEle){str=str.split(" ");var par=[];parEle=parEle||document;var retn=[parEle];for(var i in str){if(str[i].length!=0){par.push(str[i])}}for(var i in par){if(retn.length==0){return false}var _retn=[];for(var r in retn){if(par[i][0]=="#"){_retn.push(document.getElementById(par[i].replace("#","")))}else{if(par[i][0]=="."){var tag=retn[r].getElementsByTagName("*");for(var j=0;j<tag.length;j++){var cln=tag[j].className;if(cln&&cln.search(new RegExp("\\b"+par[i].replace(".","")+"\\b"))!=-1){_retn.push(tag[j])}}}else{var tag=retn[r].getElementsByTagName(par[i]);for(var j=0;j<tag.length;j++){_retn.push(tag[j])}}}}retn=_retn}return retn.length==0||retn[0]==parEle?false:retn};var wrap=function(el,v){var tmp=document.createElement("div");tmp.innerHTML=v;tmp=tmp.children[0];var _el=el.cloneNode(true);tmp.appendChild(_el);el.parentNode.replaceChild(tmp,el);conBox=_el;return tmp};var getStyleVal=function(el,attr){var v=0;if(el.currentStyle){v=el.currentStyle[attr]}else{v=getComputedStyle(el,false)[attr]}return parseInt(v.replace("px",""))};var addClass=function(ele,className){if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))!=-1)){return}ele.className+=(ele.className?" ":"")+className};var removeClass=function(ele,className){if(!ele||!className||(ele.className&&ele.className.search(new RegExp("\\b"+className+"\\b"))==-1)){return}ele.className=ele.className.replace(new RegExp("\\s*\\b"+className+"\\b","g"),"")};var effect=opts.effect;var prevBtn=obj(opts.prevCell,slideCell)[0];var nextBtn=obj(opts.nextCell,slideCell)[0];var pageState=obj(opts.pageStateCell)[0];var conBox=obj(opts.mainCell,slideCell)[0];if(!conBox){return false}var conBoxSize=conBox.children.length;var navObj=obj(opts.titCell,slideCell);var navObjSize=navObj?navObj.length:conBoxSize;var sLoad=opts.switchLoad;var index=parseInt(opts.defaultIndex);var delayTime=parseInt(opts.delayTime);var interTime=parseInt(opts.interTime);var autoPlay=(opts.autoPlay=="false"||opts.autoPlay==false)?false:true;var autoPage=(opts.autoPage=="false"||opts.autoPage==false)?false:true;var loop=(opts.pnLoop=="false"||opts.pnLoop==false)?false:true;var oldIndex=index;var inter=null;var timeout=null;var endTimeout=null;var startX=0;var startY=0;var distX=0;var distY=0;var dist=0;var isTouchPad=(/hp-tablet/gi).test(navigator.appVersion);var hasTouch="ontouchstart" in window&&!isTouchPad;var touchStart=hasTouch?"touchstart":"mousedown";var touchMove=hasTouch?"touchmove":"";var touchEnd=hasTouch?"touchend":"mouseup";var slideH=0;var slideW=conBox.parentNode.clientWidth;var twCell;var scrollY;var tempSize=conBoxSize;if(navObjSize==0){navObjSize=conBoxSize}if(autoPage){navObjSize=conBoxSize;navObj=navObj[0];navObj.innerHTML="";var str="";if(opts.autoPage==true||opts.autoPage=="true"){for(var i=0;i<navObjSize;i++){str+="<li>"+(i+1)+"</li>"}}else{for(var i=0;i<navObjSize;i++){str+=opts.autoPage.replace("$",(i+1))}}navObj.innerHTML=str;navObj=navObj.children}if(effect=="leftLoop"){tempSize+=2;conBox.appendChild(conBox.children[0].cloneNode(true));conBox.insertBefore(conBox.children[conBoxSize-1].cloneNode(true),conBox.children[0])}twCell=wrap(conBox,'<div class="tempWrap" style="overflow:hidden; position:relative;"></div>');conBox.style.cssText="width:"+tempSize*slideW+"px;"+"position:relative;overflow:hidden;padding:0;margin:0;";for(var i=0;i<tempSize;i++){conBox.children[i].style.cssText="display:table-cell;vertical-align:top;width:"+slideW+"px"}var doStartFun=function(){if(typeof opts.startFun=="function"){opts.startFun(index,navObjSize)}};var doEndFun=function(){if(typeof opts.endFun=="function"){opts.endFun(index,navObjSize)}};var doSwitchLoad=function(moving){var curIndex=(effect=="leftLoop"?index+1:index)+moving;var changeImg=function(ind){var img=conBox.children[ind].getElementsByTagName("img");for(var i=0;i<img.length;i++){if(img[i].getAttribute(sLoad)){img[i].setAttribute("src",img[i].getAttribute(sLoad));img[i].removeAttribute(sLoad)}}};changeImg(curIndex);if(effect=="leftLoop"){switch(curIndex){case 0:changeImg(conBoxSize);break;case 1:changeImg(conBoxSize+1);
break;case conBoxSize:changeImg(0);break;case conBoxSize+1:changeImg(1);break}}};var orientationChange=function(){slideW=twCell.clientWidth;conBox.style.width=tempSize*slideW+"px";for(var i=0;i<tempSize;i++){conBox.children[i].style.width=slideW+"px"}var ind=effect=="leftLoop"?index+1:index;translate(-ind*slideW,0)};window.addEventListener("resize",orientationChange,false);var translate=function(dist,speed,ele){if(!!ele){ele=ele.style}else{ele=conBox.style}ele.webkitTransitionDuration=ele.MozTransitionDuration=ele.msTransitionDuration=ele.OTransitionDuration=ele.transitionDuration=speed+"ms";ele.webkitTransform="translate("+dist+"px,0)"+"translateZ(0)";ele.msTransform=ele.MozTransform=ele.OTransform="translateX("+dist+"px)"};var doPlay=function(isTouch){switch(effect){case"left":if(index>=navObjSize){index=isTouch?index-1:0}else{if(index<0){index=isTouch?0:navObjSize-1}}if(sLoad!=null){doSwitchLoad(0)}translate((-index*slideW),delayTime);oldIndex=index;break;case"leftLoop":if(sLoad!=null){doSwitchLoad(0)}translate(-(index+1)*slideW,delayTime);if(index==-1){timeout=setTimeout(function(){translate(-navObjSize*slideW,0)},delayTime);index=navObjSize-1}else{if(index==navObjSize){timeout=setTimeout(function(){translate(-slideW,0)},delayTime);index=0}}oldIndex=index;break}doStartFun();endTimeout=setTimeout(function(){doEndFun()},delayTime);for(var i=0;i<navObjSize;i++){removeClass(navObj[i],opts.titOnClassName);if(i==index){addClass(navObj[i],opts.titOnClassName)}}if(loop==false){removeClass(nextBtn,"nextStop");removeClass(prevBtn,"prevStop");if(index==0){addClass(prevBtn,"prevStop")}else{if(index==navObjSize-1){addClass(nextBtn,"nextStop")}}}if(pageState){pageState.innerHTML="<span>"+(index+1)+"</span>/"+navObjSize}};doPlay();if(autoPlay){inter=setInterval(function(){index++;doPlay()},interTime)}if(navObj){for(var i=0;i<navObjSize;i++){(function(){var j=i;navObj[j].addEventListener("click",function(e){clearTimeout(timeout);clearTimeout(endTimeout);index=j;doPlay()})})()}}if(nextBtn){nextBtn.addEventListener("click",function(e){if(loop==true||index!=navObjSize-1){clearTimeout(timeout);clearTimeout(endTimeout);index++;doPlay()}})}if(prevBtn){prevBtn.addEventListener("click",function(e){if(loop==true||index!=0){clearTimeout(timeout);clearTimeout(endTimeout);index--;doPlay()}})}var tStart=function(e){clearTimeout(timeout);clearTimeout(endTimeout);scrollY=undefined;distX=0;var point=hasTouch?e.touches[0]:e;startX=point.pageX;startY=point.pageY;conBox.addEventListener(touchMove,tMove,false);conBox.addEventListener(touchEnd,tEnd,false)};var tMove=function(e){if(hasTouch){if(e.touches.length>1||e.scale&&e.scale!==1){return}}var point=hasTouch?e.touches[0]:e;distX=point.pageX-startX;distY=point.pageY-startY;if(typeof scrollY=="undefined"){scrollY=!!(scrollY||Math.abs(distX)<Math.abs(distY))}if(!scrollY){e.preventDefault();if(autoPlay){clearInterval(inter)}switch(effect){case"left":if((index==0&&distX>0)||(index>=navObjSize-1&&distX<0)){distX=distX*0.4}translate(-index*slideW+distX,0);break;case"leftLoop":translate(-(index+1)*slideW+distX,0);break}if(sLoad!=null&&Math.abs(distX)>slideW/3){doSwitchLoad(distX>-0?-1:1)}}};var tEnd=function(e){if(distX==0){return}e.preventDefault();if(!scrollY){if(Math.abs(distX)>slideW/10){distX>0?index--:index++}doPlay(true);if(autoPlay){inter=setInterval(function(){index++;doPlay()},interTime)}}conBox.removeEventListener(touchMove,tMove,false);conBox.removeEventListener(touchEnd,tEnd,false)};conBox.addEventListener(touchStart,tStart,false)};


TouchSlide({ 
					slideCell:"#slideBox",
					titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
					mainCell:".bd ul", 
					effect:"leftLoop", 
					autoPage:true,//自动分页
					autoPlay:true //自动播放
				});




//all comment
var commentnav=[];
$comment_gutitle=$(".comment-all-box .comment-title");

function calScrollTop(){
    $(window).scrollTop(0);
    if($comment_gutitle.size()>0){
        $comment_gutitle.each(function(){
            var nto=$(this).offset().top;
			commentnav.splice(commentnav.push(nto),1);
        });
    }
};
calScrollTop();

var myScroll = function(){
	ZTscrollTop=$(window).scrollTop();
	if(ZTscrollTop<commentnav[0])	{
			$comment_gutitle.removeClass("fixed")
	}else{
		if(ZTscrollTop>=commentnav[quanjui]){
		//alert(commentnav[quanjui]);
		$comment_gutitle.removeClass("fixed").eq(quanjui).addClass("fixed");
		quanjui++;
		}else if(ZTscrollTop>=commentnav[0]){
		quanjui--;
		if(quanjui<0)quanjui=0;
		$comment_gutitle.removeClass("fixed").eq(quanjui).addClass("fixed");	
		}
	}
};

var quanjui=0;
var ZTscrollTop=0;

$(window).bind('scroll.my', myScroll);







