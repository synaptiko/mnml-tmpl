(function() {

	var tests = {

		'should replace placeholder with text in attribute': function() {
			var
				template = new Template(['<div class="{placeholder}"></div>']),
				element = template.getEl();

			console.assert(element.getAttribute('class') === '{placeholder}');
			template.update({
				placeholder: 'text'
			});
			console.assert(element.getAttribute('class') === 'text');
		},

		'should replace multiple placeholders with text in attributes': function() {
			var
				template = new Template(['<div class="{placeholder1}" tabindex="{placeholder2}" style="{placeholder3}"></div>']),
				element = template.getEl();

			console.assert(element.getAttribute('class') === '{placeholder1}');
			console.assert(element.getAttribute('tabindex') === '{placeholder2}');
			console.assert(element.getAttribute('style') === '{placeholder3}');
			template.update({
				placeholder1: 'text1'
			});
			console.assert(element.getAttribute('class') === 'text1');
			console.assert(element.getAttribute('tabindex') === '{placeholder2}');
			console.assert(element.getAttribute('style') === '{placeholder3}');
			template.update({
				placeholder2: 'text2'
			});
			console.assert(element.getAttribute('class') === 'text1');
			console.assert(element.getAttribute('tabindex') === 'text2');
			console.assert(element.getAttribute('style') === '{placeholder3}');
			template.update({
				placeholder3: 'text3'
			});
			console.assert(element.getAttribute('class') === 'text1');
			console.assert(element.getAttribute('tabindex') === 'text2');
			console.assert(element.getAttribute('style') === 'text3');
		},

		'should replace multiple placeholders with text in one attribute': function() {
			var
				template = new Template(['<div class="{placeholder1} {placeholder2} {placeholder3}"></div>']),
				element = template.getEl();

			console.assert(element.getAttribute('class') === '{placeholder1} {placeholder2} {placeholder3}');
			template.update({
				placeholder1: 'text1'
			});
			console.assert(element.getAttribute('class') === 'text1 {placeholder2} {placeholder3}');
			template.update({
				placeholder2: 'text2'
			});
			console.assert(element.getAttribute('class') === 'text1 text2 {placeholder3}');
			template.update({
				placeholder3: 'text3'
			});
			console.assert(element.getAttribute('class') === 'text1 text2 text3');
		},

		'should replace placeholder surrounded by another string with text in attribute': function() {
			var
				template = new Template(['<div class="super{placeholder} can fly"></div>']),
				element = template.getEl();

			console.assert(element.getAttribute('class') === 'super{placeholder} can fly');
			template.update({
				placeholder: 'man'
			});
			console.assert(element.getAttribute('class') === 'superman can fly');
		},

		"should replace placeholder with text in element's content": function() {
			var
				template = new Template(['<div>{placeholder}</div>']),
				element = template.getEl();

			console.assert(element.firstChild.nodeValue === '{placeholder}');
			template.update({
				placeholder: 'text'
			});
			console.assert(element.firstChild.nodeValue === 'text');
		},

		"should replace placeholder surrounded by another string with text in element's content": function() {
			var
				template = new Template(['<div>super{placeholder} can fly</div>']),
				element = template.getEl();

			console.assert(element.firstChild.nodeValue === 'super{placeholder} can fly');
			template.update({
				placeholder: 'man'
			});
			console.assert(element.firstChild.nodeValue === 'superman can fly');
		},

		"should replace placeholder surrounded by another string and elements with text in element's content": function() {
			var
				template = new Template(['<div><strong>super</strong>{placeholder} can <b>fly</b></div>']),
				element = template.getEl();

			console.assert(element.innerText === 'super{placeholder} can fly');
			console.assert(element.childNodes[1].nodeValue === '{placeholder} can ');
			template.update({
				placeholder: 'man'
			});
			console.assert(element.innerText === 'superman can fly');
			console.assert(element.childNodes[1].nodeValue === 'man can ');
		},

		'should replace multiple placeholders': function() {
			var
				template = new Template([
					'<div>',
						'{a} {b} ',
						'<b>{c}<i>{d}</i>{e}</b>',
						'<div>',
							'<span> {f} </span>',
							'<span> {g} </span>',
							'<span> {h} </span>',
							'{i} <span> {j} </span> {k}',
						'</div>{l}',
					'</div>'
				]),
				element = template.getEl();

			console.assert(element.innerText === '{a} {b} {c}{d}{e} {f}  {g}  {h} {i}  {j}  {k}{l}');
			template.update({
				a: 'a', b: 'b', c: 'c',
				d: 'd', e: 'e', f: 'f',
				g: 'g', h: 'h', i: 'i',
				j: 'j', k: 'k', l: 'l'
			});
			console.assert(element.innerText === 'a b cde f  g  h i  j  kl');

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
