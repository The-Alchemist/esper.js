'use strict';
const closer = require('closer');

const plugin = module.exports = {
    name: 'lang-clojure',
    parser: closer.parse,
    init: function(esper) {
        esper.languages.clojure = plugin;
    },
};
