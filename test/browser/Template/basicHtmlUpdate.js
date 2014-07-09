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
			console.assert(element.innerText === '{!! placeholder}');
			html = '<b>te</b><i>xt</i>';
			template.update({
				placeholder: html
			});
			console.assert(element.innerText === 'text');
			console.assert(element.innerHTML === '<!---->' + html + '<!---->'); // TODO remove comments later

			// dom
			template = new Template(['<div>{# placeholder}</div>']);
			element = template.getEl();

			console.assert(element.innerText === '{# placeholder}');
			dom = document.createElement('b');
			dom.innerText = 'text';
			template.update({
				placeholder: dom
			});
			console.assert(element.innerText === 'text');
			console.assert(element.innerHTML === '<!----><b>' + dom.innerText + '</b><!---->'); // TODO remove comments later
		},

		"should replace placeholder surrounded by another string with text in element's content": function() {
			var
				template = new Template(['<div>super{!! placeholder} can fly</div>']),
				element = template.getEl(),
				html, dom;

			// html
			console.assert(element.innerText === 'super{!! placeholder} can fly');
			html = '<b>m</b><i>a</i>n';
			template.update({
				placeholder: html
			});
			console.assert(element.innerText === 'superman can fly');
			console.assert(element.innerHTML === 'super' + '<!---->' + html + '<!---->' + ' can fly'); // TODO remove comments later

			// dom
			template = new Template(['<div>super{# placeholder} can fly</div>']);
			element = template.getEl();

			console.assert(element.innerText === 'super{# placeholder} can fly');
			dom = document.createElement('b');
			dom.innerText = 'man';
			template.update({
				placeholder: dom
			});
			console.assert(element.innerText === 'superman can fly');
			console.assert(element.innerHTML === 'super' + '<!----><b>' + dom.innerHTML + '</b><!---->' + ' can fly'); // TODO remove comments later
		},

		"should replace placeholders surrounded by another string and elements with text in element's content": function() {
			var
				template = new Template([
					'<div>',
						'<div>',
							'<b>{!! a}</b>{!! b}',
							'<b>{!! c}{!! d} {!! e}</b>',
							' {!! f} ',
						'</div>',
						'<div>',
							'<b>{# g}</b>{# h}',
							'<b>{# i}{# j} {# k}</b>',
							' {# l} ',
						'</div>',
					'</div>'
				]),
				element = template.getEl();

			console.assert(element.innerText === '{!! a}{!! b}{!! c}{!! d} {!! e} {!! f} {# g}{# h}{# i}{# j} {# k} {# l} ');
			template.update({
				a: '<b>a</b><i>a</i>', b: '<b>b</b><i>b</i>', c: '<b>c</b><i>c</i>',
				d: '<b>d</b><i>d</i>', e: '<b>e</b><i>e</i>', f: '<b>f</b><i>f</i>'
			});
			console.assert(element.innerText === 'aabbccdd ee ff {# g}{# h}{# i}{# j} {# k} {# l} ');
			function createDom(text) {
				var dom = document.createElement('b');
				dom.innerText = text;
				return dom;
			}
			template.update({
				g: createDom('g'), h: createDom('h'), i: createDom('i'),
				j: createDom('j'), k: createDom('k'), l: createDom('l')
			});
			console.assert(element.innerText === 'aabbccdd ee ff ghij k l ');

			// TODO check structure of dom too
		}

	};

	var test;
	for (test in tests) {
		if (tests.hasOwnProperty(test)) {
			tests[test]();
		}
	}

}());
