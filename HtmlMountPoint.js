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

HtmlMountPoint.processNode = function(mountPointMap, node, nextFn) {
  var
    placeholderRegex = /\{(!! |# )([a-z0-9_-]+)\}/ig,
    value, result, type, startNode, endNode, mountPoint, key;

  nextFn = nextFn || function() {};
  // TODO create simplified implementation for single placeholder!
  do {
    value = node.nodeValue; // node and value is changing on each iteration!
    placeholderRegex.lastIndex = 0;
    result = placeholderRegex.exec(value);
    if (result) {
      type = (result[1] === '!! ' ? 'html' : 'dom');

      startNode = document.createComment('');
      endNode = document.createComment('');

      node = node.splitText(result.index);
      nextFn(node.previousSibling);
      node.parentNode.insertBefore(startNode, node);
      node = node.splitText(result[0].length);
      node.parentNode.insertBefore(endNode, node);

      key = ':' + result[2];
      mountPoint = new HtmlMountPoint(key, type, startNode, endNode);
      mountPointMap[key] = mountPointMap[key] || [];
      mountPointMap[key].push(mountPoint);
    }
  } while(result);

  nextFn(node);
  return node;
};
