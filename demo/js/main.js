var drag = false;
var fixed = false;
var lists = 3;
var order = true;
var picker = null;

var _select = document.querySelector('#select');
var _drag = document.querySelector('#drag');
var _order = document.querySelector('#order');
var _keep = document.querySelector('#keep');
var _loose = document.querySelector('#loose');
var _fixed = document.querySelector('#fixed');
var _remove = document.querySelector('#remove');
var _add = document.querySelector('#add');
var _return = document.querySelector('#return');

_select.addEventListener('click', function(e) {
  if (fixed) return;
  drag = false;
  _select.classList.add('is-selected');
  _drag.classList.remove('is-selected');
  listPicker();
});

_drag.addEventListener('click', function(e) {
  if (fixed) return;
  drag = true;
  _select.classList.remove('is-selected');
  _drag.classList.add('is-selected');
  listPicker();
});

_order.addEventListener('click', function(e) {
  if (fixed) return;
  order = true;
  _order.classList.add('is-selected');
  _keep.classList.remove('is-selected');
  listPicker();
});

_keep.addEventListener('click', function(e) {
  if (fixed) return;
  order = false;
  _order.classList.remove('is-selected');
  _keep.classList.add('is-selected');
  listPicker();
});

_loose.addEventListener('click', function(e) {
  fixed = false;
  _loose.classList.add('is-selected');
  _fixed.classList.remove('is-selected');
  _select.removeAttribute('disabled');
  _drag.removeAttribute('disabled');
  _order.removeAttribute('disabled');
  _keep.removeAttribute('disabled');
  listPicker();
});

_fixed.addEventListener('click', function(e) {
  drag = false;
  fixed = true;
  _select.classList.add('is-selected');
  _drag.classList.remove('is-selected');
  _loose.classList.remove('is-selected');
  _fixed.classList.add('is-selected');
  _select.setAttribute('disabled', 'disabled');
  _drag.setAttribute('disabled', 'disabled');
  _order.setAttribute('disabled', 'disabled');
  _keep.setAttribute('disabled', 'disabled');
  listPicker();
});

_remove.addEventListener('click', function(e) {
  if (lists > 1) lists--;
  listPicker();
});

_add.addEventListener('click', function(e) {
  if (lists < 3) lists++;
  listPicker();
});

_return.addEventListener('click', function(e) {
  var data = document.querySelector('.data');
  var code = data.querySelector('code');
  var picks = picker.getPicks();

  var array = `
    [\n
      ${picks.forEach((pick, i) => `'${i}': ['${pick}']`)}
    \n]
  `;

  data.style.display = 'block';
  code.textContent = array;
});

function listPicker() {
  var boilerplate = `
    <div id="linguagens" class="list-picker">
      <ul class="list-picker-list is-options-list"></ul>
      ${lists.forEach(() => '<ul class="list-picker-list is-picks-list"></ul>')}
    </div>
  `;

  var settings = {
    list: ['TypeScript', 'CSS', 'C#', 'HTML', 'Java', 'JavaScript', 'Python', 'Ruby', 'Swift'],
    gap: 1,
    drag: drag,
    fixed: fixed,
    order: order,
    template: function(index, value) {
      return `
        <div class="card">
          <div class="card-close">
            <span class="card-close-icon card-close-plus">&plus;</span>
            <span class="card-close-icon card-close-times">&times;</span>
          </div>
          <div class="card-content">
            <p class="card-content-text">${value}</p>
          </div>
        </div>
      `;
    }
  }

  document.querySelector('.data').style.display = 'none';
  document.querySelector('#example').innerHTML = boilerplate;

  picker = new ListPicker('#linguagens', settings);
}

listPicker();
