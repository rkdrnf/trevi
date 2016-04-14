module.exports = QueryChecker;

function QueryChecker() {
	this.checkers = {};

};

QueryChecker.prototype.add = function(name, filter) {
	this.checkers.name = filter;
};

QueryChecker.prototype.check = function(name) {
	return this.checker(checkers[name]);
};

QueryChecker.prototype.checker = function(checkingQueries) {
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

			if (queryFilter.type) {
				if (validateQueryType(type, query) == false) {
					validation = false;
					error = queryFilter.name + " type is invalid. expecting " + queryFilter.type;
					return;
				}
			}
		});

		if (validation) {
			next();
		} else {
			throw new Error(error);
		}
	}
};


