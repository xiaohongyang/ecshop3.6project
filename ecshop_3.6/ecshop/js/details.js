var hasDegreeClick = false;
$(function(){
    $("#right-degrees li").each(function () {
        /*$(this).attr("degree", $(this).text()); // 把度数存到属性里
        //if ($(this).text() == Math.abs(color.skus[i].degree)) {
            $(this).addClass("y1");
            $(this).click(onClickDegree);
            $(this).mouseover(onFocusDegree);
            $(this).mouseout(onLeaveDegree);
        //}*/
    });

    $('.degreeArea #left-degrees .y1, .degreeArea #right-degrees .y1').hover(function(){
        $(this).addClass( "y3");
        $(this).mouseout(function(){
            $(this).removeClass( "y3");
        })
        $(this).click(function(){
            $(this).closest('ul').find('.y2').removeClass('y2');
            $(this).addClass('y2')
        })
    })

})

/* *
 * 添加商品到购物车
 */
function addToCartXhy(goodsId, parentId)
{
    goodsId = goodsId == undefined ? $('#goods_id').val() : goodsId
    var goods        = new Object();
    var spec_arr     = new Array();
    var fittings_arr = new Array();
    var number       = 1;
    var formBuyLeft      = $('#left-degrees');
    var formBuyRight      = $('#right-degrees');
    var quick		   = 0;

    // 检查是否有商品规格
    if (!formBuyLeft.find('.y2').length && !formBuyRight.find('.y2').length)
    {
        $('#degreeArea_full').addClass('No_choice');
        $('#degreeArea_full').find('.close').show();
        return false;
    } else {
        $('#degreeArea_full').removeClass('No_choice');
        $('#degreeArea_full').find('.close').hide();
    }
    var specialLeft = $('#left-degrees').find('.y2');
    var specialRight = $('#right-degrees').find('.y2');
    quick = 1;
    if(specialLeft && specialLeft.attr('data-spec')) {
        number = $('#left-num').val()
        goods.quick    = quick;
        goods.spec     = [specialLeft.attr('data-spec')];
        goods.goods_id = goodsId;
        goods.number   = number;
        goods.parent   = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);
        Ajax.call('flow.php?step=add_to_cart', 'goods=' + goods.toJSONString(), addToCartResponse, 'POST', 'JSON');
    }
    if(specialRight && specialRight.attr('data-spec')) {
        number = $('#right-num').val()
        goods.quick    = quick;
        goods.spec     = [specialRight.attr('data-spec')];
        goods.goods_id = goodsId;
        goods.number   = number;
        goods.parent   = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);
        Ajax.call('flow.php?step=add_to_cart', 'goods=' + goods.toJSONString(), addToCartResponse, 'POST', 'JSON');
    }


return;
    goods.quick    = quick;
    goods.spec     = spec_arr;
    goods.goods_id = goodsId;
    goods.number   = number;
    goods.parent   = (typeof(parentId) == "undefined") ? 0 : parseInt(parentId);

    Ajax.call('flow.php?step=add_to_cart', 'goods=' + goods.toJSONString(), addToCartResponse, 'POST', 'JSON');
}

function DegreeClick() {
    if (hasDegreeClick) {
        return;
    }
    hasDegreeClick = true;
    //AddDegreeClick(1,1);
}

function onChangeNum(dom, n) {
    var num_input = (n < 0) ? $(dom).next() : $(dom).prev();
    var a = parseInt(num_input.val()) + n;
    if(a >= 0 && a <= 10)
        num_input.val(parseInt(num_input.val()) + n);

    if (getTotalBuyNum() > 0) {
        showChoice(false);
    }
}

function onClickDegree() {
    showContentForSku($(this).attr("degree"));
    $(this).parent().children(".y2").removeClass("y2");
    $(this).addClass("y2");
    if (getTotalBuyNum() > 0) {
        showChoice(false);
    }

    /* 设置id */
    var color = getDefaultColor();
    if ($("#left-degrees li.y2").length > 0) {
        var leftdegree = $("#left-degrees li.y2").eq(0).attr("degree");
        for (var i = 0; i < color.skus.length; ++i) {
            if (Math.abs(color.skus[i].degree) == leftdegree) {
                $("#left-sku-id").val(color.skus[i].Id);
                break;
            }
        }
    }
    if ($("#right-degrees li.y2").length > 0) {
        var rightdegree = $("#right-degrees li.y2").eq(0).attr("degree");
        for (var i = 0; i < color.skus.length; ++i) {
            if (Math.abs(color.skus[i].degree) == rightdegree) {
                $("#right-sku-id").val(color.skus[i].Id);
                break;
            }
        }
    }
}

function onFocusDegree() {
    return;
    var color = getDefaultColor();
    for (var i = 0; i < color.skus.length; ++i) {
        var sku = color.skus[i];
        var degree = $(this).attr("degree");
        $(this).addClass( "y3");
        if (degree == Math.abs(sku.degree) && sku.RealNumAvailable == 0 && sku.NumSale > sku.RealNumAvailable && sku.Remark.length > 0) {
            $(this).append("<span class='info'><h4></h4><p>" + sku.Remark + "</p></span>");
        }
    }
}
function onLeaveDegree() {
    $(this).text($(this).attr("degree"));
    $(this).removeClass("y3");
}
// for detail mini
function onSelectDegree(dom) {
    showContentForSku($(dom).find("option:selected").text());
    if (getTotalBuyNum() > 0) {
        showChoice(false);
    }
}

