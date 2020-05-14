'use strict';
/* @flow */

let Engine;

function esper(opts) {
	return new Engine(opts);
}
module.exports = esper;

Engine = require('./Engine');
esper.plugins = {'lang-javascript': require('./lang-javascript.js')};
esper.Engine = Engine;
esper.Evaluator = require('./Evaluator');
esper.Value = require('./Value');
esper.PrimitiveValue = require('./values/PrimitiveValue');
esper.ASTPreprocessor = require('./ASTPreprocessor');
esper.FutureValue = require('./values/FutureValue');
esper.SmartLinkValue = require('./values/SmartLinkValue');
esper.ObjectValue = require('./values/ObjectValue');
esper.StringValue = require('./values/StringValue');
esper.ArrayValue = require('./values/ArrayValue');
esper.EasyNativeFunction = require('./values/EasyNativeFunction');
esper.EasyObjectValue = require('./values/EasyObjectValue');
esper.CompletionRecord = require('./CompletionRecord');
esper.Realm = require('./Realm');
esper.EvaluatorHandlers = require('./EvaluatorHandlers');
esper.PropertyDescriptor = require('./values/PropertyDescriptor');

esper.eval = function(source) {
	return new Engine().evalSync(source).toNative();
};

esper.version = require('../package.json').version;

esper.languages = {
	javascript: esper.plugins['lang-javascript']
};

esper.hooks = {
	setupEngine: []
}

esper.plugin = function(name) {
	let pl;
	if ( !esper.plugins[name] ) {
		//console.log("Loading ", name, '../plugins/' + name + '/index.js');
		let pl = require('../plugins/' + name + '/index.js');
		if ( name != pl.name ) throw new Error(`Loaded plugin as "${name}" but it had name "${pl.name}"`);
		if ( !esper.plugins[name] ) esper._registerPlugin(pl);
	}
	return esper.plugins[name];
};

esper._registerPlugin = function(pl) {
	if ( typeof pl.init !== 'function' ) throw new Error('Tried to add a plugin without an init method.');
	if ( typeof pl.name !== 'string' ) throw new Error('Tried to add a plugin without a name.');
	esper.plugins[pl.name] = pl;
	pl.init(esper);
};

var list = require('../plugin-list.js');
esper.pluginList = list;
for ( let pl in list ) {
	if ( list[pl] == 'bundle' ) esper.plugin(pl);
}




