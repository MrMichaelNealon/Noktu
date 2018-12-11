///////////////////////////////////////////////////////////
//  app/NodeEditor.js
//
//  Simple enough - the _NodeEditor object had two classes
//  of method - private and public.
//
//  Public methods are revealed via the object literal that
//  is returned when the object is created, the private
//  methods are prefixed with an _ character and are
//  for internal use so not revealed.
//

    let _NodeEditor = function(options) {
    //  The "editor_id" and "raw_id" values can be
    //  specified in options
        this._editor_id = "editor";
        this._raw_id = false;

        this._editor_el = false;
        this._raw_el = false;

    //  Every time we select a text range these are
    //  populated with the appropriate values.
        this._selected_text = "";
        this._selected_html = "";

    //  Old skool!
        let self = this;

    
    ///////////////////////////////////////////////////////
    //  _updateRaw()
    //
    //  Method updated the _raw_el (if it's assigned) with
    //  the innerHTML of the _eridot_el.
    //  
        let _updateRaw = function() {
            if (self._raw_el)
                self._raw_el.textContent = self._editor_el.innerHTML
        };


    ///////////////////////////////////////////////////////
    //  _getSelectedHTML()
    //
    //  Returns the innerHTML of the selected range in
    //  _editor_el.
    //
        let _getSelectedHTML = function() {
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
            } 
            else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }

            return html;
        };


    ///////////////////////////////////////////////////////
    //  stripInnerHTML()
    //
    //  Strips away the HTML tags in the selection
    //  leaving only the inner text.
    // 
        let stripInnerHTML = function() {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = self._selected_html;
            
            var _return_this = tmp.textContent || tmp.innerText || "";
    
            _updateRaw();

            return _return_this;
        };


    ///////////////////////////////////////////////////////
    //  replaceSelectedText()
    //
    //  Replaces the selected innerHTML with the inner
    //  plain text.
    //
    //  This is the method you want to invoke when you
    //  wish to strip the HTML tags from the selected
    //  range.
    //
        let replaceSelectedText = function() {
            var selection, range;
            
            replacementText = stripInnerHTML(self._selected_html);

            if (window.getSelection) {
                var el = document.createTextNode(replacementText);
                selection = window.getSelection();
                if (selection.rangeCount) {
                    range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(el);
                }
                
            //  Reposition caret.
                range.setStartAfter(el);
                range.setEndAfter(el); 
                selection.removeAllRanges();
                selection.addRange(range);
            } 
            else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                range.text = replacementText;
            }

            _updateRaw();
        };

        
    ///////////////////////////////////////////////////////
    //  insertNode()
    //
    //  As the name suggests - method inserts a node, it
    //  depends on whether there's a selected range or nor.
    //
    //  If a range is selected then the selected text is
    //  wrapped in the new element container. If no text
    //  is selected then the empty element container is
    //  inserted at the current caret position.
    //
        let insertNode = function(options) {
            let selection;
            let range;
            
            if (window.getSelection) {
                selection = window.getSelection();
                html = _getSelectedHTML();

                if (selection.text)
                    html = selection.text;
                    
                if (selection.getRangeAt && selection.rangeCount) {
                //  If the "striptags" option is set then the
                //  selected text is first filtered through the
                //  stripInnerHTML() method.
                    if (options.striptags)
                        var _html = new String(stripInnerHTML(html));
                    else
                        var _html = _getSelectedHTML();
                  
                    var el = document.createElement(options.tag_name);
                    
                    range = selection.getRangeAt(0);
                    range.deleteContents();

                    var el = document.createElement(options.tag_name);
                
                //  St any class or style attributes.
                    if (typeof(options.class_name) !== "undefined" && options.class_name != "none")
                        el.setAttribute("class", options.class_name);
                    if (typeof(options.style) !== "undefined" && options.style != "none")
                        el.setAttribute("style", options.style);

                    range.insertNode(el);
                    el.innerHTML = _html;

                //  reposition caret.
                    range.setStartAfter(el);
                    range.setEndAfter(el); 
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } 
            else if (document.selection && document.selection.type != "Control") {
                selection = document.selection.createRange();
                html = selection;
                if (selection.text)
                    html = selection.text;
                if (selection.innerHTML)
                    html = selection.innerHTML;
                selection.pasteHTML(html);
            }
            
            _updateRaw();
        };


    ///////////////////////////////////////////////////////
    //  _recordSelection()
    //
    //  This method records the current text selection to
    //  the _selected_text buffer and copied the selected
    //  HTML (see _getSelectedHTML) to the _selected_html
    //  buffer.
    //
        let _recordSelection = function() {
            var userSelection;

            if (window.getSelection)
                userSelection = window.getSelection();
            else if (document.selection)
                userSelection = document.selection.createRange();

            var selected_text = userSelection;

            if (userSelection.text)
                selected_text = userSelection.text;
            
            self._selected_text = selected_text;
            self._selected_html = _getSelectedHTML();

            _updateRaw();
        };


    ///////////////////////////////////////////////////////
    //  _initEvents()
    //
    //  Initialises keyboard and mouse events.
    //
        let _initEvents = function() {
            self._editor_el.addEventListener("mouseup", function() {
                _recordSelection();
            });
            self._editor_el.addEventListener("keyup", function() {
                _recordSelection();
            });
        };


    ///////////////////////////////////////////////////////
    //  _initialise()
    //
    //  As you'd expect, processes options and initialises
    //  the object.
    //
        let _initialise = function(options) {
        //  Options to set element ID's
            if (options.hasOwnProperty("editor_id"))
                self._editor_id = options.editor_id;
            if (options.hasOwnProperty("raw_id"))
                self._raw_id = options.raw_id;

        //  Assign the _editor_el - this always points to
        //  the ContentEditable element.
            self._editor_el = document.getElementById(self._editor_id);

        //  Only assign the _raw_id  if the "raw_id" option
        //  was set.
            if (self._raw_id)
                self._raw_el = document.getElementById(self._raw_id);
    
            _initEvents();
            _updateRaw();
        };


    ///////////////////////////////////////////////////////
    //  Construction.
    //    
        _initialise(options);

        
        return {
            "replaceSelectedText":      replaceSelectedText,
            "insertNode":               insertNode
        };

    };


///////////////////////////////////////////////////////////
//  NodeEditor()
//
//  Factory function that returns a new _NodeEditor
//  object.
//
//  Some checks can be done here before options are
    function NodeEditor(options) {
        if (typeof options === "undefined")
            options = {};

        return new _NodeEditor(options);
    }

