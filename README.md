# Barebones Share Buttons

A light weight library to fetch social sharing information from APIs that support JSONP.

Take a look at the [demo page](http://finderau.github.io/share-buttons/examples/) to see it in action.

## Why?

The majority of libraries available for providing share buttons provide additions that you probably don't need (eg CSS, tracking scripts etc). This library provides you with a way to progressively enhance a basic link to a social networks sharing page to include a popup window and a call to their API for the amount of shares your page has had.

## Install

You can grab a copy of the files from the `./dist` directory or install via Bower.

```
bower install barebones-share-buttons
```

## Basic usage

In the following example we're using a link to Facebook's sharer page, and we're going to include an element to show how many times our page (finder.com.au) has been shared.

Along with many other social networks, Facebook allow you to share a page via a URL with a specific parameter for the page you want to share. In Facebook's case they use a `u` parameter.

###HTML

```html
<a data-sharebutton href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.finder.com.au">Facebook <span data-sharecount>0</span></a>
```

### JavaScript

```javascript
sharebuttons.init();
```

In our HTML the `data-sharebutton` indicates to the library that this link is for social sharing, by default this will make the link appear in a pop up window on desktop browsers.

If you include an element with a`data-sharecount` attribute, the library will determine that you want to fetch the amount of shares for the page featured in the URL parameter. By default Facebook and Twitter are supported.

## Advanced usage

The call to Sharebuttons can use an options object to override default behaviour.

* `selector` string - default selector to use to get the links
* `loadedClass` string - class applied to the share button once the count is fetched
* `countSelector` string - selector for the child element that contains the count number
* `newWindow` boolean - determines whether a new window should be opened
* `defaultProviderId` string - if there is no provider plugin the ID will default to this value
* `onShare` function - This callback is dispatched after a share button is clicked on

### Adding a provider

Providers are represented by a JavaScript object, for example:

```javascript
{
  id: 'myprovider',
  fetchCount: function (callback) {
    callback(10000);
  }
}
```

The can be manually loaded with the following:

```javascript
sharebuttons.addProviders([
  {
    id: 'myprovider',
    fetchCount: function (callback) {
      callback(10000);
    }
  }
]);
```
