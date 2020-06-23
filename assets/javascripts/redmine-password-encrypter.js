$.PWD = {};
$.PWD.password = null;


function encrypt(msg, pwd) {
    var wordArray = CryptoJS.enc.Utf8.parse(msg);  
    var encrypted = CryptoJS.AES.encrypt(wordArray, pwd);
    return encrypted.toString();
}

function decrypt(crypted, pwd) {
    try {
        var decrypted = CryptoJS.AES.decrypt(crypted, pwd);
        var str = decrypted.toString(CryptoJS.enc.Utf8);
        if (str.length == 0) {
          return null;
        }
        return str;
    } catch (e) {
        return null;
    }
}

var selectedInput = null;
$(function() {
    $(document).keydown(function(event) {
        src = event.srcElement;
        if (src != null
            && src.localName == "textarea"
            && src == $.PWD.currentSrc
            && event.key.length == 1) {
            if ($.PWD.lastSequence == "PWD" && event.key == "-") {
                while ($.PWD.password == null) {
                    master_password = prompt("Enter master password", "");
                    if (master_password == null) {
                        return
                    }

                    match = /PWD-([-A-Za-z0-9+\/]+)/.exec(src.value);
                    if (match && decrypt(match[1], master_password) == null) {
                        alert("Incorrect password");
                    } else {
                        $.PWD.password = master_password;
                    }
                } 
                if ($.PWD.password != null && $.PWD.password.length > 0) {
                    password = prompt("Enter password to encrypt", "");
                    if (password != null) {
                        encrypted_password = encrypt(password, $.PWD.password);
                        document.execCommand('insertText', false /*no UI*/,
                            "-" + encrypted_password);
                    }
                }

                $.PWD.lastSequence = "";

                event.preventDefault();
                return false;
            } else {
                $.PWD.lastSequence = $.PWD.lastSequence + event.key;
                $.PWD.lastSequence = $.PWD.lastSequence.substring($.PWD.lastSequence.length - 3)
            }
        } else {
            $.PWD.currentSrc = src;
            $.PWD.lastSequence = "";
        }
    })
    
    decorateEncryptedPasswords($("div.wiki"));

    $(document).ajaxComplete(function () {
        decorateEncryptedPasswords($("div.wiki"));
    });
    
    $("div.wiki").on('click', "span.encrypted-pwd", function () {
        crypted = $(this).text();
        if ($.PWD.password == null) {
            $.PWD.password = prompt("Enter password", "");
        }

        plain = decrypt(crypted, $.PWD.password);

        if (plain == null) {
            alert('Invalid password');
            $.PWD.password = null;
        } else {
            $(this).text(plain);
            $(this).attr('class', '');
            $(this).attr('title', 'Decrypted password. The password will be hidden next time you load this page.');
        }
    });
});

function decorateEncryptedPasswords(element) {
    element.each(function() {
        old_html = $(this).html();
        new_html = old_html.replace(/PWD-([=A-Za-z0-9+\/]+)/g, '<span class="encrypted-pwd" title="Click to decrypt">$1</span>');
        if (old_html != new_html) {
            $(this).html(new_html);
        }
    });
}



// vim: ts=4 sts=4 shiftwidth=4 noexpandtab
