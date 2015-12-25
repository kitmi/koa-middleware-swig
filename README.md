# koa-middleware-swig

[Koa][] view render middleware based on [Swig][], support tags, filters, and extensions. Forked form github.com/koa-modules/swig

### Usage

* **Koa v1.x**

    ```js
    const swig = require('koa-middleware-swig');
    app.use(swig(settings));
    ```

#### Install

```
npm install koa-middleware-swig
```

#### Features

* Use separate swig instance.

#### Example

```js
var koa = require('koa');
var swig = require('koa-middleware-swig');
var app = koa();

app.use(swig({
  views: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory', // disable, set to false
  ext: 'html',
  locals: locals,
  filters: filters,
  tags: tags,
  extensions: extensions
}));

app.use(function *() {
    //can still access swig object by this.swig
  this.body = yield this.render('index');
});

app.listen(2333);
```

#### Settings

* [swig options](http://paularmstrong.github.io/swig/docs/api/#SwigOpts)
  - autoescape
  - cache
  - locals
  - varControls
  - tagControls
  - cmtControls

* filters: swig custom [filters](http://paularmstrong.github.io/swig/docs/extending/#filters)

* tags: swig custom [tags](http://paularmstrong.github.io/swig/docs/extending/#tags)

* extensions: add extensions for custom tags

* ext: default view extname

* root: view root directory

* writeBody: default(true) auto write body and response


#### Others

* [swig-extras](https://github.com/paularmstrong/swig-extras) A collection of handy tags, filters, and extensions for Swig.

### Licences

MIT

[koa]: http://koajs.com
[swig]: http://paularmstrong.github.io/swig/
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE