(function() {

	var tests = {

		"shouldn't replace placeholders with html/dom in attribute": function() {
			var
				template = new Template(['<div class="{!! placeholder1}" tabindex="{# placeholder2}"></div>']),
				element = template.getEl();

			console.assert(element.getAttribute('class') === '{!! placeholder1}');
			console.assert(element.getAttribute('tabindex') === '{# placeholder2}');
			template.update({
				placeholder1: '<b>te</b><i>xt</i>',
				placeholder2: document.createElement('div')
			});
			console.assert(element.getAttribute('class') === '{!! placeholder1}');
			console.assert(element.getAttribute('tabindex') === '{# placeholder2}');
		},

		"should replace placeholder with html/dom in element's content": function() {
			var
				template = new Template(['<div>{!! placeholder}</div>']),
				element = template.getEl(),
				html, dom;

			// html
			console.assert(element.firstChild.nodeValue === '{!! placeholder}');
			html = '<b>te</b><i>xt</i>';
			template.update({
				placeholder: html
			});
			console.assert(element.innerText === 'text');
			console.assert(element.innerHTML === html);

			// dom
			template = new Template(['<div>{# placeholder}</div>']);
			element = template.getEl();

			console.assert(element.firstChild.nodeValue === '{# placeholder}');
			dom = document.createElement('b');
			dom.innerText = 'text';
			template.update({
				placeholder: dom
			});
			console.assert(element.innerText === 'text');
			console.assert(element.innerHTML === '<b>text</b>');
		},

		"should replace placeholder surrounded by another string with text in element's content": function() {
			var
				template = new Template(['<div>super{!! placeholder} can fly</div>']),
				element = template.getEl(),
				html, dom;

			// html
			console.assert(element.firstChild.nodeValue === 'super{!! placeholder} can fly');
			html = '<b>m</b><i>a</i>n';
			template.update({
				placeholder: html
			});
			console.assert(element.firstChild.innerText === 'superman can fly');
			console.assert(element.innerHTML === 'super' + html + ' can fly');

			// dom
			template = new Template(['<div>super{# placeholder} can fly</div>']);
			element = template.getEl();

			console.assert(element.firstChild.nodeValue === 'super{# placeholder} can fly');
			dom = document.createElement('b');
			dom.innerText = 'man';
			template.update({
				placeholder: dom
			});
			console.assert(element.firstChild.innerText === 'superman can fly');
			console.assert(element.innerHTML === 'super' + dom.innerHTML + ' can fly');
		}

	};

	var test;
	for (test in tests) {
		if (tests.hasOwnProperty(test)) {
			tests[test]();
		}
	}

}());
