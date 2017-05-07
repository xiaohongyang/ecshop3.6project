$(function(){
    //自动选择支付方式和配送方式
    $('input[name=shipping]').eq(0).trigger('click');
    $('input[name=payment][value=\'2\']').eq(0).trigger('click');

    //隐藏支付方式、配送方式等内容
    $('input[name=shipping]').eq(0).closest('.flowBox').hide();
    $('input[name=payment]').eq(0).closest('.flowBox').hide();
    $('input[name=pack]').eq(0).closest('.flowBox').hide();
    $('input[name=card]').eq(0).closest('.flowBox').hide();
    $('input[name=need_inv]').eq(0).closest('.flowBox').hide();
})