// First time writing JS
window.onload=function() {
    var textarea = document.getElementById("textarea")
    function decrypt() {
        var key = 0x81
        var value = textarea.value
        var out = ""
        for (let i = 0; i < value.length; i++) {
            out += String.fromCharCode(value.charCodeAt(i) ^ key)
        }
        textarea.value = out
    }
    var button = document.getElementById("decrypt/encrypt")
    button.addEventListener("click", decrypt, false)
}