
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
            "id": "WhatWeDo",
            "title": "WHAT WE DO",
            "text": "WHAT WE DO",
            "section": "content/WhatWeDo.html"
        },
        {
            "id": "WhoWeServe",
            "title": "WHO WE SERVE",
            "text": "WHO WE SERVE",
            "section": "content/WhoWeServe.html"
        },
        {
            "id": "HowWeWork",
            "title": "HOW WE WORK",
            "text": "HOW WE WORK",
            "section": "content/HowWeWork.html"
        },
        {
            "id": "WhatSetsUsApart",
            "title": "WHAT SETS US APART",
            "text": "WHAT SETS US APART",
            "section": "content/WhatSetsUsApart.html"
        }
    ];


    let state = NAV_STATE_COLLAPSED;


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
                _showLink("0", { "height": "75%" });
                _showLink("1", { "height": "75%", "opacity": "0.99", "top": "70%" });
                _showLink("2", { "height": "75%", "top": "140%" });
                _showLink("3", { "height": "75%", "opacity": "0.99", "top": "210%" });

                _popLink(0, function() {
                    console.log("Links popped - unlocking");
                });
            }, NAV_ANIMATION_PAUSE);
        });
        });
    };


    let _hideMenu = function() {
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
                                console.log("Menu hidden!");
                            }
                        );
                    });
                }, NAV_ANIMATION_PAUSE);
            });
        });
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
        })
    };


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
    };

 
    return {
        "buildNav":             _buildNav
    };


})();


const   buildNav = Nav.buildNav;

