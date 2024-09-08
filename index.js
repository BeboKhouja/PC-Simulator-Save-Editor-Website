// First time writing JS
window.onload=function() {
    var textarea = document.getElementById("textarea")
    var name = ""
    function copyToClipboard() {
        navigator.clipboard.writeText(textarea.value)
    }
    function readSingleFile(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        name = file.filename
        reader.readAsText(file);
        reader.onload = function(e) {
          var contents = e.target.result;
          textarea.value = contents
          decrypt()
        };
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
    function decrypt() {
        var key = 0x81
        var value = textarea.value
        var out = ""
        for (let i = 0; i < value.length; i++) {
            out += String.fromCharCode(value.charCodeAt(i) ^ key)
        }
        textarea.value = out
    }
    function down() {
        decrypt()
        download("Save.pc", textarea.value)
    }
    var button = document.getElementById("decrypt/encrypt")
    button.addEventListener("click", decrypt, false)
    var copy = document.getElementById("copy")
    copy.addEventListener("click", copyToClipboard, false)
    var open = document.getElementById("file-input")
    open.addEventListener("click", readSingleFile, false)
    var save = document.getElementById("save")
    save.addEventListener("click", down, false)
}