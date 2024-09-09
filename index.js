// First time writing JS
window.onload=function() {
    var textarea = document.getElementById("textarea")
    var clicked = false
    function copyToClipboard() {
        navigator.clipboard.writeText(textarea.value)
    }
    function readSingleFile(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = e.target.result;
          textarea.value = decryptStr(contents)
          clicked = false
          setTimeout(function(){
                clicked = true
          }, 10)
        };
        reader.readAsText(file);
    }
    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
    
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }
    function decryptStr(str) {
        var key = 0x81
        var out = ""
        for (let i = 0; i < str.length; i++) {
            out += String.fromCharCode(str.charCodeAt(i) ^ key)
        }
        return out
    }
    function decrypt() {
        textarea.value = decryptStr(textarea.value)
    }
    function down() {
        download("Save.pc", decryptStr(textarea.value))
    }
    var open = document.getElementById("file-input")
    open.addEventListener("click", readSingleFile, false)
    var openDecrypt = document.getElementById("file-decrypttotxt")
    function decryptToTxt(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = e.target.result;
          download("Save.pc", decryptStr(contents))
        };
        reader.readAsText(file);
    }
    openDecrypt.addEventListener("click", decryptToTxt, false)
    var button = document.getElementById("decrypt/encrypt")
    button.addEventListener("click", decrypt, false)
    var copy = document.getElementById("copy")
    copy.addEventListener("click", copyToClipboard, false)
    var openFile = document.getElementById("open")
    openFile.addEventListener("click", function() {
        open.click()
    }, false)
    var save = document.getElementById("save")
    save.addEventListener("click", down, false)
    var decrypttotxt = document.getElementById("decrypttotxt")
    decrypttotxt.addEventListener("click", function() {
        openDecrypt.click()
    }, false)
}