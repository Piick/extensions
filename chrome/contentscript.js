/**
 * @param data Object JSON decoded response.  Null if the request failed.
 */
function onText(data) {
  // Only render the notification if this is a shopping site
  // the user is authenticated against the server.
  if (data && data.check_in) {

    // Create the overlay at the top of the page and fill it with data.
    var roar_body = document.createElement('div');
    roar_body.setAttribute("class",'roar-body');
    var roar = document.createElement('div');
    roar.setAttribute("class",'roar');
    roar_body.appendChild(roar);
    var roar_bg = document.createElement('div');
    roar_bg.setAttribute("class",'roar-bg');
    roar.appendChild(roar_bg);

    var title = document.createElement('h3');
    title.innerText = data.first_name + ", you checked into";
    roar_bg.appendChild(title);

    var p = document.createElement('p');
    if (data.site_icon) {
        p.innerHTML = '<img src="' + data.site_icon + '"/>&nbsp;' + data.site_name;
    }
    else {
        p.innerHTML = data.site_name;
    }
    roar_bg.appendChild(p);
    
    document.body.insertBefore(roar_body, document.body.firstChild);
    
    window.setTimeout(function() {
        document.body.removeChild(roar_body);
    }, 4000);
  }
};

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
};

chrome.extension.sendRequest({'action' : 'browse', 
                              'browseUrl': window.location.href}, onText);
