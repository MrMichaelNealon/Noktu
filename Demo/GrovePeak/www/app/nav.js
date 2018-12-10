
const   NAV_STATE_COLLAPSED = false;
const   NAV_STATE_EXPANDED = true;

const   NAV_ANIMATION_PAUSE = 200;

const   NAV_SHOWMENU_DURATION = 150;
const   NAV_SHOWLINK_DURATION = 150;
const   NAV_POPLINK_DURATION = 150;

const   NAV_SHOWMENU_EASING = "swing";
const   NAV_SHOWLINK_EASING = "swing";
const   NAV_POPLINK_EASING = "linear";


const   menu_style = {
    "border_color": "white",
    "color": "white"
};


const   Nav = (function() {

    let _options = [
        {
            "id": "WhatWeDo-inner",
            "title": "WHAT WE DO",
            "text": "WHAT WE DO",
            "content": "content/WhatWeDo.html",
            "state": "collapsed"
        },
        {
            "id": "WhoWeServe-inner",
            "title": "WHO WE SERVE",
            "text": "WHO WE SERVE",
            "content": "content/WhoWeServe.html",
            "state": "collapsed"
        },
        {
            "id": "HowWeWork-inner",
            "title": "HOW WE WORK",
            "text": "HOW WE WORK",
            "content": "content/HowWeWork.html",
            "state": "collapsed"
        },
        {
            "id": "WhatSetsUsApart-inner",
            "title": "WHAT SETS US APART",
            "text": "WHAT SETS US APART",
            "content": "content/WhatSetsUsApart.html",
            "state": "collapsed"
        }
    ];


    let state = NAV_STATE_COLLAPSED;
    let locked = true;


///////////////////////////////////////////////////////////
//  _getNavLinkHTML()
//
//  View method returns a new "header-nav-option" class
//  element.
//
    let _getNavLink = function(option, index, top) {
        var style = "top: " + top + "; right: 0; ";

        if (index == 1 || index == 3)
            var style = "top: " + top + "; opacity: 0.01; ";

        $("#header-toggle-nav").css("border-top", "1px solid " + menu_style.border_color);
        //if (index >= 1)
        //    style += "border-top: none;";

        if (option.state != "collapsed") {
            $("#" + option.id + "-collapse").removeClass("expand");
            $("#" + option.id + "-collapse").addClass("contract");
            $("#" + option.id + "-collapse").attr("title", "Collapse");
            $("#" + option.id).css({
                "opacity": "0.99",
                "display": "block"
            });
        }
        else
            $("#" + option.id + "-collapse").attr("title", "Expand");

        return '\
            <div id="nav-option-' + index.toString() + '" \
                class="header-nav-option" \
                title="' + option.title + '" \
                style="\
                    ' + style + '\
                    border-bottom: 1px solid ' + menu_style.border_color + '; \
                    color: ' + menu_style.color + '; \
                " \
            >\
                <a id="link-' + index.toString() + '" \
                    style="opacity: 0.01;" \
                    link_index="' + index.toString() + '" \
                    class="nav-click" \
                >\
                    ' + option.text + '\
                </a>\
            </div>\
        ';
    };


    let _showLink = function(index, animation) {
        $("#nav-option-" + index.toString()).stop().animate(
            animation, NAV_SHOWLINK_DURATION, NAV_SHOWLINK_EASING
        );
    };


    let _hideLink = function(index, animation, _callback) {
        $("#nav-option-" + index).stop().animate(
            animation,
            NAV_SHOWLINK_DURATION,
            NAV_SHOWLINK_EASING, function() {
            if (typeof(_callback) === "function")
                _callback();
        })
    };


    let _popLink = function(index, _callback) {
        if (index >= _options.length) {
            if (typeof(_callback) === "function")
                _callback();
        }

        $("#link-" + index.toString()).css("display", "block");

        $("#link-" + index.toString()).stop().animate({
            "opacity": "0.99"
        }, NAV_POPLINK_DURATION, NAV_POPLINK_EASING, function() {
            _popLink((index + 1), _callback);
        });
    };


    let _unpopLink = function(index, _callback) {
        console.log("Unpopping " + index);
        if (index < 0) {
            if (typeof(_callback) === "function")
                _callback();
        }

        $("#link-" + index.toString()).stop().animate({
            "opacity": "0.01"
        }, NAV_POPLINK_DURATION, NAV_POPLINK_EASING, function() {
            console.log("Unpoppsed line " + index);
            $("#link-" + index.toString()).css("display", "none");
            _unpopLink((index - 1), _callback)
        })
    };


    let _showMenu = function() {
        state = NAV_STATE_EXPANDED;

        $("#overlay").css("display", "block");
        $(".header-nav-option").css("color", "#FFF");

        $("#overlay").animate(
            { "opacity": "0.50" },
            NAV_SHOWMENU_DURATION,
            NAV_SHOWMENU_EASING,
            function() {
        $("#header-toggle-nav").stop().animate({
            "width": "100%"
        }, NAV_SHOWMENU_DURATION, NAV_SHOWMENU_EASING, function() {
            $("#nav-option-1, #nav-option-3").css("display", "block");

            setTimeout(function() {
                _showLink("0", { "height": "100%" });
                _showLink("1", { "height": "100%", "opacity": "0.99", "top": "100%" });
                _showLink("2", { "height": "100%", "top": "200%" });
                _showLink("3", { "height": "100%", "opacity": "0.99", "top": "300%" });

                _popLink(0, function() {
                    $("#nav-option-0").animate({
                        "color": "#1E90FF"
                    }, 500, "linear", function() {
                        locked = false;
                        console.log("Links popped - unlocking");
                    });
                });
            }, NAV_ANIMATION_PAUSE);
        });
        });
    };


    let _hideMenu = function(_callback) {
        locked = true;
        _unpopLink(3, function() {
            console.log("Unpopped links, hiding menu...");

            // Step 2 - retract header-toggle-nav
            _hideLink("0", { "height": "50%" })
            _hideLink("1", { "height": "50%", "opacity": "0.01", "top": "0%" });
            _hideLink("2", { "height": "50%", "top": "50%" });
            _hideLink("3", { "height": "50%", "opacity": "0.01", "top": "50%" }, function() {
                setTimeout(function() {
                    $("#header-toggle-nav").stop().animate({
                        "width": "10%"
                    }, NAV_SHOWMENU_DURATION, "linear", function() {
                    //    $("#nav-option-1, #nav-option-3").css("display", "none");
                    //    $("#nav-option-2").css("top", "50%");
                        state = NAV_STATE_COLLAPSED;

                        $("#overlay").animate({
                            "opacity": "0.01"
                        },
                            NAV_SHOWMENU_DURATION,
                            NAV_SHOWMENU_EASING,
                            function() {
                                $("#overlay").css("display", "none");
                                if (typeof(_callback) === "function")
                                    _callback();
                                console.log("Menu hidden!");
                            }
                        );
                    });
                }, NAV_ANIMATION_PAUSE);
            });
        });
    };


    let _scrollTo = function(index) {
        var page_height = parseInt($("#content-inner").css("height").replace('px', ''));
        
        var section_top = parseInt($("#content-inner").css("padding-top").replace('px', ''));
        section_top += parseInt($("#content-header").css("height").replace('px', ''));

        var header_height = parseInt($("#header").css("height").replace('px', ''));

        //alert("PAdding top = " + section_top);
        //section_top = 0;
        for (var section = 0; section < index; section++) {
            section_top += parseInt($("#" + _options[section].id).css("height").replace('px', ''));
            section_top += 82;
        }

        section_top -= header_height;


       // console.log(`page_height == ${page_height} section_top == ${section_top}`)
        $("html, body").animate({
            scrollTop: section_top
        }, 500, "swing");

    };


    let _enableNavMouse = function() {
        $("#header-toggle-nav").on("click", function() {
            if (state == NAV_STATE_COLLAPSED) {
                _showMenu();
            }
        });

        $("#header-toggle-nav").on("mouseleave", function() {
            if (state == NAV_STATE_EXPANDED) {
                _hideMenu();
            }
        });

        $(".header-nav-option").on("mouseover", function() {
            if (locked)
                return;
            $(this).stop().animate({
                "color": "#1E90FF"
            }, 500, "linear");
        });
        $(".header-nav-option").on("mouseleave", function() {
            if (locked)
                return;
            $(this).stop().animate({
                "color": "#FFF"
            }, 500, "linear");
        }); 
        $(".nav-click").on("click", function() {
            if (locked)
                return;

            var link_index = parseInt($(this).attr("link_index"));
            //alert("Link " + _options[link_index].id);

            _hideMenu(function() {
                _scrollTo(link_index);
            });
        })
    };

;
    let _populateSections = function() {
        _options.forEach(function(option) {
            $("#" + option.id).load(option.content);
        });
    };


    let _refreshDisplay = function() {
        var footer_height = parseInt($("#footer").css("height").replace('px', ''));
        var image_height = parseInt($("#content-landscape").css("height").replace('px', ''));
    
        var content_padding = (footer_height + image_height);

        $("#content-inner").css({
            "padding-bottom": content_padding.toString() + "px"
        });
    //    $("#content-landscape").css({
    //        "top": "+=4px"
    //    });
    };


    let _initResponsive = function() {
        $(window).on("load", function() {
            _refreshDisplay();
        });
        $(window).on("resize", function() {
            _refreshDisplay();
        });
    };


    let _enableContentMouse = function() {
        $(".h1-toggle").on("click", function() {
            var index = parseInt($(this).attr("index_val"));
            if (_options[index].state == "collapsed") {
                $(this).removeClass("expand");
                $(this).addClass("contract");
                $(this).attr("title", "Collapse");
                var expand_height = parseInt($("#" + _options[index].id).css("height").replace('px', ''));
                $("#" + _options[index].id).css({
                    "opacity": "0.01",
                    "display": "block",
                    "height": "0px"
                });
                $("#" + _options[index].id).animate({
                    "height": expand_height.toString() + "px"
                }, 500, "linear", function() {
                    $("#" + _options[index].id).animate({
                        "opacity": "0.99"
                    }, 500, "linear", function() {
                        _options[index].state = "expanded";
                    });
                });
            }
            else {
                $(this).removeClass("contract");
                $(this).addClass("expand");
                $(this).attr("title", "Expand");
                $("#" + _options[index].id).css({
                    "opacity": "0.01",
                    "display": "none"
                });
                _options[index].state = "collapsed";
            }
        });
    }


///////////////////////////////////////////////////////////
//  _buildNav()
//
//  This method constructs the navigation menu toggler
//
    let _buildNav = function() {
        var nav = document.getElementById("header-toggle-nav");

        _options.forEach(function(option, index) {
            if (index >= 2)
                nav.innerHTML += _getNavLink(option, index, "50%");
            else
                nav.innerHTML += _getNavLink(option, index, "0%");
        });

        _enableNavMouse();
        _populateSections();
    //    _enableContentMouse();

        _initResponsive();
    };

 
    return {
        "buildNav":             _buildNav
    };


})();


const   buildNav = Nav.buildNav;

