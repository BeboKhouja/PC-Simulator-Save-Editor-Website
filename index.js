/*
PC Simulator Save Editor is a free and open source save editor for PC Simulator.
    Copyright (C) 2024  Mokka Chocolata

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
Email: mokkachocolata@gmail.com
*/

// First time writing JS
window.onload=function() {
    var textarea = document.getElementById("textarea");
    var clicked = false;
    window.onscroll = function() {scrollFunction()};

    let gototopButton = document.getElementById("goToTop");
    function scrollFunction() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            gototopButton.style.display = "block";
        } else {
            gototopButton.style.display = "none";
        }
    }

    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    gototopButton.addEventListener("click", topFunction, false)

    function copyToClipboard() {
        navigator.clipboard.writeText(textarea.value);
    }
    function readSingleFile(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = e.target.result;
          textarea.value = decryptStr(contents);
          clicked = false;
          setTimeout(function(){
                clicked = true;
          }, 10);
        }
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
    // Decrypt provided string
    function decryptStr(str) {
        const key = 0x81;
        var out = "";
        for (let i = 0; i < str.length; i++)
            out += String.fromCharCode(str.charCodeAt(i) ^ key);
        return out;
    }
    // Just basically a shortcut to the decryptStr function
    function decrypt() {
        textarea.value = decryptStr(textarea.value);
    }
    function down() {
        download("Save.pc", decryptStr(textarea.value));
    }
    const lineDelimiter = /\r?\n/;
    function checkSaveValidJson() {
        const lines = textarea.value.split(lineDelimiter);
        if (lines.length != 2) return false;
        try {
            JSON.parse(lines[0]);
            const sec = JSON.parse(lines[1]);
            if (typeof(sec.playerData) != "object" || typeof(sec.itemData) != "object") return false;
            if (typeof(sec.playerData.x) != "number" || typeof(sec.playerData.y) != "number" || typeof(sec.playerData.z) != "number") return false;
        } catch {
            return false;
        }
        return true;
    }
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getJsonLines() {
        if (!checkSaveValidJson()) throw Error("Invalid JSON data");
        const lines = textarea.value.split(lineDelimiter);
        return [JSON.parse(lines[0]), JSON.parse(lines[1])];
    }
    function getPlayerPos() {
        if (!checkSaveValidJson()) throw Error("Invalid JSON data");
        const playerData = getJsonLines()[1].playerData;
        return {"x": playerData.x, "y": playerData.y, "z": playerData.z};
    }
    function insertSpawnId(spawnId, data) {
        if (!checkSaveValidJson()) return;
        var orig = getJsonLines();
        if (data == null) data = {};
        orig[1].itemData.push({"spawnId": spawnId, "id": getRandomIntInclusive(-2147483648, 2147483647), "pos": getPlayerPos(), "rot": {"x": 0, "y": 0, "z": 0, "w": 0}, "data": data});
        const newJson = orig.map(e => JSON.stringify(e));
        textarea.value = `${newJson[0]}\n${newJson[1]}`;
    }
    var open = document.getElementById("file-input");
    open.addEventListener("change", readSingleFile, false);
    var openDecrypt = document.getElementById("file-decrypttotxt");
    // Decrypts the opened file, then saves it as a decrypted file
    function decryptToTxt(e) {
        var file = e.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var contents = e.target.result;
          download("Save.pc", decryptStr(contents));
        };
        reader.readAsText(file);
    }
    openDecrypt.addEventListener("change", decryptToTxt, false);
    var button = document.getElementById("decrypt/encrypt");
    button.addEventListener("click", decrypt, false);
    var insertSpawnIdBut = document.getElementById("insertSpawnId");
    insertSpawnIdBut.addEventListener("click", function() {
        const str = window.prompt("Insert your Spawn ID here to spawn below the player");
        if (str == null) return;
        insertSpawnId(str);
    }, false);
    var copy = document.getElementById("copy");
    copy.addEventListener("click", copyToClipboard, false);
    var openFile = document.getElementById("open");
    openFile.addEventListener("click", function() {
        open.click();
    }, false);
    var save = document.getElementById("save");
    save.addEventListener("click", down, false);
    var decrypttotxt = document.getElementById("decrypttotxt");
    decrypttotxt.addEventListener("click", function() {
        openDecrypt.click();
    }, false);
}