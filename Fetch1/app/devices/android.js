
if (navigator.userAgent.search(/(Android)|(Chrome)/i) != -1) {
	var tag = document.createElement('style');

	tag.type = 'text/css';
	var css = document.createTextNode('header{ display: none; } nav{ top: 0; } .slide-animate{ margin-top: 44px; }');
	tag.appendChild(css);

	document.getElementsByTagName('head')[0].appendChild(tag);
}