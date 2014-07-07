function ClassMountPoint() {

}

ClassMountPoint.processAttribute = function(mountPointMap, attribute, nextFn) {
	nextFn = nextFn || function() {};
	// TODO
	nextFn(attribute);
};
