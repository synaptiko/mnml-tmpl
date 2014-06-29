function TextMountPoint(node) {
	this.node = node;
	this.valueModel = [
		node.nodeValue
	];
	this.placeholdersMap = {};
}

TextMountPoint.prototype._add = function(definition) {
	var
		rest = this.valueModel.pop(),
		key = definition.key,
		startIndex = definition.startIndex,
		length = definition.length,
		offset, placeholderStartIndex, placeholderEndIndex, placeholderModelIndex;

	offset = this.valueModel.reduce(function(previousValue, currentValue) {
		return previousValue + currentValue.length;
	}, 0);

	placeholderStartIndex = (startIndex - offset);
	placeholderEndIndex = (startIndex + length - offset);

	this.valueModel.push(rest.substring(0, placeholderStartIndex));
	placeholderModelIndex = this.valueModel.length;
	this.valueModel.push(rest.substring(placeholderStartIndex, placeholderEndIndex));
	if (rest.length > placeholderEndIndex) {
		this.valueModel.push(rest.substring(placeholderEndIndex, rest.length));
	}

	this.placeholdersMap[key] = this.placeholdersMap[key] || [];
	this.placeholdersMap[key].push(placeholderModelIndex);
};

TextMountPoint.prototype._contains = function(key) {
	return this.placeholdersMap.hasOwnProperty(key);
};

TextMountPoint.prototype.update = function(key, value) {
	var placeholders, length, i, placeholder;

	if (this.placeholdersMap.hasOwnProperty(key)) {
		placeholders = this.placeholdersMap[key];
		length = placeholders.length;
		for (i = 0; i < length; i++) {
			placeholder = placeholders[i];
			this.valueModel[placeholder] = value;
		}
	}
};

TextMountPoint.prototype.apply = function() {
	this.node.nodeValue = this.valueModel.join('');
};

TextMountPoint.supportsAttributes = true;
// TODO create simplifed implementation for single placeholder!
TextMountPoint.checkAndCreate = function(list, node) {
	var
		placeholderRegex = /\{([a-z0-9_-]+)\}/ig,
		value = node.nodeValue,
		result, mountPoint, key, placeholder;

	do {
		result = placeholderRegex.exec(value);
		if (result) {
			mountPoint = mountPoint || new TextMountPoint(node, value);

			placeholder = result[0];
			key = ':' + result[1];

			if (!mountPoint._contains(key)) {
				list[key] = list[key] || [];
				list[key].push(mountPoint);
			}

			mountPoint._add({
				key: key,
				startIndex: result.index,
				length: placeholder.length
			});
		}
	} while(result);
};
