$.PWD = {};
$.PWD.password = null;


function encrypt(msg, pwd) {
	var wordArray = CryptoJS.enc.Utf8.parse(msg);  
	var encrypted = CryptoJS.AES.encrypt(wordArray, pwd);
	return encrypted.toString();
}

function decrypt(crypted, pwd) {
	var decrypted = CryptoJS.AES.decrypt(crypted, pwd);
	var str = decrypted.toString(CryptoJS.enc.Utf8);
	if (str.length == 0) {
	  return null;
	}
	return str;
}

var selectedInput = null;
$(function() {
    $('input, textarea, select').focus(function() {
        $.PWD.selectedInput = this;
    }).blur(function(){
        if ($.PWD.selectedInput != null) {
			$.PWD.lastSelectedInput = $.PWD.selectedInput;
        }
        $.PWD.selectedInput = null;
    });

    $(document).keyup(function(event) {
        if ($.PWD.selectedInput != null) {
            orig_text = $.PWD.selectedInput.value;
            text = orig_text.replace(/PWD\(([^)\n]+)\)/g, function($0, $1) {
                if ($.PWD.password == null) {
                    $.PWD.password = prompt("Enter password", "");

					match = /PWD-([-A-Za-z0-9+\/]+)/.exec(text);
					if (match && decrypt(match[1], $.PWD.password) == null) {
						alert("Incorrect password");
						$.PWD.password = null;
						return "PWD(" + $1;
					}
                }
				if ($.PWD.password.length > 0) {
					return "PWD-" + encrypt($1, $.PWD.password);
				}
				return "PWD(" + $1;
            });
            
            if (text != orig_text) {
                start = $.PWD.selectedInput.selectionStart - $.PWD.selectedInput.value.length + text.length;
                $.PWD.selectedInput.value = text;
                $.PWD.selectedInput.setSelectionRange(start, start);
            }
        }
    });
    
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
