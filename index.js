'use strict';

/**
 * swig middleware for koa
 * Copyright(c) 2015 KIT Mobile Internet Pty Ltd, Australia
 * MIT Licensed
 */

const _ = require('underscore');
const path = require('path');
const Swig = require('swig').Swig;

/**
 * Expose swig middleware
 *   opt.views
 *   opt.autoescape
 *   opt.varControls
 *   opt.tagControls
 *   opt.cmtControls
 *   opt.locals
 *   opt.cache
 *   opt.loader
 *   opt.filters
 *   opt.tags
 *   opt.extensions
 */

module.exports = function (opt) {
    //override default options
    opt = Object.assign({
        views: 'views',
        ext: 'swig'
    }, opt);

    let swigOpts = _.pick(opt, [
        'autoescape',
        'varControls',
        'tagControls',
        'cmtControls',
        'locals',
        'cache',
        'loader'
    ]);

    let swig = new Swig(swigOpts);

    opt.filters && (_.each(opt.filters, (filter, name) => swig.setFilter(name, filter)));
    opt.tags && (_.each(opt.tags, (tag, name) => swig.setTag(name, tag.parse, tag.compile, tag.ends, tag.blockLevel)));
    opt.extensions && (_.each(opt.extensions, (extension, name) => swig.setExtension(name, extension)));

    function* render(view, locals) {
        // extname
        let e = path.extname(view);

        if (!e) {
            view += '.' + opt.ext;
        }

        // resolve
        view = path.resolve(opt.views, view);

        if (this.swigLocals) {
            locals = Object.assign(this.swigLocals, locals);
        }

        return yield (done => swig.renderFile(view, locals, done));
    }

    return function* (next) {
        this.swig = swig;
        this.render = render;

        yield next;

        delete this.render;
        delete this.swig;
    };
};