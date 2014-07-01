var htmlparser = require("htmlparser2");
var rawHtml = [
  '<div class="something {baseCls} {cls} nothing">',
    '<h1>Title: {title} - {testName}!!</h1>',
    '<a href="http://{host}/test.html">Test of {testName}</a> <span class="hidden">{testName}</span>',
    '<div>{!! myHtml}</div>', // for insertion of html
    '<div>text around {!! myHtml} !!!</div>', // for insertion of html
    '<div>{title}{!! myHtml}{!! myAnotherHtml}{title}</div>', // for insertion of html
    '{amphibian}{!! amphibian}', // for insertion of html
    '<br/><br/>',
    '<div>{# subtemplate}</div>', // for insertion of reference to dom
    '<div events="{item}">Load more...</div>', // for event-mounting
    '<div class="{. cls}">Load less...</div>', // for class-list/set support
  '</div>'
];
var handler = new htmlparser.DomHandler(function (error, dom) {
	var result;

	if (error) {
		console.error(error);
	}
	else {
		console.log(dom);
		result = [];
		createTemplate(dom, result);
		console.log('var root = ' + result[0]);
	}
});

var parser = new htmlparser.Parser(handler);
parser.write(rawHtml.join(''));
parser.done();

function createTemplate(dom, root) {
	var i, node, element, textNode;

	for (i = 0; i < dom.length; i++) {
		node = dom[i];
		if (node.type === 'tag') {
			element = createElement(node.name, node.attribs);
			createTemplate(node.children, element.children);
			root.push(element);
		}
		else if (node.type === 'text') {
			textNode = createTextNode(node.data);
			root.push(textNode);
		}
	}
}

function createElement(name, attrs) {
	return {
		children: [],
		attrs: attrs,
		toString: function() {
			var attrs = '';
			if (Object.keys(this.attrs).length > 0) {
				attrs = "var a=" + JSON.stringify(this.attrs) + ";for(k in a){if(a.hasOwnProperty(k)) el.setAttribute(k,a[k])};";
			}
			var children = '';
			if (this.children.length > 0) {
				children = 'el.appendChild(';
				children += this.children.join(');el.appendChild(');
				children += ');';
			}
			return "function(el){" + attrs + children + "return el}(dce('" + name + "'))";
		}
	};
}

function createTextNode(data) {
	return {
		toString: function() {
			return "dctn('" + data + "')";
		}
	};
}

/////
/*var dce = document.createElement.bind(document);
var dctn = document.createTextNode.bind(document);
var root = function(el) {
	var a = {n:'v'};
	for (k in a) {
		if (a.hasOwnProperty(k)) el.setAttribute(k, a[k]);
	}
	el.appendChild(dctn('text'));
	el.appendChild(function(el) {
		el.appendChild(dctn('text'));
		return el;
	}(dce('div')));
	el.appendChild(dctn('text'));
	return el;
}(dce('div'));*/
