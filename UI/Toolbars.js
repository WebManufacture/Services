Toolbar = M.GetModuleContainsUrl("UI/Toolbars.htm");

Toolbar.Init = function() {
    Toolbar.NoCache = false;
    Toolbar.SpienBar = Toolbar.get(".spien-bar");
    Toolbar.LList = Toolbar.get("#loader-list");
    Toolbar.LIcon = Toolbar.get("#loader-icon");
    //Toolbar.SpienBar.onmouseover = Toolbar.SpienBarHover;
    //Toolbar.SpienBar.onmouseout = Toolbar.SpienBarOut;
    L.LogInfo("Toolbars initialized!");
    M.OnModuleLoaded.subscribe(Toolbar.MLoaded);
    M.OnModuleLoad.subscribe(Toolbar.MLoad);
    AX.onAjaxStart.subscribe(Toolbar.ALoad);
    AX.onAjaxFinish.subscribe(Toolbar.ALoaded);
}

Toolbar.ALoad = function(url) {
    Toolbar.LIcon.show();
};

Toolbar.ALoaded = function(url) {
    Toolbar.LIcon.hide();
};

Toolbar.MLoad = function(url) {
    Toolbar.LIcon.show();
    var ll = DOM.get("#loader-list");
    var mod = ll.div(".module-line.loading");
    mod.attr("url", url);
    mod.html("<span class='name'>" + url + "</span>" + "<span class='info'>&nbsp;Loading...</span>");
    ll.show();
}

Toolbar.MLoaded = function(url, mod) {
    var mod = DOM.aget("url", url, "#loader-list .module-line");
    if (mod != null) {
        mod.get('.info').html(" complete");
        mod.cls("complete");
        mod.rcs("loading");
        var mods = DOM.all("#loader-list .module-line.loading");
        if (mods.length <= 0) {
            Toolbar.LIcon.hide();
            var ll = DOM.get("#loader-list");
            ll.empty();
            ll.hide();
        }
    }
}

Toolbar.SpienBarHover = function() {
    this.cls("over");
}

Toolbar.SpienBarOut = function() {
    this.rcs("over");
}

Toolbar.InitToolbar = function(toolbar) {
    var menus = toolbar._all(".menuitem");
    for (var i = 0; i < menus.length; i++) {
        Toolbar.InitItem(menus[i]);
    }
}

Toolbar.InitItem = function(item) {
    var icon = item.attr("icon");
    if (icon != null) {
	if (icon.start('http')){
	    item.style.backgroundImage = "url('" + icon + "')";
	}
	else{
	    item.style.backgroundImage = "url('Images/" + icon + "')";
	}
        item.style.backgroundRepeat = "no-repeat";
        item.style.backgroundPosition = "center center";
    }
}

Toolbar.Context = {};
Toolbar.Context.Selector = "div.toolbar";
Toolbar.Context.Condition = "ui-processing";
Toolbar.Context.Process = function(element) {
    Toolbar.InitToolbar(element);
};

Contexts.Add(Toolbar.Context);

Toolbar.BtnContext = {};
Toolbar.BtnContext.Selector = "[icon]";
Toolbar.BtnContext.Condition = "ui-processing";
Toolbar.BtnContext.Process = function(element) {
    Toolbar.InitItem(element);
};

Contexts.Add(Toolbar.BtnContext);
