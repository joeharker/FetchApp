//in this case any not iOS device
if (navigator.userAgent.search(/iPhone|iPad|iPod/i) === -1) {
	var tag = document.createElement('style');

	tag.type = 'text/css';
	var css = document.createTextNode('header{ display: none; } nav{ top: 0; } .slide-animate{ margin-top: 44px; }');
	tag.appendChild(css);

	document.getElementsByTagName('head')[0].appendChild(tag);
}