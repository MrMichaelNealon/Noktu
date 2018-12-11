
    let _ContentEditor = function(options) {
        let _editor_id = options.editor_id;
        let _editor_el = document.getElementById(_editor_id);

        let _raw_el = null;

        let _editor_text = "";

        let _editor_view = "Text";

        let _options = options;


        let _saveData = function() {
            if (typeof(_options.localdatakey) === "string") {
                var data_key = _options.localdatakey;
                if (data_key != "")
                    localStorage.setItem(data_key, _editor_el.innerHTML);
            }
        };


        let _loadData = function() {
            if (typeof(_options.localdatakey) === "string") {
                var data_key = _options.localdatakey;
                if (data_key != "")
                    _editor_el.innerHTML = localStorage.getItem(data_key);
            }
        };


        let _showRaw = function() {
            if (_raw_el !== null) {
                _raw_el.textContent =  _editor_el.innerHTML;
            }
        };


        let _initKeyboardEvents = function() {
            _editor_el.addEventListener("keyup", function(key) {
                _saveData();
                _showRaw();

                console.log("Key pressed: " + key);
            });
        };


        let _initClickEvent = function(element_id, callback) {
            if (typeof(element_id) === "string") {
                if (element_id !== "") {
                    var el = document.getElementById(element_id);
                    el.addEventListener("click", function(event) {
                        callback(event);
                        _showRaw();
                    });
                }
            }
        };
 

        let _initMouseEvents = function() {
            _initClickEvent(_options.insertnode, insertNode);
            
            var strip_el = document.getElementById('strip');

            strip_el.addEventListener("click", function() {
                let selection;
                let range;
    
                let el_type = document.getElementById('select-node').value;
                let strip_inner = document.getElementById('strip-nodes').checked;
console.log("STRIP");
                if (window.getSelection) {
                    selection = window.getSelection();
                    html = getSelectedHTML();
                //    if (selection.text)
                //        html = selection.text;
                        
                    console.log("Strip >>> " + html);
                    if (selection.getRangeAt && selection.rangeCount) {
                        var _html = new String(stripHTMLTags(html));
                        var el = document.createElement(el_type);
    
                        range = selection.getRangeAt(0);
                        range.deleteContents();
    
                    //    var el = document.createElement(el_type);
    
                    //    range.insertNode(el);
                    //    el.innerHTML = _html;
                    }
                } else if (document.selection && document.selection.type != "Control") {
                    selection = document.selection.createRange();
                    html = selection;
                    if (selection.text)
                        html = selection.text;

                    _html = stripHTMLTags(html);
    
                    selection.pasteHTML(_html);
                }
    
                _showRaw();
            });
        };

        function getSelectedHTML() {
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }
            return html;
        };


        let stripHTMLTags = function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        };


        let insertNode = function() {
            let selection;
            let range;

            let el_type = document.getElementById('select-node').value;

            let el_class = document.getElementById('select-class').value;
            let el_style = document.getElementById('select-style').value;

            let str_class = document.getElementById(el_class).text;
            let str_style = document.getElementById(el_style).text;

            let strip_inner = document.getElementById('strip-nodes').checked;

            if (window.getSelection) {
                selection = window.getSelection();
                html = getSelectedHTML();
                if (selection.text)
                    html = selection.text;
                    
                if (selection.getRangeAt && selection.rangeCount) {
                    if (strip_inner)
                        var _html = new String(stripHTMLTags(html));
                    else
                        var _html = getSelectedHTML();
                  
                    console.log(_html);
                    var el = document.createElement(el_type);
                    range = selection.getRangeAt(0);
                    range.deleteContents();

                //    let cn = range.extractContents().;
                    console.log("CONTENTS: " + _html);

                    var el = document.createElement(el_type);
                    if (str_class != "none")
                        el.setAttribute("class", str_class);
                    if (str_style != "-- none")
                        el.setAttribute("style", str_style);

                    range.insertNode(el);
                    el.innerHTML = _html;
                }
            } else if (document.selection && document.selection.type != "Control") {
                // IE < 9
                selection = document.selection.createRange();
                html = selection;
                if (selection.text)
                    html = selection.text;
                if (selection.innerHTML)
                    html = selection.innerHTML;

                selection.pasteHTML(html);
            }

            _showRaw();
        };


        let initEditor = function() {
            _loadData();

            _initKeyboardEvents();
            _initMouseEvents();
            
            _showRaw();
        };


    ///////////////////////////////////////////////////////
    //  Constructor code.
    //
        if (typeof(_options.raw) === "string") {
            console.log("RAW == " + _options.raw);
            if (_options.raw !== "") {
                console.log("Attaching raw...");
                _raw_el = document.getElementById(_options.raw);
            }
        }
        
        if (typeof(_options.autoinit) === "boolean") {
            if (_options.autoinit)
                initEditor();
        }


        return {
            "init":             initEditor,

            "insertNode":       insertNode
        };
    };


    function ContentEditor(options) {
        if (typeof(options) !== "object")
            options = {};
        
        if (typeof(options.editor_id) !== "string")
            options.editor_id = "editor";

        return new _ContentEditor(options);
    }

