walkway.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ walkway.showFirefoxContextMenu(e); }, false);
};

walkway.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-walkway").hidden = gContextMenu.onImage;
};

window.addEventListener("load", walkway.onFirefoxLoad, false);
