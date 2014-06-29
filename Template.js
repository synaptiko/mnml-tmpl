function Template(templateHtml, initialData) {
	this.root = document.createElement('div');
	this.mountPointsMap = {};

	if (templateHtml instanceof Array) {
		templateHtml = templateHtml.join('');
	}
	this.root.innerHTML = templateHtml;

	this._traverse(this.root, HtmlMountPoint);
	this._traverse(this.root, TextMountPoint);

	if (initialData) {
		this.update(initialData);
	}
}

Template.prototype._traverse = function(root, MountPoint) {
	var nodes, i, element;

	// FIXME improve this cycle when MountPoint modify dom!
	nodes = root.childNodes;
	for (i = 0; i < nodes.length; i++) {
		element = nodes[i];
		type = element.nodeType;
		switch(type) {
			case Node.ELEMENT_NODE:
				if (MountPoint.supportsAttributes) {
					this._traverseAttributes(element, MountPoint);
				}
				this._traverse(element, MountPoint);
				break;
			case Node.TEXT_NODE:
				MountPoint.checkAndCreate(this.mountPointsMap, element);
				break;
			default:
				// nothing to do
		}
	}
};

Template.prototype._traverseAttributes = function(element, MountPoint) {
	var attributes, length, i;

	attributes = element.attributes;
	length = attributes.length;
	for (i = 0; i < length; i++) {
		attribute = attributes[i];
		MountPoint.checkAndCreate(this.mountPointsMap, attribute);
	}
};

Template.prototype.getEl = function() {
	// TODO add some assert or something if there is more than one element under root
	return this.root.firstChild;
};

Template.prototype.update = function(data) {
	var
		mountPointsMap = this.mountPointsMap,
		mountPointsToApply = [],
		key, value, mountPoints, length;

	if (!data) {
		return;
	}

	for (key in data) {
		if (data.hasOwnProperty(key)) {
			value = data[key];
			key = ':' + key;
			if (mountPointsMap.hasOwnProperty(key)) { // TODO add assert if key is not in mountPointsMap!
				mountPoints = mountPointsMap[key];
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
