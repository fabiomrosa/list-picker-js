# ListPicker.js

A JavaScript plugin that creates lists in which you can pick and switch items between them and return your picks

## Usage

1. Include plugin's code:

```html
<link rel="stylesheet" href="path/list-picker.min.css">
<script src="path/list-picker.min.js"></script>
```

2. Include plugin's code:

```html
<div id="some-id" class="list-picker">
  <ul class="list-picker-list is-options-list"></ul>
  <!-- Copy and paste the line below for more lists -->
  <ul class="list-picker-list is-picks-list"></ul>
</div>
```

3. Call the plugin:

```js
var listPickerInstance = new ListPicker('#some-id', {
  propertyName: "value"
});
```

Settings
-------------------------

| Property | Description                            | Type    | Default |
|:---------|:--------------------------------------:|:-------:|:-------:|
| drag     | Define if items are draggable          | boolean | false   |
| fixed    | Define if items top position are fixed | boolean | false   |
| gap      | Space between items                    | number  | 0       |
| list     | List of values                         | array   | null    |
| order    | Define if items are reorderable        | boolean | false   |

Callbacks
-------------------------

| Property | Description                               |
|:---------|:-----------------------------------------:|
| template | Return a custom template inside list item |

## Methods

### Return picks

```js
listPickerInstance.getPicks();
```

## Folder Structure

```
list-picker/
├── demo/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
├── dist/
│   ├── list-picker.js      <-- Will always be the latest stable version
│   ├── list-picker.min.js  <-- Latest minified stable version
│   ├── list-picker.css     <-- Will always be the latest stable version
│   └── list-picker.min.css <-- Latest minified stable version
├── LICENSE
└── README.md
```

## Team

ListPicker.js was made with love by these guys.

[![Fábio Moraes Rosa](https://avatars3.githubusercontent.com/u/5050941?v=4&s=70)]() | [![Rogério Banquieri](https://avatars1.githubusercontent.com/u/4391611?v=4&s=70)](http://banquieri.com)

## License

[MIT License](https://github.com/fabiomrosa/list-picker-js/blob/master/LICENSE) © Fábio Moraes Rosa