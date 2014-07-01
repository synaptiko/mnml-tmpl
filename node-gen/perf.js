var
  ce = function createElementFn(tag, attrs, children) {
    var i, el = document.createElement(tag);
    for (i = 0; i < attrs.length; i += 2) {
      el.setAttribute(attrs[i], attrs[i + 1]);
    }
    for (i = 0; i < children.length; i += 1) {
      el.appendChild(children[i]);
    }
    return el;
  };

function TemplateFn1() {
  return ce('div', ['class', 'something {baseCls} {cls} nothing'], [ce('h1', [], [document.createTextNode('Title: {title} - {testName}!!')]), ce('a', ['href', 'http://{host}/test.html'], [document.createTextNode('Test of {testName}')]), document.createTextNode(' '), ce('span', ['class', 'hidden'], [document.createTextNode('{testName}')]), ce('div', [], [document.createTextNode('{!! myHtml}')]), ce('div', [], [document.createTextNode('text around {!! myHtml} !!!')]), ce('div', [], [document.createTextNode('{title}{!! myHtml}{!! myAnotherHtml}{title}')]), document.createTextNode('{amphibian}{!! amphibian}'), ce('br', [], []), ce('br', [], []), ce('div', [], [document.createTextNode('{# subtemplate}')]), ce('div', ['events', '{item}'], [document.createTextNode('Load more...')]), ce('div', ['class', '{. cls}'], [document.createTextNode('Load less...')])]);
}

function TemplateFn2() {
  var html = [
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

  var el = document.createElement('div');
  el.innerHTML = html.join('');
  return el.firstChild;
}

console.time('template-all');
for (var i = 0; i < 10000; i++) {
  TemplateFn1();
}
console.timeEnd('template-all');

console.time('template-all');
for (var i = 0; i < 10000; i++) {
  TemplateFn2();
};
console.timeEnd('template-all');
