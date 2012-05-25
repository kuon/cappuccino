/***
 * CPLog+Loggers.js
 * Objective-J framework
 *
 * Part of the Cappuccino project.
 *
 * Licence and copyright in the LICENCE file.
 ***/


// CPLogAlert uses basic browser alert() functions
GLOBAL(CPLogAlert) = function(aString, aLevel, aTitle, aFormatter)
{
    if (typeof alert != "undefined" && !CPLogDisable)
    {
        var message = (aFormatter || _CPFormatLogMessage)(aString, aLevel, aTitle);
        CPLogDisable = !confirm(message + "\n\n(Click cancel to stop log alerts)");
    }
};

// CPLogPopup uses a slick popup window in the browser:
var CPLogWindow = null;
GLOBAL(CPLogPopup) = function(aString, aLevel, aTitle, aFormatter)
{
    try {
        if (CPLogDisable || window.open == undefined)
            return;

        if (!CPLogWindow || !CPLogWindow.document)
        {
            CPLogWindow = window.open("", "_blank", "width=600,height=400,status=no,resizable=yes,scrollbars=yes");

            if (!CPLogWindow) {
                CPLogDisable = !confirm(aString + "\n\n(Disable pop-up blocking for CPLog window; Click cancel to stop log alerts)");
                return;
            }

            _CPLogInitPopup(CPLogWindow);
        }

        var logDiv = CPLogWindow.document.createElement("div");
        logDiv.setAttribute("class", aLevel || "fatal");

        var message = (aFormatter || _CPFormatLogMessage)(aString, aFormatter ? aLevel : null, aTitle);

        logDiv.appendChild(CPLogWindow.document.createTextNode(message));
        CPLogWindow.log.appendChild(logDiv);

        if (CPLogWindow.focusEnabled.checked)
            CPLogWindow.focus();
        if (CPLogWindow.blockEnabled.checked)
            CPLogWindow.blockEnabled.checked = CPLogWindow.confirm(message+"\nContinue blocking?");
        if (CPLogWindow.scrollEnabled.checked)
            CPLogWindow.scrollToBottom();
    } catch(e) {
        // TODO: some error handling/reporting
    }
};

var CPLogPopupStyle ='<style type="text/css" media="screen"> \
body{font:10px Monaco,Courier,"Courier New",monospace,mono;padding-top:15px;} \
div > .fatal,div > .error,div > .warn,div > .info,div > .debug,div > .trace{display:none;overflow:hidden;white-space:pre;padding:0px 5px 0px 5px;margin-top:2px;-moz-border-radius:5px;-webkit-border-radius:5px;} \
div[wrap="yes"] > div{white-space:normal;} \
.fatal{background-color:#ffb2b3;} \
.error{background-color:#ffe2b2;} \
.warn{background-color:#fdffb2;} \
.info{background-color:#e4ffb2;} \
.debug{background-color:#a0e5a0;} \
.trace{background-color:#99b9ff;} \
.enfatal .fatal,.enerror .error,.enwarn .warn,.eninfo .info,.endebug .debug,.entrace .trace{display:block;} \
div#header{background-color:rgba(240,240,240,0.82);position:fixed;top:0px;left:0px;width:100%;border-bottom:1px solid rgba(0,0,0,0.33);text-align:center;} \
ul#enablers{display:inline-block;margin:1px 15px 0 15px;padding:2px 0 2px 0;} \
ul#enablers li{display:inline;padding:0px 5px 0px 5px;margin-left:4px;-moz-border-radius:5px;-webkit-border-radius:5px;} \
[enabled="no"]{opacity:0.25;} \
ul#options{display:inline-block;margin:0 15px 0px 15px;padding:0 0px;} \
ul#options li{margin:0 0 0 0;padding:0 0 0 0;display:inline;} \
</style>';

function _CPLogInitPopup(logWindow)
{
    var doc = logWindow.document;

    // HACK so that head is available below:
    doc.writeln("<html><head><title></title>"+CPLogPopupStyle+"</head><body></body></html>");

    doc.title = CPLogDefaultTitle + " Run Log";

    var head = doc.getElementsByTagName("head")[0];
    var body = doc.getElementsByTagName("body")[0];

    var base = window.location.protocol + "//" + window.location.host + window.location.pathname;
    base = base.substring(0,base.lastIndexOf("/")+1);

    var div = doc.createElement("div");
    div.setAttribute("id", "header");
    body.appendChild(div);

    // Enablers
    var ul = doc.createElement("ul");
    ul.setAttribute("id", "enablers");
    div.appendChild(ul);

    for (var i = 0; i < CPLogLevels.length; i++) {
        var li = doc.createElement("li");
        li.setAttribute("id", "en"+CPLogLevels[i]);
        li.setAttribute("class", CPLogLevels[i]);
        li.setAttribute("onclick", "toggle(this);");
        li.setAttribute("enabled", "yes");
        li.appendChild(doc.createTextNode(CPLogLevels[i]));
        ul.appendChild(li);
    }

    // Options
    var ul = doc.createElement("ul");
    ul.setAttribute("id", "options");
    div.appendChild(ul);

    var options = {"focus":["Focus",false], "block":["Block",false], "wrap":["Wrap",false], "scroll":["Scroll",true], "close":["Close",true]};
    for (o in options) {
        var li = doc.createElement("li");
        ul.appendChild(li);

        logWindow[o+"Enabled"] = doc.createElement("input");
        logWindow[o+"Enabled"].setAttribute("id", o);
        logWindow[o+"Enabled"].setAttribute("type", "checkbox");
        if (options[o][1])
            logWindow[o+"Enabled"].setAttribute("checked", "checked");
        li.appendChild(logWindow[o+"Enabled"]);

        var label = doc.createElement("label");
        label.setAttribute("for", o);
        label.appendChild(doc.createTextNode(options[o][0]));
        li.appendChild(label);
    }

    // Log
    logWindow.log = doc.createElement("div");
    logWindow.log.setAttribute("class", "enerror endebug enwarn eninfo enfatal entrace");
    body.appendChild(logWindow.log);

    logWindow.toggle = function(elem) {
        var enabled = (elem.getAttribute("enabled") == "yes") ? "no" : "yes";
        elem.setAttribute("enabled", enabled);

        if (enabled == "yes")
            logWindow.log.className += " " + elem.id;
        else
            logWindow.log.className = logWindow.log.className.replace(new RegExp("[\\s]*"+elem.id, "g"), "");
    };

    // Scroll
    logWindow.scrollToBottom = function() {
        logWindow.scrollTo(0, body.offsetHeight);
    };

    // Wrap
    logWindow.wrapEnabled.addEventListener("click", function() {
        logWindow.log.setAttribute("wrap", logWindow.wrapEnabled.checked ? "yes" : "no");
    }, false);

    // Clear
    logWindow.addEventListener("keydown", function(e) {
        var e = e || logWindow.event;
        if (e.keyCode == 75 && (e.ctrlKey || e.metaKey)) {
            while (logWindow.log.firstChild) {
                logWindow.log.removeChild(logWindow.log.firstChild);
            }
            e.preventDefault();
        }
    }, "false");

    // Parent closing
    window.addEventListener("unload", function() {
        if (logWindow && logWindow.closeEnabled && logWindow.closeEnabled.checked) {
            CPLogDisable = true;
            logWindow.close();
        }
    }, false);

    // Log popup closing
    logWindow.addEventListener("unload", function() {
        if (!CPLogDisable) {
            CPLogDisable = !confirm("Click cancel to stop logging");
        }
    }, false);
}


GLOBAL(CPLogDefault) = (typeof window === "object" && window.console) ? CPLogConsole : CPLogPopup;
