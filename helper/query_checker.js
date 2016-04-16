var ObjectId = require('mongoose').Types.ObjectId;
module.exports = QueryChecker;

function QueryChecker() {
	this.checkers = {};

}

QueryChecker.prototype.add = function(name, filter) {
	this.checkers[name] = filter;
};

QueryChecker.prototype.check = function(name) {
	return this.checker(this.checkers[name]);
};

QueryChecker.prototype.checker = function(checkingQueries) {
	var self = this;
	return function(req, res, next) {
		var validation = true;
		var error;

		checkingQueries.forEach(function(queryFilter) {
			var query = req.query[queryFilter.name];

			if (queryFilter.required) {
				if (!query) {
					validation = false;
					error = queryFilter.name + " is required in query";
					return;
				}
			}

			if (query && queryFilter.type) {
				if (self.validateQueryType(queryFilter.type, query) === false) {
					validation = false; error = queryFilter.name + " type is invalid. expecting " + functionName(queryFilter.type);
					return;
				}
			}

			if (query && queryFilter.handler) {
				queryFilter.handler(req.query, query);
			}
		});

		if (validation) {
			next();
		} else {
			throw new Error(error);
		}
	};
};

QueryChecker.prototype.validateQueryType = function(type, query) {
	switch(type) {
		case Array:
			return Array.isArray(query);
		case ObjectId:
			return ObjectId.isValid(query);
		case Number:
			return Number.isInteger(query);
	}

	return true;
};

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
	  return ret;
}
