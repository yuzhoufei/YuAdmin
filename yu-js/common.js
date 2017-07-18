// JavaScript Document
var common = {
	
};
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1,	//month 
		"d+": this.getDate(),		//day 
		"h+": this.getHours(),		//hour 
		"m+": this.getMinutes(),	//minute 
		"s+": this.getSeconds(),	//second 
		"q+": Math.floor((this.getMonth() + 3) / 3),	//quarter 
		"S": this.getMilliseconds()	//millisecond 
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	};
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	};
	return format;
};
/*
示例：
alert(new Date().format("yyyy年MM月dd日")); 
alert(new Date().format("MM/dd/yyyy")); 
alert(new Date().format("yyyyMMdd")); 
alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
*/
(function($){
	$.common={};
	
	$.common.inpTrim = function(ele){	//表单控件头尾去空格
		$(ele).each(function(index,element){
			$(element).blur(function(){
				trimVal = $(element).val();
				$(this).val($.trim(trimVal));
			});
		});
	};
	
	$.common.menuActive = function(tn){	//菜单选中项样式
		$('div.menu dl').children().each(function(index,element){
			if($(element).children().attr('tn')==tn){
				$(this).children().addClass('active');
			};
		});
	};
	
	$.common.menuList = function(aUrl,atn){	//菜单
		$.ajax({url:aUrl,success:function(result){
			var html = '';
            for(var i = 0; i < result.menu.length; i++)
            {
                html += '<dt><a class="f-toe" tn="'+ result.menu[i].tn +'" href="'+ result.menu[i].link +'">'+ result.menu[i].htext +'</a></dt>';
            	for(var r = 0; r < result.menu[i].child.length; r++){
                	html += '<dd><a class="f-toe" tn="'+ result.menu[i].child[r].tn +'" href="'+ result.menu[i].child[r].link +'">'+ result.menu[i].child[r].htext +'</a></dd>';
            	};
            };
            $('.container .menu dl').append(html);
            $('.container .menu dl').children().each(function(index,element){
            	if($(element).children().html()=='首页'||$(element).children().html()=='HOME'){
					$(element).children().css('cursor','pointer');
					$(element).children().addClass('link');
				};
            });
            $.common.menuActive(atn);
            $.common.minHeight();
		}});
	};
	
	/*
	HTML：
	<dt><a class="f-csp f-toe" tn="0" href="index.html">HOME</a></dt>
	<dt><a class="f-csd f-toe" href="javascript:;">DEMO</a></dt>
	<dd><a class="f-toe" tn="11" href="list.html">LIST</a></dd>
	Json格式：
	{"menu":[
		{"htext":"HOME","link":"index.html","tn":"0","child":""},
		{"htext":"DEMO","link":"javascript:;","tn":"1","child":[{"htext":"LIST","link":"list.html","tn":"11"},{"htext":"FORM","link":"form.html","tn":"12"}]}
		]
	}
	*/
	
	$.common.pageVal = function(ele){	//分页控件文本域校验-需获得最大行号
		$(ele).each(function(index,element){
			$(element).blur(function(){
				var number=$(this).val();
				if(parseInt(number)!=number || number<=0){
					$(this).val('');
				};
            });
		});
	};
	
	$.common.layerBg = function(){	//formLayer弹出层背景
		$('body').prepend('<div class="layer_bg"></div>');
		$('.layer_bg').css('height',$.common.bodyHeight());
		$(window).resize(function(){
			$('.layer_bg').css('height',$.common.bodyHeight());
		});
	}
	
	$.common.formLayer = function(ele){	//弹出层表单
		$.common.layerBg();
		$(ele).show();
		$(ele).css('margin-top',-parseInt($(ele).height()/2));
		var del=function(){
			$('.layer_bg').remove();
			$(ele).hide();
		};
		$(ele).find('p a.close').click(function(){
			del();
		});
	};
	
	$.common.minHeight = function(){	//页面最小高度控制
		//左侧菜单最小高度
		$('.menu').css('min-height',$(window).height()-$('.shortcut').height()-$('.shortcut').css('border-bottom-width').replace('px',''));
		//页面内容区域最小高度等于左侧菜单高度
		$('.main').css('min-height',$('.menu').height()-$('.main').css('padding-top').replace('px','')-$('.main').css('padding-bottom').replace('px',''));
	};
	
	$.common.bodyHeight = function(){	//页面高度
		var WH=$(window).height();
		var retH;
		if($('body').height()<WH){
			retH = WH+'px';
		} else {
			retH = $('body').height()+'px';
		}
		return retH;
	};
	
	$.common.week=function(str){	//星期转换
		if(str==null){
			str = '-';
		} else {
			str = '周' + str.replace(/\,/g,"/");
			str = str.replace("1","一");
			str = str.replace("2","二");
			str = str.replace("3","三");
			str = str.replace("4","四");
			str = str.replace("5","五");
			str = str.replace("6","六");
			str = str.replace("7","日");
		}
		return str;
	};
	
	$.common.backTop=function(element){	//返回顶部
        $(element).hide();
        $(window).scroll(function(){
                if($(window).scrollTop()<150)
                {
                        $(element).hide();
                }
                else
                {
                        $(element).show();
                }
        });
        $(element).click(function(){
                $('body,html').animate({scrollTop:0},'fast');
        });
	};
	
	$.fn.InputAssociate=function(options){	//输入联想功能
		var param=$.extend(false,$.fn.InputAssociate.defaults,options);
		$(this).each(function(index,element){
			$(element).keyup(function(){
				var thisInp = $(element);
				$('.associate').remove();
				$(element).parent().prepend('<ul class="associate"></ul>');
				$('.associate').css('top',param.eleTop);
				$('.associate').css('left',param.eleLeft);
				$('.associate').width(parseInt($(element).width())+parseInt($(element).css('padding-left').replace('px',''))+parseInt($(element).css('padding-right').replace('px','')));
				$('.associate').show();
				param.fnAjax(thisInp);
			});
			$(element).keyup(function(event){
				event.stopPropagation();
			});
			$('.Wdate').click(function(){
				$('.associate').hide();
			});
			$(document).click(function(){
				$('.associate').hide();
			});
			$(window).resize(function(){
				$('.associate').width(parseInt($(element).width())+parseInt($(element).css('padding-left').replace('px',''))+parseInt($(element).css('padding-right').replace('px','')));
			});
		});
	};
	$.fn.InputAssociate.defaults={
		eleTop:'35px',
		eleLeft:'0px',
		fnAjax:function(thisInp){
			$.ajax({url:"select_data.json",success:function(result){
				var html = '';
	            for(var i = 0; i < result.employees.length; i++)
	            {
	                html += '<li><a class="f-toe" href="javascript:;">' + result.employees[i].firstName + '</a></li>';
	            };
	            $('.associate').append(html);
	            //选中事件
	            $('.associate li a').click(function(){
					thisInp.val($(this).html());
				});
			}});
		}
	};
	/*
	eleTop:相对父级元素上边距
	eleLeft:相对父级元素左边距
	*/
	/* HTML
	<!-- associate begin -->
	<ul class="associate">
		<li><a class="f-toe" href="javascript:;">选项1</a></li>
		<li><a class="f-toe" href="javascript:;">选项2</a></li>
		<li><a class="f-toe" href="javascript:;">选项3</a></li>
		<li><a class="f-toe" href="javascript:;">选项4</a></li>
		<li><a class="f-toe" href="javascript:;">选项5</a></li>
		<li><a class="f-toe" href="javascript:;">选项6</a></li>
		<li><a class="f-toe" href="javascript:;">选项7</a></li>
		<li><a class="f-toe" href="javascript:;">选项8</a></li>
		<li><a class="f-toe" href="javascript:;">选项9</a></li>
	</ul>
	<!-- associate end -->
	*/
	
	$.fn.InputDefaulSelect=function(options){	//下拉选项
		var param=$.extend(false,$.fn.InputDefaulSelect.defaults,options);
		$(this).each(function(index,element){
			$(element).click(function(){
				var thisInp = $(element);
				$('.associate').remove();
				$(element).parent().prepend('<ul class="associate"></ul>');
				$('.associate').css('top',param.eleTop);
				$('.associate').css('left',param.eleLeft);
				$('.associate').width(parseInt($(element).width())+parseInt($(element).css('padding-left').replace('px',''))+parseInt($(element).css('padding-right').replace('px','')));
				$('.associate').show();
				param.fnAjax(thisInp);
			});
			$(element).click(function(event){
				event.stopPropagation();
			});
			$('.Wdate').click(function(){
				$('.associate').hide();
			});
			$(document).click(function(){
				$('.associate').hide();
			});
			$(window).resize(function(){
				$('.associate').width(parseInt($(element).width())+parseInt($(element).css('padding-left').replace('px',''))+parseInt($(element).css('padding-right').replace('px','')));
			});
		});
	};
	$.fn.InputDefaulSelect.defaults={
		eleTop:'40px',
		eleLeft:'0px',
		fnAjax:function(thisInp){
			$.ajax({url:"select_data.json",success:function(result){
				var html = '';
	            for(var i = 0; i < result.employees.length; i++)
	            {
	                html += '<li><a class="f-toe" href="javascript:;">' + result.employees[i].firstName + '</a></li>';
	            };
	            $('.associate').append(html);
	            //选中事件
	            $('.associate li a').click(function(){
					thisInp.val($(this).html());
				});
			}});
		}
	};
	
	/*
	eleTop:相对父级元素上边距
	eleLeft:相对父级元素左边距
	*/
	/* HTML
	<!-- associate begin -->
	<ul class="associate">
		<li><a class="f-toe" href="javascript:;">选项1</a></li>
		<li><a class="f-toe" href="javascript:;">选项2</a></li>
		<li><a class="f-toe" href="javascript:;">选项3</a></li>
		<li><a class="f-toe" href="javascript:;">选项4</a></li>
		<li><a class="f-toe" href="javascript:;">选项5</a></li>
		<li><a class="f-toe" href="javascript:;">选项6</a></li>
		<li><a class="f-toe" href="javascript:;">选项7</a></li>
		<li><a class="f-toe" href="javascript:;">选项8</a></li>
		<li><a class="f-toe" href="javascript:;">选项9</a></li>
	</ul>
	<!-- associate end -->
	*/
	
	$.fn.InputSelectTable=function(options){	//联想表格文本域
		var param=$.extend(false,$.fn.InputSelectTable.defaults,options);
		$(this).each(function(index,element){
			$(element).keyup(function(){
				var thisInp = $(element);
				thisInp.attr('yu','0');
				$('.select_table_box').remove();
				$(element).parent().prepend('<div class="select_table_box"><table class="select_table">'+ param.myThead +'</table></div>');
				$('.select_table_box').css('top',param.eleTop);
				$('.select_table_box').css('left',param.eleLeft);
				$('.select_table_box').width(parseInt($(element).width()));
				$('.select_table_box').show();
				param.fnAjax(thisInp);
			});
			$(element).keyup(function(event){
				event.stopPropagation();
			});
			$('.Wdate').click(function(){
				$('.select_table_box').hide();
			});
			$(document).click(function(){
				$('.select_table_box').hide();
			});
			$(window).resize(function(){
				$('.select_table_box').width(parseInt($(element).width()));
			});
			$(element).blur(function(){
				if($(element).attr('yu')=='0'){
					$(element).val('');
				};
			});
		});
	};
	$.fn.InputSelectTable.defaults={
		eleTop:'35px',
		eleLeft:'0px',
		myThead:'<thead><tr><th>firstName</th><th>lastName</th><th>age</th><th>sex</th></tr></thead><tbody></tbody>',
		fnAjax:function(thisInp){
			$.ajax({url:"select_table.json",success:function(result){
				var htmlForTbody = '';
	            for(var i = 0; i < result.employees.length; i++)
	            {
	                htmlForTbody += '<tr><td>' + result.employees[i].firstName + '</td><td>' + result.employees[i].lastName + '</td><td>' + result.employees[i].age + '</td><td>' + result.employees[i].sex + '</td></tr>';
	            };
	            $('.select_table tbody').append(htmlForTbody);
	            //选中事件
	            $('.select_table tbody tr').click(function(){
					thisInp.val($(this).html());
					thisInp.attr('yu','1');
				});
			}});
		}
	};
	/*
	eleTop:相对父级元素上边距
	eleLeft:相对父级元素左边距
	myThead:配置表头
	*/
	/* HTML
	<!-- select_table_box begin -->
	<div class="select_table_box">
		<table class="select_table">
			<thead>
				<tr>
					<th>表头</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>数据</td>
				</tr>
			</tbody>
		</table>
	</div>
	<!-- select_table_box end -->
	*/
	
	$.fn.InputForSelect=function(options){ //自定义下拉选项功能
		var param=$.extend(false,$.fn.InputForSelect.defaults,options);
		$(this).each(function(index,element){
			$(element).click(function(){
				$(element).blur();
				var text1 = '<div class="layer_bg"></div><div class="select-layer"><p class="f-clear"><span class="f-fl">'+param.title+'</span><a class="close f-fr" href="javascript:;"></a></p>';
				var text2 = '<ul class="f-clear"></ul></div>';
				$('body').prepend(text1+text2);
				$('.select-layer').width(param.layerBoxWidth);
				$('.select-layer').css('margin-top',-parseInt($('.select-layer').height()/2));
				$('.select-layer').css('margin-left',-parseInt($('.select-layer').width()/2));
				$('.layer_bg').css('height',$.common.bodyHeight());
				$(window).resize(function(){
					$('.layer_bg').css('height',$.common.bodyHeight());
				});
				var del=function(){
					$('.layer_bg').remove();
					$('.select-layer').remove();
				};
				$('.select-layer p a.close').click(function(){
					del();
				});
				param.fnAjax();
			});
		});
	};
	$.fn.InputForSelect.defaults={
		layerBoxWidth:300,
		title:'下拉列表',
		fnAjax:function(){
			$.ajax({url:"select_data.json",success:function(result){
				//获取对应的文本框
				var myInp = $('input#mySel1');
				var html = '';
	            for(var i = 0; i < result.employees.length; i++)
	            {
	                html += '<li class="f-fl"><a class="f-toe" href="javascript:;">' + result.employees[i].firstName + '</a></li>';
	            }
	            //将选项添加到容器中并设置列数
	            $('.select-layer ul').append(html);
	            $('.select-layer ul li').width('50%');
	            $('.select-layer').css('margin-top',-parseInt($('.select-layer').height()/2));
	            //选中事件
	            $('.select-layer ul li a').click(function(){
	            	//传值
	            	myInp.val($(this).html());
	            	//关闭
	            	$('.layer_bg').remove();
					$('.select-layer').remove();
	            });
			}});
		}
	};
	/*
	title:标题内容
	*/
	/*	HTML
	<div class="select-layer">
		<p class="f-clear">
			<span class="f-fl">下拉列表</span>
			<a class="close f-fr" href="javascript:;"></a>
		</p>
		<ul class="f-clear">
			<li class="f-fl"><a class="f-toe" href="javascript:;">选项1</a></li>
		</ul>
	</div>
	*/
	
	$.fn.DefaultInputTextVal=function(defaultValue){	//文本框默认值提示
        $(this).each(function(index,element){
                $.fn.ThisFocus=function(){
                        $(this).focus(function(){
                                if($(element).val()==actionVal)
                                {
                                        $(element).val('');
                                        $(element).css('color','#333');
                                }
                        });
                };
                $.fn.ThisBlur=function(){
                        $(this).blur(function(){
                                $(element).val($.trim($(element).val()));
                                if($(element).val()=='')
                                {
                                        $(element).val(actionVal);
                                        $(element).css('color','#888');	//可设置浅色
                                }
                        });
                };
                if($(element).val()=='')
                {
                        $(element).css('color','#888');	//可设置浅色
                        $(element).val($.trim(defaultValue));
                        var actionVal=$(element).val();
                        $(element).ThisFocus();
                        $(element).ThisBlur();
                }
                else if($(element).val()!='')
                {
                        $(element).css('color','#333');
                        $(element).val($.trim($(element).val()));
                        var actionVal=$.trim(defaultValue);
                        $(element).ThisFocus();
                        $(element).ThisBlur();
                }
        });
	};
	
	$.fn.TdColspan=function(){
		//表格展开功能合并行
		$(this).find('tbody tr.tr-details td').attr('colspan',$(this).find('thead tr th').length);
		//tfoot合并行
		if($(this).find('tfoot tr td').length==1){
			$(this).find('tfoot tr td.foot-btn').attr('colspan',$(this).find('thead tr th').length);
		} else if($(this).find('tfoot tr td').length==2) {
			$(this).find('tfoot tr td.foot-btn').attr('colspan',$(this).find('thead tr th').length-1);
		};
	};
	
	$.fn.NormalTabShift=function(options){	//标签页
		var param=$.extend(false,$.fn.NormalTabShift.defaults,options);
		$(this).each(function(index,element){
			var oBtn=$(element).find(param.btnBox).children().children();
			var oBox=$(element).find(param.contentBox).children();
			var timer=null;
			oBtn.eq(param.showIndex).addClass(param.activeClass);
			oBox.eq(param.showIndex).show();
			oBtn.on(param.event,function(){
				var This=$(this);
				if(param.event=='mouseenter'){
					timer=setTimeout(function(){
						tabShift(This);
					},param.delay);
				}
				else{
					tabShift(This);
				}
			});
			oBtn.mouseleave(function(){
				clearTimeout(timer);
			});
			function tabShift(obj){
				oBtn.removeClass(param.activeClass);
				oBox.hide();
				$(obj).addClass(param.activeClass);
				oBox.eq($(obj).parent().index()).show();
			};
		});
	};
	$.fn.NormalTabShift.defaults={
		btnBox:'.btndiv',
		contentBox:'.contentdiv',
		activeClass:'active',
		showIndex:0,
		delay:0,
		event:'click'
	};
	/*
	btnBox:标签元素
	contentBox:内容元素
	activeClass:标签切换样式
	showIndex:默认显示序号
	delay:鼠标延迟时间
	event:鼠标事件
	HTML:
	<div class="my_tabs">
		<ul class="btndiv clear">
			<li class="f-fl"><a class="active">1</a></li>
			<li class="f-fl"><a>2</a></li>
		</ul>
		<div class="contentdiv">
			<div>111</div>
			<div>222</div>
		</div>
	</div>
	*/
	
	$.fn.Layer=function(options){	//弹窗
		var param=$.extend(false,$.fn.Layer.defaults,options);
		var text1='<div class="layer_header clear"><h1 class="f-fl">'+param.title+'</h1><a class="close f-fr" href="'+param.closeLink+'"></a></div>';
		var text2='<div class="layer_body">'+param.layerText+'</div>';
		var text3='<div class="layer_footer f-clear"><a class="esc f-fr" href="javascript:;">取消</a><a class="enter f-fr" href="javascript:;">确&nbsp;定</a></div>';
		$(this).prepend('<div class="layer_bg"></div><div class="layer_box">'+text1+text2+text3+'</div>');
		$('.layer_bg').css('height',$.common.bodyHeight());
		$('.layer_box').css('margin-top',-parseInt($('.layer_box').height()/2));
		$(window).resize(function(){
			$('.layer_bg').css('height',$.common.bodyHeight());
		});
		if(param.escBtn!='hide'){
			$('.esc').show();
		};
		var del=function(){
			$('.layer_bg').remove();
			$('.layer_box').remove();
		};
		$('.layer_header .close').click(function(){
			del();
		});
		$('.layer_footer .esc').click(function(){
			del();
		});
		param.enterBtnFn();
	};
	$.fn.Layer.defaults={
		title:'温馨提示',
		layerText:'请尽量不要使用低版本的IE浏览器，我们推荐使用谷歌浏览器，谢谢！',
		escBtn:'hide',
		closeLink:'javascript:;',
		enterBtnFn:function(){
			$('.layer_footer .enter').click(function(){
				$('.layer_bg').remove();
				$('.layer_box').remove();
			});
		}
	};
	/*
	title:标题内容
	layerText:文本内容
	escBtn:取消按钮
	closeLink:关闭按钮后的链接
	enterBtnFn:确认按钮
	*/
	
	$.fn.newLine=function(options){	//表格换行弹窗-需获得最大行号
		var param=$.extend(false,$.fn.Layer.defaults,options);
		$(this).each(function(index,element){
	        $(element).find('td a.line').click(function(){
	            $('body').Layer({
	                title:'操作',
	                layerText:'<p style="text-align:center;">请在下面的文本框内输入您想换至的行号<br><br><input class="form-line" type="text" maxlength="5"><br><br>注：只能输入数字</p>',
	                enterBtnFn:function(){
	                    $('.form-line').focus();
	                    $('.form-line').blur(function(){
	                    	var number=$(this).val();
	                    	if(parseInt(number)!=number || number<=0){
								$(this).val('');
							} else {
		                        param.enterBtnFn();
	                        };
	                    });
	                }
	            });
	        });
	    });
	};
	$.fn.newLine.defaults={
		enterBtnFn:function(){
			$('.layer_footer .enter').click(function(){
				$('.layer_bg').remove();
				$('.layer_box').remove();
			});
		}
	};
	
})(jQuery);

jQuery(function(){
    //返回顶部
    $.common.backTop('.backtop a');
    //页面最小高度控制
    $.common.minHeight();
    window.onresize = function(){
        $.common.minHeight();
    };
    //上传按钮
    $('a.file-btn').each(function(index,element){
    	$(element).click(function(){
    		$(element).next('input.file-input').trigger('click');
    	});
    });
    //分页控件文本域校验
	$.common.pageVal('.pageVal');
	//表单控件头尾去空格
	$.common.inpTrim('.for-trim');
});