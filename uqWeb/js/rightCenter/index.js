'use strict';

var _data;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.vueObj = new Vue({
    el: "#freeUpgrade",
    data: (_data = {
        yujiazai: true,
        dialog: false,
        info: '',
        title: '',
        id: '',
        payWays: '',
        bsID: 1,
        income: '',
        mySwipernum: '',
        initialSlide: '',
        goodsInfo: '',
        mescroll: null,
        userInfo: '',
        ungradelevel: '',
        rightsList: ''
    }, _defineProperty(_data, 'id', '1648'), _defineProperty(_data, 'initSwiper1Slide', ''), _defineProperty(_data, 'initswiper', ''), _data),
    created: function created() {
        var bodyHeight = document.body.clientHeight;
        var safeArea = dsBridge.call('receiveParams', 'safeAreaTop');
        var size = document.documentElement.clientWidth / 7.5;
        this.statusH = safeArea / size;
    },

    methods: {
        onBack: function onBack() {
            dsBridge.call('closeWin');
        },
        _initSwiper1: function _initSwiper1() {
            var _this = this;

            this.initswiper = new Swiper('.successNav', {
                slidesPerView: 1.3,
                spaceBetween: 8,
                centeredSlides: true,
                loop: true,
                loopAdditionalSlides: 1,
                initialSlide: this.initSwiper1Slide,
                on: {
                    click: function click(e) {
                        var canPay = _this.rightsList[_this.initswiper.realIndex].canPay;
                        var id = _this.rightsList[_this.initswiper.realIndex].id;
                        if (e.target.className == 'toBtn') {
                            if (canPay == 1) {
                                _this.toCashPay(id);
                            } else if (canPay == 2) {
                                _this.toGiftPay(id);
                            }
                        }
                    }
                }
            });
        },
        _initSwiper2: function _initSwiper2() {
            var _this2 = this;

            this.mySwipernum = new Swiper('.personSwiper', {
                effect: 'coverflow',
                grabCursor: true,
                watchSlidesProgress: true,
                centeredSlides: true,
                loop: false,
                loopedSlides: 3,
                slidesPerView: 3,
                initialSlide: this.initialSlide,
                coverflowEffect: {
                    rotate: 2,
                    stretch: 5,
                    depth: 50,
                    modifier: 3,
                    slideShadows: false
                },
                on: {
                    transitionEnd: function transitionEnd() {
                        if (_this2.mySwipernum) {
                            _this2.income = _this2.info ? _this2.info.managerList[_this2.mySwipernum.activeIndex] : '';
                        }
                    },
                    sliderMove: function sliderMove(event) {
                        window.canRightSlipBack = false;
                    },
                    touchEnd: function touchEnd(event) {
                        setTimeout(function () {
                            window.canRightSlipBack = true;
                        }, 600);
                    }
                }
            });
        },

        toInvite: function toInvite() {
            if (dsBridge.call('receiveParams', 'token')) {
                dsBridge.call("openWin", '/invite');
            } else {
                dsBridge.call("toLogin");
            }
        },
        toDetail: function toDetail(type, id) {
            dsBridge.call('openGood', { type: type, origin_id: id });
        },
        // 去付费升级
        toCashPay: function toCashPay(id) {
            if (dsBridge.call('receiveParams', 'token')) {
                dsBridge.call("open", { url: Http.HOST + '/uqWeb/html/rightCenter/upgradePay.html?id=' + id, type: 'web' });
            } else {
                dsBridge.call("toLogin");
            }
        },
        // 去礼包升级
        toGiftPay: function toGiftPay(id) {
            if (dsBridge.call('receiveParams', 'token')) {
                dsBridge.call("open", { url: Http.HOST + '/uqWeb/html/rightCenter/giftBag.html?id=' + id, type: 'web' });
            } else {
                dsBridge.call("toLogin");
            }
        },
        // 去订单详情
        toOrderList: function toOrderList() {
            dsBridge.call("openWin", '/rightsRecord');
        },

        getList: function getList() {
            var _this3 = this;

            var codeVersion = dsBridge.call('receiveParams', 'codeVersion');
            // 显示loading
            if (codeVersion >= 310) {
                dsBridge.call('common', { code: 2, data: { type: 1 } }, function (ret) {});
            }
            Http.post(Http.HOST + Http.API_URL.RIGHTERINDEX, {}, true).then(function (res) {
                _this3.yujiazai = false;
                if (res.code === 0) {
                    _this3.info = res.data;
                    _this3.ungradelevel = res.data.up.rulesGroup[0].rules;
                    _this3.rightsList = res.data.rightsList;
                    _this3.userInfo = res.data.userInfo;
                    _this3.initialSlide = Math.ceil(res.data.managerList.length / 2) - 1;
                    _this3.income = res.data.managerList ? res.data.managerList[_this3.initialSlide] : '';
                    for (var i = 0; i < res.data.rightsList.length; i++) {
                        if (_this3.rightsList[i].id == _this3.userInfo.rightsId) {
                            _this3.initSwiper1Slide = i;
                        }
                    }
                    _this3.$nextTick(function () {
                        !this.initswiper && this._initSwiper1();
                        !this.mySwipernum && this._initSwiper2();
                    });
                    // 隐藏loading
                    if (codeVersion >= 310) {
                        dsBridge.call('common', { code: 2, data: { type: 0 } }, function (ret) {});
                    }
                }
            });
        },
        upCallback: function upCallback(page, mescroll) {
            var _this4 = this;

            console.log('xiala');
            Http.post(Http.HOST + Http.API_URL.OPTIONALGOODS, { page: page.num }, true).then(function (res) {
                if (res.code === 0) {
                    var arr = res.data === '' ? [] : res.data;
                    if (page.num === 1) _this4.goodsInfo = [];
                    _this4.goodsInfo = _this4.goodsInfo.concat(arr);
                    _this4.$nextTick(function () {
                        // this.mescroll.endSuccess(arr.length);
                        mescroll.endSuccess(res.data.length, true);
                    });
                }
            });
        },

        showNotice: function showNotice() {
            this.dialog = true;
        },
        surBtn: function surBtn() {
            this.dialog = false;
        },
        addEvent: function addEvent() {
            var _this5 = this;

            document.addEventListener("visibilitychange", function () {
                if (document.hidden) {
                    // 页面被挂起
                } else {
                    _this5.getList();
                    //window.location.reload();
                }
            });
        }
    },
    mounted: function mounted() {
        this.addEvent();
        this.getList();
        // this.getGoods()
        this.mescroll = new MeScroll(this.$refs.mescroll, { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到				
            down: {
                isLock: true
            },
            up: {
                // auto: false,
                isBounce: false,
                callback: this.upCallback,
                page: {
                    num: 0,
                    size: 10
                },
                // htmlNodata: '<p class="upwarp-nodata">—— 我也是有底线的 ——</p>',
                noMoreSize: 5,
                empty: {
                    warpId: 'd26',
                    icon: '../../image/kong.png',
                    tip: '暂无相关数据~'
                }
            }
        });
    }
});