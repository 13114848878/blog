
$(document).ready(function() {
    //为超链接加上target='_blank'属性
    $('a[href^="http"]').each(function() {
        $(this).attr('target', '_blank');
    });
});
