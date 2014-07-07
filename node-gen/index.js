var fs = require('fs');
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

function createElementFn(tag, attrs, children) {
	var i, el = dce(tag);
	for (i = 0; i < attrs.length; i += 2) {
		el.setAttribute(attrs[i], attrs[i + 1]);
	}
	for (i = 0; i < children.length; i += 1) {
		el.appendChild(children[i]);
	}
	return el;
}

function TemplateFn() {
	console.time('template');
	var
		dce = document.createElement.bind(document),
		dctn = document.createTextNode.bind(document),
		ce = {ce:1},
		root = {root:1};
	console.timeEnd('template');
	return root;
}

var handler = new htmlparser.DomHandler(function (error, dom) {
	var result, templateFnString;

	if (error) {
		console.error(error);
	}
	else {
		result = [];
		createTemplate(dom, result);
		templateFnString = TemplateFn.toString().replace(
			'{ce:1}', createElementFn.toString().split('\n').join('\n    ')
		).replace(
			'{root:1}', result[0].toString()
		);
		console.log(templateFnString);
		fs.writeFileSync('./gen.js', templateFnString);
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
		toString: function() {
			var mergedAttrs = [];
			mergedAttrs = mergedAttrs.concat.apply(mergedAttrs, Object.keys(attrs).map(function(key) {
				return [key, attrs[key].replace(/'/g, "\\'")];
			}));

			return [
				'ce(',
					"'" + name + "', ",
					mergedAttrs.length > 0 ? "['" + mergedAttrs.join("', '") + "'], " : '[], ',
					this.children.length > 0 ? '[' + this.children.join(', ') + ']' : '[]',
				')'
			].join('');
		}
	};
}

function createTextNode(data) {
	return {
		toString: function() {
			return "dctn('" + data.replace(/'/g, "\\'") + "')";
		}
	};
}
