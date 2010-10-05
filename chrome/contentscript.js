// Simple JavaScript Templating.
(function(){var b={};this.tmpl=function e(a,c){var d=!/\W/.test(a)?b[a]=b[a]||e(document.getElementById(a).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+a.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return c?d(c):d}})();

var notificationQueue = [];
function displayNotification(title, body, showTime) {
  if (!document.getElementById("notification_tmpl")) {
    // Create and insert notification template
    var notificationTmpl = document.createElement('script');
    notificationTmpl.setAttribute("id", "notification_tmpl");
    notificationTmpl.setAttribute("type", "text/html");
    notificationTmpl.innerText = 
      '<div class="roar-body"><div class="roar"><div class="roar-bg">' +
        '<h3><%=title%></h3><p><%=body%></p>' +
      '</div></div></div>';
    document.body.insertBefore(notificationTmpl, document.body.firstChild);
  }

  // Create the overlay at the top of the page and fill it with data.
  var notificationHTML = tmpl('notification_tmpl', {title: title, body: body});
  var notification = document.createElement('div');
  notification.innerHTML = notificationHTML;

  notification.showTime = showTime;

  notificationQueue.push(notification);
  showNotification();
};

var notificationDisplaying = null;
function showNotification() {
  if (!notificationDisplaying) {
    var notification = notificationQueue.shift();
    if (notification) {
      document.body.insertBefore(notification, document.body.firstChild);
      notificationDisplaying = notification;
      window.setTimeout(removeNotification, notification.showTime);
    }
  }
};

function removeNotification() {
  if (notificationDisplaying) {
    document.body.removeChild(notificationDisplaying);
    notificationDisplaying = null;
    window.setTimeout(showNotification, 500);
  }
};


function displayAlerts(alerts) {
  for (var i = 0; i < alerts.length; i++) {
    switch (alerts[i].kind) {
      case 'checkin':
        var title = alerts[i].data.first_name + ' checked into';
        var body = alerts[i].data.site_icon ? '<img src="' + alerts[i].data.site_icon + '"/>&nbsp;' + alerts[i].data.site_name : alerts[i].data.site_name;
        displayNotification(title, body, 2000);
        break;
      default:
        break;
    }
  }
};


/**
 * @param data Object JSON decoded response.  Null if the request failed.
 */
function onBrowse(data) {
  // Only render the notification if this is a shopping site
  // the user is authenticated against the server.
  if (data && data.check_in) {
    var title = data.first_name + ", you checked into";  
    var body = data.site_icon ? '<img src="' + data.site_icon + '"/>&nbsp;' + data.site_name : data.site_name;
    displayNotification(title, body, 4000)
  }
};


/**
 * Handles data sent via chrome.extension.sendRequest().
 * @param request Object Data sent in the request.
 * @param sender Object Origin of the request.
 * @param callback Function The method to call when the request completes.
 */
function onRequest(request, sender, callback) {
  // Only supports the 'fetchTwitterFeed' method, although this could be
  // generalized into a more robust RPC system.
	switch (request.action) {
		case 'alert':
			displayAlerts(request.alerts);
			break;
	}
};


if (window.location.href.indexOf('piick.') == -1) {
  // Send the url to the server for processing.
  chrome.extension.sendRequest({'action' : 'browse',
                                'browseUrl': window.location.href}, onBrowse);
  // Wire up the listener.
  chrome.extension.onRequest.addListener(onRequest);
}

