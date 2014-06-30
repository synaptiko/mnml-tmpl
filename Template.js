function Template(templateHtml, initialData) {
  this.root = document.createElement('div');
  this.mountPointMap = {};

  if (templateHtml instanceof Array) {
    templateHtml = templateHtml.join('');
  }
  this.root.innerHTML = templateHtml;

  this._traverse(this.root, {
    node: {
      process: function(mountPointMap, node) {
        return HtmlMountPoint.processNode(mountPointMap, node, function(node) {
          TextMountPoint.processNode(mountPointMap, node);
        });
      }
    },
    attribute: {
      process: function(mountPointMap, attribute) {
        ClassMountPoint.processAttribute(mountPointMap, attribute, function(attribute) {
          TextMountPoint.processAttribute(mountPointMap, attribute);
        });
      }
    }
  });

  if (initialData) {
    this.update(initialData);
  }
}

Template.prototype._traverse = function(root, mountPoints) {
  var i, node;

  if (root.nodeType === Node.ELEMENT_NODE) {
    this._traverseAttributes(root, mountPoints.attribute);
  }

  node = root.firstChild;
  while (node) {
    switch(node.nodeType) {
      case Node.ELEMENT_NODE:
        this._traverse(node, mountPoints);
        break;
      case Node.TEXT_NODE:
        node = mountPoints.node.process(this.mountPointMap, node);
        break;
      default:
        // nothing to do
    }
    node = node.nextSibling;
  }
};

Template.prototype._traverseAttributes = function(node, attributeMountPoints) {
  var attributes, length, i, attribute;

  attributes = node.attributes;
  length = attributes.length;
  for (i = 0; i < length; i++) {
    attribute = attributes[i];
    attributeMountPoints.process(this.mountPointMap, attribute);
  }
};

Template.prototype.getEl = function() {
  // TODO add some assert or something if there is more than one element under root
  return this.root.firstChild;
};

Template.prototype.update = function(data) {
  var
    mountPointMap = this.mountPointMap,
    mountPointsToApply = [],
    key, value, mountPoints, length;

  if (!data) {
    return;
  }

  for (key in data) {
    if (data.hasOwnProperty(key)) {
      value = data[key];
      key = ':' + key;
      // TODO add assert if key is not in mountPointMap!
      if (mountPointMap.hasOwnProperty(key)) {
        mountPoints = mountPointMap[key];
        length = mountPoints.length;
        for (i = 0; i < length; i++) {
          mountPoints[i].update(key, value);
          // one mount point can update more than one key, so we "buffer" changes and then apply them in batch
          if (mountPointsToApply.indexOf(mountPoints[i]) === -1) {
            mountPointsToApply.push(mountPoints[i]);
          }
        }
      }
    }
  }

  length = mountPointsToApply.length;
  for (i = 0; i < length; i++) {
    mountPointsToApply[i].apply();
  }
};
