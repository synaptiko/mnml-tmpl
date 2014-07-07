function TemplateFn() {
	console.time('template');
	var
		dce = document.createElement.bind(document),
		dctn = document.createTextNode.bind(document),
		ce = function createElementFn(tag, attrs, children) {
			var i, el = dce(tag);
			for (i = 0; i < attrs.length; i += 2) {
				el.setAttribute(attrs[i], attrs[i + 1]);
			}
			for (i = 0; i < children.length; i += 1) {
				el.appendChild(children[i]);
			}
			return el;
		},
		root = ce('div', ['class', 'something {baseCls} {cls} nothing'], [ce('h1', [], [dctn('Title: {title} - {testName}!!')]), ce('a', ['href', 'http://{host}/test.html'], [dctn('Test of {testName}')]), dctn(' '), ce('span', ['class', 'hidden'], [dctn('{testName}')]), ce('div', [], [dctn('{!! myHtml}')]), ce('div', [], [dctn('text around {!! myHtml} !!!')]), ce('div', [], [dctn('{title}{!! myHtml}{!! myAnotherHtml}{title}')]), dctn('{amphibian}{!! amphibian}'), ce('br', [], []), ce('br', [], []), ce('div', [], [dctn('{# subtemplate}')]), ce('div', ['events', '{item}'], [dctn('Load more...')]), ce('div', ['class', '{. cls}'], [dctn('Load less...')])]);
	console.timeEnd('template');
	return root;
}
