import qs from "query-string";

/**
 * @param  {} queryObj FeathersJS Query Object
 * @param {} isRoot for internal use (recursion) only
 * @return {} flattened Feathers Query
 */
export const flattenQuery = (queryObj, isRoot = true) => {
	const flatObj = {};
	for (const key in queryObj) {
		// key not in obj
		if (!queryObj.hasOwnProperty(key)) continue;

		// is nested?
		if (typeof queryObj[key] === "object" && !Array.isArray(queryObj[key])) {
			const flatObject = flattenQuery(queryObj[key], false);
			for (var nestedKey in flatObject) {
				// key not in obj
				if (!flatObject.hasOwnProperty(nestedKey)) continue;
				if (isRoot) {
					flatObj[key + nestedKey] = flatObject[nestedKey];
				} else {
					flatObj["[" + key + "]" + nestedKey] = flatObject[nestedKey];
				}
			}
		} else {
			if (!isRoot) {
				flatObj["[" + key + "]"] = queryObj[key];
			} else {
				flatObj[key] = queryObj[key];
			}
		}
	}
	return flatObj;
};

const removeUndefined = (obj) => {
	const cleanedData = {};
	Object.entries(obj).forEach(([key, value]) => {
		if (value !== undefined) {
			cleanedData[key] = value;
		}
	});
	return cleanedData;
};

export default (query) => {
	const newQuery = {};
	// undefined --> null
	// include empty arrays ?key=&...
	Object.entries(removeUndefined(flattenQuery(query))).forEach(
		([key, value]) => {
			if (Array.isArray(value) && value.length === 0) {
				newQuery[key] = [null];
			} else {
				newQuery[key] = value === undefined ? null : value;
			}
		}
	);
	return qs.stringify(newQuery);
};