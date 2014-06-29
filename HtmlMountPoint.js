function HtmlMountPoint(key, type, startNode, endNode) {
	this.key = key;
	this.type = type;
	this.startNode = startNode;
	this.endNode = endNode;
	this.parentNode = startNode.parentNode;
}

HtmlMountPoint.prototype.update = function(key, value) {
	// TODO assert key === this.key
	this.value = value;
};

HtmlMountPoint.prototype.apply = function() {
	var node, nodeToRemove, newRootNode, childNodes, i, newNode;

	node = this.startNode.nextSibling;
	while(node !== this.endNode) {
		nodeToRemove = node;
		node = node.nextSibling;
		nodeToRemove.remove();
	}
	
	// TODO assert if this.type === 'html' => typeof this.value === 'string'
	if (typeof this.value === 'string') {
		newRootNode = document.createElement('div');
		newRootNode.innerHTML = this.value;

		childNodes = newRootNode.childNodes;
		while (childNodes.length > 0) {
			this.parentNode.insertBefore(childNodes[0], node);
		}
		newRootNode.remove();
	}
	// TODO assert if this.type === 'dom' => this.value instanceof Node
	else if (this.value instanceof Node) {
		this.parentNode.insertBefore(this.value, node);
	}
};

HtmlMountPoint.supportsAttributes = false;
// TODO create simplifed implementation for single placeholder!
HtmlMountPoint.checkAndCreate = function(list, node) {
	var
		placeholderRegex = /\{(!! |# )([a-z0-9_-]+)\}/ig,
		value, result, type, startNode, endNode, nodeToRemove, mountPoint, key, placeholder;

	do {
		value = node.nodeValue; // node and value is changing on each iteration!
		placeholderRegex.lastIndex = 0;
		result = placeholderRegex.exec(value);
		if (result) {
			type = (result[1] === '!! ' ? 'html' : 'dom');

			startNode = document.createComment('');
			endNode = document.createComment('');

			node = node.splitText(result.index);
			node.parentNode.insertBefore(startNode, node);
			nodeToRemove = node;
			node = node.splitText(result[0].length);
			node.parentNode.insertBefore(endNode, node);
			// FIXME this is here only because there is wrong assumption in Template.js when traversing nodes - we can visit one node twice... so we instead, as quick-fix, remove this text node
			nodeToRemove.remove();

			key = ':' + result[2];
			mountPoint = new HtmlMountPoint(key, type, startNode, endNode);
			list[key] = list[key] || [];
			list[key].push(mountPoint);
		}
	} while(result);
};
