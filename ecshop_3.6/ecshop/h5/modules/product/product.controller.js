(function () {

  'use strict';

  angular
  .module('app')
  .controller('ProductController', ProductController);

  ProductController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'AppAuthenticationService', 'ConfirmProductService', 'CartModel','ConfigModel'];

  function ProductController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, AppAuthenticationService, ConfirmProductService, CartModel,ConfigModel) {

      var MAX_COMMENTS = 3;

      var productId = $stateParams.product;

      $scope.currentStock = null;
      $scope.currentAttrs = [];
      $scope.currentAttrsRight = [];
      $scope.input = {
          currentAmount: 1,
          currentAmountRight: 1
      };

      $scope.optionalAttrs = [];
      $scope.optionalAttrsRight = [];
      $scope.canPurchase = false;

      $scope.product = null;
      $scope.comments = [];

      $scope.cartModel = CartModel;

      $scope.touchAmountSub = _touchAmountSub;
      $scope.touchAmountAdd = _touchAmountAdd;

      $scope.touchAmountSubRight = _touchAmountSubRight;
      $scope.touchAmountAddRight = _touchAmountAddRight;
      $scope.touchAttr = _touchAttr;
      $scope.touchAttrRight = _touchAttrRight;
      $scope.touchLike = _touchLike;
      $scope.touchComments = _touchComments;
      $scope.touchComment = _touchComment;
      $scope.touchCart = _touchCart;
      $scope.touchAddCart = _touchAddCart;
      $scope.touchPurchase = _touchPurchase;
      $scope.refreshAmount = _refreshAmount;


      $scope.formatGrade = _formatGrade;
      $scope.isAttrSelected = _isAttrSelected;
      $scope.isAttrSelectedRight = _isAttrSelectedRight;

      $scope.isLoading = false;
      $scope.isLoaded = false;

      function _touchAmountSub() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;
        }

        var amount = parseInt($scope.input.currentAmount);
        if ( amount < 1 ){
            //$scope.toast('宝贝不能再少了');
            return;
        }

          $scope.input.currentAmount = '' + (amount - 1);
      }

      function _touchAmountSubRight() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;
        }

        var amount = parseInt($scope.input.currentAmountRight);
        if ( amount < 1 ){
            //$scope.toast('受不了了，宝贝不能再少了');
            return;
        }

          $scope.input.currentAmountRight = '' + (amount - 1);
      }

      function _refreshAmount(){

          var amount = parseInt($scope.input.currentAmount);
          if (amount < 1) {
              $scope.input.currentAmount = 1+"";
          }

      }

      function _touchAmountAdd() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;

          var amount = parseInt($scope.input.currentAmount);
          var stock = parseInt($scope.currentStock.stock_number);
          if ( amount >= stock )
            return;

            $scope.input.currentAmount = '' + (amount + 1);
        } else {
          var amount = parseInt($scope.input.currentAmount);
          var stock = $scope.product.good_stock;
          if ( amount >= stock )
            return;

            $scope.input.currentAmount = '' + (amount + 1);
        }

      }

      function _touchAmountAddRight() {
        if ( !_checkCanPurchase() )
          return;

        if ( !$scope.product )
          return;

        if ( $scope.product.stock && $scope.product.stock.length ) {
          if ( !$scope.currentStock )
            return;

          var amount = parseInt($scope.input.currentAmountRight);
          var stock = parseInt($scope.currentStock.stock_number);
          if ( amount >= stock )
            return;

            $scope.input.currentAmountRight = '' + (amount + 1);
        } else {
          var amount = parseInt($scope.input.currentAmountRight);
          var stock = $scope.product.good_stock;
          if ( amount >= stock )
            return;

            $scope.input.currentAmountRight = '' + (amount + 1);
        }

      }

      function _touchAttr( property, attr ) {
        if ( !$scope.product )
          return;

        var product = $scope.product;

        if ( attr.is_multiselect ) {
          var attrs = [].concat( $scope.optionalAttrs );
          var index = attrs.indexOf( attr.id );
          if ( -1 == index ) {
            attrs.push( attr.id );
          } else {
            attrs.splice( index, 1 );
          }
          $scope.optionalAttrs = attrs;
          $scope.optionalAttrsRight = attrs;
        } else {
          var stock = null;
          var attrs = [].concat( $scope.currentAttrs );
          var index = attrs.indexOf( attr.id );

          attrs.push( attr.id );

          for ( var i in property.attrs ) {
            if ( property.attrs[i].id != attr.id ) {
              var index = attrs.indexOf( property.attrs[i].id );
              if ( -1 != index ) {
                attrs.splice( index, 1 );
              }
            }
          }

          attrs = attrs.filter(function( attr, index, self ){
            return self.indexOf(attr) === index;
          });

          attrs.sort(function(a, b){
            return a - b;
          })

          if ( attrs.length ) {
            var key = attrs.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {
              if ( product.stock[i].goods_attr == key ) {
                stock = product.stock[i];
                break;
              }
            }
          }

          $scope.currentAttrs = attrs;
          $scope.currentStock = stock;
          $scope.canPurchase = _checkCanPurchase();
        }
      }

      function _touchAttrRight( property, attr ) {
        if ( !$scope.product )
          return;

        var product = $scope.product;

        if ( attr.is_multiselect ) {
          var attrs = [].concat( $scope.optionalAttrs );
          var index = attrs.indexOf( attr.id );
          if ( -1 == index ) {
            attrs.push( attr.id );
          } else {
            attrs.splice( index, 1 );
          }
          $scope.optionalAttrs = attrs;
          $scope.optionalAttrsRight = attrs;
        } else {
          var stock = null;
          var attrs = [].concat( $scope.currentAttrsRight );
          var index = attrs.indexOf( attr.id );

          attrs.push( attr.id );

          for ( var i in property.attrs ) {
            if ( property.attrs[i].id != attr.id ) {
              var index = attrs.indexOf( property.attrs[i].id );
              if ( -1 != index ) {
                attrs.splice( index, 1 );
              }
            }
          }

          attrs = attrs.filter(function( attr, index, self ){
            return self.indexOf(attr) === index;
          });

          attrs.sort(function(a, b){
            return a - b;
          })

          if ( attrs.length ) {
            var key = attrs.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {
              if ( product.stock[i].goods_attr == key ) {
                stock = product.stock[i];
                break;
              }
            }
          }

          $scope.currentAttrsRight = attrs;
          $scope.currentStock = stock;
          $scope.canPurchase = _checkCanPurchase();
        }
      }

      function _touchComments() {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchComment( comment ) {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchCart() {

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        $state.go('cart-select', {});
      }

      function _touchLike(){

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        if ( $scope.product.is_liked ) {
            $scope.product.is_liked = false;
            API.product
            .unlike({product:productId})
            .then(function(is_liked){
              $scope.product.is_liked = is_liked;
              $scope.toast('取消收藏');
            }, function(error){
              $scope.product.is_liked = true;
            });
        } else {
            $scope.product.is_liked = true;
            API.product
            .like({product:productId})
            .then(function(is_liked){
              $scope.product.is_liked = is_liked;
              $scope.toast('收藏成功');
            }, function(error){
              $scope.product.is_liked = false;
            });
        }
      }

      function _touchAddCart() {
        if ( !_checkCanPurchase() )
          return;

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
        var amount = $scope.input.currentAmount;

        var attrsRight = [].concat($scope.currentAttrsRight).concat($scope.optionalAttrsRight);
        var amountRight = $scope.input.currentAmountRight;

        var result = -1;
        var addCount = 0;
        if(amount > 0) {
          addCount += 1;
        }
        if(amountRight > 0) {
          addCount += 1;
        }
        if(amount > 0) {
            CartModel
                .add(productId, attrs, amount)
                .then(function(succeed){
                    if ( succeed ) {
                        result = true;
                        //$scope.toast('已添加到购物车');
                    } else {
                        result = false;
                    }
                    addCount -= 1;
                });
        }

        if(amountRight > 0) {
            CartModel
                .add(productId, attrsRight, amountRight)
                .then(function(succeed){
                    if ( succeed ) {
                        result = true;
                        //$scope.toast('已添加到购物车');
                    } else {
                        result = false
                    }
                    addCount -= 1;
                });
        }
        if(int01)
            clearInterval(int01)
        var int01 = setInterval(function () {
            if(result != -1 && addCount == 0){
                if(result)
                    $scope.toast('已添加到购物车');
                else
                    $scope.toast('添加到购物车失败');
                clearInterval(int01);
            }
        }, 100)


      }

      function _touchPurchase() {
        if ( !_checkCanPurchase() )
          return;

        if ( !AppAuthenticationService.getToken() ) {
          $scope.goSignin();
          return;
        }

        var product = $scope.product;
        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
        var amount = $scope.input.currentAmount;

        ConfirmProductService.clear();
        ConfirmProductService.product = product;
        ConfirmProductService.attrs = attrs;
        ConfirmProductService.amount = amount;

        $state.go('confirm-product', {});
      }

      function _checkCanPurchase() {
        var product = $scope.product;
        var required = false;

        if ( !product || !product.good_stock )
          return false;

        for ( var i in  product.properties ) {
          if ( !product.properties[i].is_multiselect ) {
            required = true;
            break;
          }
        }

        if ( required ) {
          if ( !$scope.currentAttrs || !$scope.currentAttrs.length ) {
            return false;
          }
          if ( !$scope.currentStock ) {
            return false;
          }
        }

        return true;
      }

      function _formatGrade( grade ) {
        if ( ENUM.REVIEW_GRADE.BAD == grade ) {
          return '差评';
        } else if ( ENUM.REVIEW_GRADE.MEDIUM == grade ) {
          return '中评';
        } else if ( ENUM.REVIEW_GRADE.GOOD == grade ) {
          return '好评';
        }
        return '中评';
      }

      function _isAttrSelected( attr ) {
        if ( attr.is_multiselect ) {
          return $scope.optionalAttrs.indexOf(attr.id) == -1 ? false : true;
        } else {
          return $scope.currentAttrs.indexOf(attr.id) == -1 ? false : true;
        }
      }
      function _isAttrSelectedRight( attr ) {
        if ( attr.is_multiselect ) {
          return $scope.optionalAttrsRight.indexOf(attr.id) == -1 ? false : true;
        } else {
          return $scope.currentAttrsRight.indexOf(attr.id) == -1 ? false : true;
        }
      }

      function _reloadProduct() {
        $scope.isLoading = true;
        API.product
        .get({product:productId})
        .then(function(product){

          product.properties.sort(function(a, b){
            return a.is_multiselect - b.is_multiselect;
          })

          $scope.product = product;
          $scope.isLoaded = true;
          $scope.isLoading = false;
          $scope.canPurchase = _checkCanPurchase();

          ConfigModel.fetch().then(function(){
            var config = ConfigModel.getConfig();
            var wechat = config['wxpay.web'];
            _initConfig(wechat,product.share_url);
                  return true;
          });
         


          if ( product.photos && product.photos.length > 1 ) {
            var timer = $timeout( function() {
                $scope.flashSwiper = new Swiper('.product-flash', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 1500,
                    autoplayDisableOnInteraction: false,
                    loop: true
                });
            }, 1 );
          } else {
            var timer = $timeout( function() {
                $scope.flashSwiper = new Swiper('.product-flash', {
                    pagination: '.swiper-pagination',
                    paginationClickable: false,
                    spaceBetween: 30,
                    centeredSlides: true,
                    autoplay: 0,
                    autoplayDisableOnInteraction: false,
                    loop: false
                });
            }, 1 );
          }

          var defaultAttrIds = [];
          var defaultAttrStock = null;

          for ( var i = 0; i < product.properties.length; ++i ) {
            var property = product.properties[i];
            if ( !property.is_multiselect ) {
              defaultAttrIds.push( property.attrs[0].id );
            }
          }

          defaultAttrIds.sort(function(a, b){
            return a - b;
          })

          if ( defaultAttrIds.length ) {
            var stockSelector = defaultAttrIds.join('|');
            for ( var i = 0; i < product.stock.length; ++i ) {
              if ( product.stock[i].goods_attr == stockSelector ) {
                defaultAttrStock = product.stock[i];
                break;
              }
            }
          }
          

          $scope.currentAttrs = defaultAttrIds;
          $scope.currentStock = defaultAttrStock;
          $scope.canPurchase = _checkCanPurchase();

          _reloadComments();
        });
      }

      function _initConfig(wechat,url){

        if(!AppAuthenticationService.getToken()){
                return;
            }

                if ( !wechat ) {
                    return;
                };

                wx.config({
                    debug: GLOBAL_CONFIG.DEBUG, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: wechat.app_id, // 必填，公众号的唯一标识
                    timestamp: wechat.timestamp, // 必填，生成签名的时间戳
                    nonceStr: wechat.nonceStr, // 必填，生成签名的随机串
                    signature: wechat.signature,// 必填，签名，见附录1
                    jsApiList: ['chooseWXPay',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                var shared_link = url;

                wx.ready( function() {
                    wx.onMenuShareTimeline({
                        title: '商品详情', // 分享标题
                        desc:'',
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: '商品详情', // 分享标题
                        desc:'',
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQQ({
                        title: '商品详情', // 分享标题
                        desc: '', // 分享描述
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: '商品详情', // 分享标题
                        desc: '', // 分享描述
                        link: shared_link, // 分享链接
                        imgUrl: '', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                });

                wx.error(function(res){
                    if(GLOBAL_CONFIG.DEBUG){
                        $rootScope.toast(JSON.stringify(res));
                    }
                });

    }

      function _reloadComments() {
        if ( !$scope.product )
          return;

        API.review
        .productList({
            product:productId,
            grade:ENUM.REVIEW_GRADE.ALL,
            page:1,
            per_page:MAX_COMMENTS
        }).then(function(comments){
            $scope.comments = comments;
        });
      }

      function _reload() {
        _reloadProduct();
      }

      _reload();

      /*var intInit = setInterval(function(){
          if($('.group-items').eq(1).find('.group-item').length){
              $('.group-items').eq(1).find('.group-item').eq(0).trigger('click')
              clearInterval(intInit)
          }
      },200);*/

  }

})();
