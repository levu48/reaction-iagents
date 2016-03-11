function slideMessage(type, message){
    $.notify({
        message: message,
    },{
        allow_dismiss: true,
        type: type,
        placement: {
                from: "top",
                align: "center"
        },
        animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
        },
        delay: 3000,
        z_index: 9999,
        timer: 1000
    });
}

function generateSlug(str){   
    str= str.toLowerCase();
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str= str.replace(/đ/g,"d");
    str= str.replace(/!|@|%|\^|\*|\(|\)|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"_");           
    str= str.replace(/-+-/g,"_"); 
    str= str.replace(/^\-+|\-+$/g,"");     
    return str;
    //return str.replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');  
}

function ChangeUrl(page, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Page: page, Url: url };
        history.pushState(obj, obj.Page, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}


