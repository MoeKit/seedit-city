require('./style.css')
var $ = require('jquery');

function appCity(obj) {
	this.o = obj;
	var _hostLast = !!window.location.host.split('.')[3] ? '.' + window.location.host.split('.')[3] : '';
	var _urlHost = window.location.host.split('.')[1] + '.' + window.location.host.split('.')[2] + _hostLast;
	this._urlHost = /localhost/.test(window.location.host) ? 'office.bzdev.net' : _urlHost;
	this.$target = $(this.o.eleName);
	this._init();
}
var proto = appCity.prototype;

proto.getAjax = function(option, fn) {
	$.ajax({
		type: 'GET',
		url: option.url,
		data: option.d,
		dataType: 'jsonp',
		jsonp: '__c',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if (!!fn) {
				fn(data);
			}
		},
		error: function(e) {
			console.error(e + '错误，无法正常获取数据');
		}
	})
};

proto._init = function() {
	var _this = this;
	var u = 'http://common.' + _this._urlHost + '/bbs/common_district.jsonp';
	var d = 'upid=0';
	var maxHeight = $(window).height() / 3;
	var titHeight = this.$target.find('.tit').height();
	var html = '<div class="val">请选择</div>' +
		'<div class="city-option">' +
		'<div class="tit">请选择区域</div>' +
		'<div class="option-main"><div class="list"></div><div class="sub-list"></div>' +
		'</div></div>';
	this.$target.html(html);
	this.$target.find('.option-main').css('max-height', maxHeight * 2 + "px");
	this.$target.find('.option-main .list').css("max-height", (maxHeight * 2) - titHeight + "px");
	this.$target.find('.option-main .sub-list').css("max-height", (maxHeight * 2) - titHeight + "px");
	_this.getAjax({
		url: u,
		d: d
	}, function(data) {
		var html = '';
		var i = 0;
		var len = data.data.length;
		var tagClass = '';
		for (i = 0; i < len; i++) {
			var name = data.data[i].name;
			switch (name) {
				case '西藏自治区':
					name = '西藏';
					break;
				case '内蒙古自治区':
					name = '内蒙古';
					break;
				case '广西壮族自治区':
					name = '广西';
					break;
				case '宁夏回族自治区':
					name = '宁夏';
					break;
				case '新疆维吾尔自治区':
					name = '新疆';
					break;
				case '香港特别行政区':
					name = '香港';
					break;
				case '澳门特别行政区':
					name = '澳门';
					break;
				case '海外':
					tagClass = 'class="abroad"';
					break;
			}

			html += '<li data-province="' + data.data[i].id + '" ' + tagClass + ' >' + name + '</li>';
			tagClass = '';
		}
		_this.$target.each(function(i) {
			$(this).find(".list").html("<ul>" + html + "</ul>");
			var abroad = $('li.abroad').clone().removeClass("abroad");
			$('li.abroad').remove();
			$(this).find(".list").find("ul").children("li").eq(0).before(abroad.eq(0));
		});
		_this.province();
	});

	this.$target.find(".val").on('click', function() {
		if ($('.overlayout').length == 0) {
			$('body').append("<div class='overlayout'></div>");
			$('.overlayout').on('click', function() {
				_this.$target.find(".city-option").removeClass("show-option");
				$(this).remove();
			})
		}
		$(this).closest(_this.o.eleName).find(".city-option").addClass("show-option");
	});
};

proto.province = function() {
	_this = this;
	_this.$target.find(".list").find("li").off('click').on('click', function() {
		var key = $(this).attr('data-province');
		$(this).addClass("selected").siblings("li").removeClass("selected");
		cityFun(key);
		_this.o.province($(this));
	});
	var cityFun = function(pKey, cKey) {
		var subU = 'http://common.' + _this._urlHost + '/bbs/common_district.jsonp';
		var subd = 'upid=' + pKey;
		_this.getAjax({
			url: subU,
			d: subd
		}, function(data) {
			var subHtml = '';
			var j = 0;
			var subLen = data.data.length;
			for (j = 0; j < subLen; j++) {
				if (data.data[j].id == cKey) {
					subHtml += '<li data-city="' + data.data[j].id + '" class="selected">' + data.data[j].name + '</li>';
				} else {
					subHtml += '<li data-city="' + data.data[j].id + '">' + data.data[j].name + '</li>';
				}
			}
			_this.$target.find(".sub-list").html("<ul>" + subHtml + "</ul>").show();
			_this.liEvent();
		});
	}
};

proto.liEvent = function() {
	var _this = this;
	this.$target.find('.sub-list').find("li").off('click').on('click', function() {
		var t = $(this).closest('.option-main').find(".list").find(".selected").text();
		var pAttr = $(this).closest('.option-main').find(".list").find(".selected").attr('data-province');
		var Cattr = $(this).attr('data-city');
		$(this).closest('.option-main').siblings(".tit").text(t + " " + $(this).text());
		$(this).addClass("selected").siblings("li").removeClass("selected");
		$(this).closest(_this.o.eleName).find('.val').text(t + $(this).text());
		$(this).closest(_this.o.eleName).find('.val').attr({
			'data-city': Cattr,
			'data-province': pAttr
		});
		$(this).closest(_this.o.eleName).find('.city-option').removeClass("show-option");
		_this.o.city($(this));
		$('.overlayout').remove();
	});
};

//打开
proto.open = function(eq) {
	var _this = this;
	var eq = !!eq ? eq : '0';
	_this.$target.eq(eq).find(".city-option").addClass("show-option");
	if ($('.overlayout').length == 0) {
		$('body').append("<div class='overlayout'></div>");
		$('.overlayout').on('click', function() {
			_this.$target.find(".city-option").removeClass("show-option");
			$(this).remove();
		})
	}
};

module.exports = appCity;