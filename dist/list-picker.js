/*
 *  list-picker - v1.0.0
 *  A JavaScript library that creates lists you can pick and switch items between them and return picks
 *
 *  Made by:
 *    • Fábio Moraes Rosa - fabiomrosa@gmail.com
 *    • Rogério Banquieri - rogerio@banquieri.com
 * 
 *  Under MIT License
 *  http://www.opensource.org/licenses/mit-license.php
 * 
 *  Copyright (c) 2017
 */
// the semi-colon before function invocation is a safety net against concatenated
;(function(window, document, undefined) {

  'use strict';

  function ListPicker(id, settings) {
    this._identity = id;
    this._settings = settings;
    this._init();
    this._mount();
  }
  
  ListPicker.prototype.getPicks = function() {
    for (var i = 0; i < this._elements.lists.length; i++) {
      this._controls.lists.list = [];
      for (var j = 0; j < this._elements.lists[i].childNodes.length; j++) {
        this._controls.lists.list.push(this._elements.lists[i].childNodes[j].dataset.optionValue);
      }
      this._controls.picks[i] = this._controls.lists.list;
    }
    return this._controls.picks;
  }

  ListPicker.prototype._init = function() {
    this._controls = {};
    this._controls.item = {};
    this._controls.item.position = {};
    this._controls.items = [];
    this._controls.lists = {};
    this._controls.mouse = {};
    this._controls.mouse.dist = {};
    this._controls.mouse.down = {};
    this._controls.picks = [];
    this._elements = {};
  }

  ListPicker.prototype._mount = function() {
    this._picker();
    this._options();
    this._picks();
  }

  ListPicker.prototype._picker = function() {
    this._elements.picker = document.querySelector(this._identity);
    if (!this._elements.picker) {
      console.error('<ListPicker> Setup Error: Cannot select element from given #ID');
      return;
    } else if (!this._elements.picker.classList.contains('list-picker')) {
      console.error('<ListPicker> Setup Error: No container element with "list-picker" class was found');
      return;
    } else {
      this._elements.lists = this._elements.picker.querySelectorAll('.list-picker-list');
    }
  }

  ListPicker.prototype._options = function() {
    this._elements.options = this._elements.picker.querySelectorAll('.is-options-list');
    if (!(typeof this._settings.list === 'object') || !this._settings.list.length) {
      console.error('<ListPicker> Setup Error: No ARRAY of values was passed in constructor method');
      return;
    } else if (!this._elements.options.length) {
      console.error('<ListPicker> Setup Error: No <ul> element with "is-option-list" class was found to create OPTIONS list');
      return;
    }
    for (var i = 0; i < this._elements.options.length; i++) {
      if (i) {
        if (this._elements.options[i].remove) {
          this._elements.options[i].remove();
        } else {
          this._elements.options[i].parentNode.removeChild(this._elements.options[i]);
        }
      } else {
        this._controls.lists.height = 0;
        this._elements.options[i].innerHTML = '';
        for (var j = 0, index = 0; j < this._settings.list.length; j++) {
          if (!(typeof this._settings.list[j] === 'string') || !this._settings.list[j].length) {
            console.error('<ListPicker> Create Error: Cannot create list item nº' + j + ' because is empty or is not <String> type');
          } else {
            this._elements.item = document.createElement('li');
            this._elements.item.setAttribute('data-option-index', index);
            this._elements.item.setAttribute('data-option-value', this._settings.list[j]);
            this._elements.item.classList.add('list-picker-list-item');
            if (typeof this._settings.template !== 'function') {
              this._elements.item.textContent = ((index + 1) + '. ' + this._settings.list[j]);
            } else {
              this._elements.item.innerHTML = this._settings.template(index, this._settings.list[j]);
            }
            this._elements.options[i].appendChild(this._elements.item);
            if (index) {
              this._controls.lists.height += (this._elements.item.offsetHeight + this._settings.gap);
              this._elements.item.style.top = ((this._controls.items[index-1].top + this._controls.items[index-1].height) + this._settings.gap) + 'px';
              this._elements.item.style.left = '0px';
            } else {
              this._controls.lists.height += this._elements.item.offsetHeight;
              this._elements.item.style.top = '0px';
              this._elements.item.style.left = '0px';
            }
            this._controls.items.push({height: this._elements.item.offsetHeight, top: this._elements.item.offsetTop});
            index++;
          }
        }
        this._elements.options[i].style.height = this._controls.lists.height + 'px';
        if (this._settings.drag) {
          this._elements.options[i].addEventListener('mousedown', this._down.bind(this), false);
          window.addEventListener('mousemove', this._drag.bind(this), false);
          window.addEventListener('mouseup', this._drop.bind(this), false);
        } else {
          this._elements.options[i].addEventListener('click', this._click.bind(this), false);
          this._elements.options[i].addEventListener('mouseenter', this._hover.bind(this), false);
          this._elements.options[i].addEventListener('mouseleave', this._leave.bind(this), false);
        }
      }
    }
  }

  ListPicker.prototype._picks = function() {
    this._elements.picks = this._elements.picker.querySelectorAll('.is-picks-list');
    if (!this._elements.picks.length) {
      console.error('<ListPicker> Setup Error: No <ul> element with "is-picks-list" class was found to create PICKS list');
      return;
    } else {
      for (var i = 0; i < this._elements.picks.length; i++) {
        this._elements.picks[i].innerHTML = '';
        this._elements.picks[i].style.height = this._controls.lists.height + 'px';
        if (this._settings.drag) {
          this._elements.picks[i].addEventListener('mousedown', this._down.bind(this), false);
          window.addEventListener('mousemove', this._drag.bind(this), false);
          window.addEventListener('mouseup', this._drop.bind(this), false);
        } else {
          this._elements.picks[i].addEventListener('click', this._click.bind(this), false);
          this._elements.picks[i].addEventListener('mouseenter', this._hover.bind(this), false);
          this._elements.picks[i].addEventListener('mouseleave', this._leave.bind(this), false);
        }
      }
    }
  }
  
  ListPicker.prototype._click = function(e) {
    this._elements.item = e.target;
    if (!this._elements.item.classList.contains('list-picker-list')) {
      while (!this._elements.item.classList.contains('list-picker-list-item')) {
        this._elements.item = this._elements.item.parentNode;
      }
      if (this._elements.picks.length === 1) {
        if (this._elements.item.parentNode.classList.contains('is-options-list')) {
          this._elements.item.style.top = this._elements.item.offsetTop + 'px';
          this._elements.item.style.left = ((this._elements.item.offsetWidth - this._elements.picks[0].offsetLeft) - this._elements.item.offsetWidth) + 'px';
          this._elements.picks[0].appendChild(this._elements.item);
        } else {
          this._elements.item.style.top = this._elements.item.offsetTop + 'px';
          this._elements.item.style.left = this._elements.picks[0].offsetLeft + 'px';
          this._elements.options[0].appendChild(this._elements.item);
        }
        setTimeout(this._reset.bind(this), 1);
      } else {
        if (!this._controls.lists.current) {
          this._controls.lists.current = this._elements.item.parentNode;
        }
        if (this._elements.item.parentNode === this._controls.lists.current) {
          if (!this._elements.item.classList.contains('is-selected')) {
            this._elements.item.style.zIndex = (1 + this._elements.item.dataset.optionIndex);
            this._elements.item.classList.add('is-selected');
          } else {
            this._elements.item.style.zIndex = 0;
            this._elements.item.classList.remove('is-selected');
          }
          this._controls.lists.items = this._controls.lists.current.querySelectorAll('.is-selected');
          if (!this._controls.lists.items.length) {
            this._controls.lists.current = null;
          }
        }
      }
    }
    if (!this._elements.item.classList.contains('list-picker-list')) {
      this._elements.item = this._elements.item.parentNode;
    }
    if (this._elements.item !== this._controls.lists.current) {
      this._controls.lists.target = this._elements.item;
      if (this._controls.lists.current && this._controls.lists.target !== this._controls.lists.current) {
        this._controls.lists.items = this._controls.lists.current.querySelectorAll('.is-selected');
        for (var i = 0; i < this._controls.lists.items.length; i++) {
          this._controls.lists.items[i].style.top = this._controls.lists.items[i].offsetTop + 'px';
          this._controls.lists.items[i].style.left = (this._controls.lists.items[i].offsetLeft - (this._controls.lists.target.offsetLeft - this._controls.lists.current.offsetLeft)) + 'px';
          this._controls.lists.items[i].style.zIndex = 0;
          this._controls.lists.items[i].classList.remove('is-selected');
          this._controls.lists.target.classList.remove('is-hover');
          this._controls.lists.target.appendChild(this._controls.lists.items[i]);
        }
        this._controls.lists.current = null;
        setTimeout(this._reset.bind(this), 1);
      }
    }
  }

  ListPicker.prototype._hover = function(e) {
    if (this._controls.lists.current && e.target !== this._controls.lists.current) {
      e.target.classList.add('is-hover');
    }
  }

  ListPicker.prototype._leave = function(e) {
    if (this._controls.lists.current && e.target !== this._controls.lists.current) {
      e.target.classList.remove('is-hover');
    }
  }

  ListPicker.prototype._down = function(e) {
    if (!this._controls.drag) {
      this._elements.item = e.target;
      if (!this._elements.item.classList.contains('list-picker-list')) {
        while (!this._elements.item.classList.contains('list-picker-list-item')) {
          this._elements.item = this._elements.item.parentNode;
        }
        this._controls.drag = true;
        this._controls.item.position.x = parseInt(this._elements.item.style.left);
        this._controls.item.position.y = parseInt(this._elements.item.style.top);
        this._controls.lists.current = this._elements.item.parentNode;
        this._controls.lists.target = null; 
        this._controls.mouse.x = (e.clientX - this._elements.picker.getBoundingClientRect().left);
        this._controls.mouse.y = (e.clientY - this._elements.picker.getBoundingClientRect().top);
        this._controls.mouse.down.x = this._controls.mouse.x;
        this._controls.mouse.down.y = this._controls.mouse.y;
        if (this._controls.mouse.x > (this._controls.lists.current.offsetLeft + (this._controls.lists.current.offsetWidth / 2))) {
          this._elements.item.classList.add('is-dragging', 'by-right');
          this._elements.item.classList.remove('by-left');
        } else {
          this._elements.item.classList.add('is-dragging', 'by-left');
          this._elements.item.classList.remove('by-right');
        }
        this._controls.lists.current.classList.add('is-hover');
      }
    }
  }

  ListPicker.prototype._drag = function(e) {
    if (this._controls.drag) {
      this._controls.mouse.x = (e.clientX - this._elements.picker.getBoundingClientRect().left);
      this._controls.mouse.y = (e.clientY - this._elements.picker.getBoundingClientRect().top);
      this._controls.mouse.dist.x = (this._controls.mouse.x - this._controls.mouse.down.x);
      this._controls.mouse.dist.y = (this._controls.mouse.y - this._controls.mouse.down.y);
      this._elements.item.style.top = (this._controls.item.position.y + this._controls.mouse.dist.y) + 'px';
      this._elements.item.style.left = (this._controls.item.position.x + this._controls.mouse.dist.x) + 'px';
      for (var i = 0; i < this._elements.lists.length; i++) {
        this._controls.lists.x = (this._elements.lists[i].offsetLeft + (this._elements.lists.length - 1));
        if (this._controls.mouse.x >= this._controls.lists.x && this._controls.mouse.x <= (this._controls.lists.x + this._elements.lists[i].offsetWidth)) {
          this._controls.lists.target = this._elements.lists[i];
          this._controls.lists.target.classList.add('is-hover');
        } else {
          this._elements.lists[i].classList.remove('is-hover');
        }
      }
    }
  }

  ListPicker.prototype._drop = function(e) {
    if (this._controls.drag) {
      this._controls.drag = false;
      this._elements.item.classList.remove('is-dragging');
      if (this._controls.lists.target) {
        if (this._controls.lists.target === this._controls.lists.current) {
          this._elements.item.style.top = this._controls.item.position.y + 'px';
          this._elements.item.style.left = this._controls.item.position.x + 'px';
          this._controls.lists.target.classList.remove('is-hover');
        } else {
          this._elements.item.style.top = this._elements.item.offsetTop + 'px';
          this._elements.item.style.left = (this._elements.item.offsetLeft - (this._controls.lists.target.offsetLeft - this._controls.lists.current.offsetLeft)) + 'px';
          this._controls.lists.target.classList.remove('is-hover');
          this._controls.lists.target.appendChild(this._elements.item);
          setTimeout(this._reset.bind(this), 1);
        }
      } else {
        if (this._elements.item.parentNode.classList.contains('is-picks-list')) {
          this._elements.item.style.top = this._elements.item.offsetTop + 'px';
          this._elements.item.style.left = this._controls.lists.current.offsetLeft + 'px';
          this._elements.item.parentNode.classList.remove('is-hover');
          this._elements.options[0].appendChild(this._elements.item);
          setTimeout(this._reset.bind(this), 1);
        } else {
          this._elements.item.parentNode.classList.remove('is-hover');
        }
      }
    }
  }
  
  ListPicker.prototype._reset = function() {
    for (var i = 0; i < this._elements.lists.length; i++) {
      this._controls.item.position.top = 0;
      if (this._settings.fixed) {
        for (var j = 0; j < this._elements.lists[i].childNodes.length; j++) {
          this._elements.lists[i].childNodes[j].style.left = '0px';
        }
      } else if (this._settings.order) {
        for (var j = 0; j < this._settings.list.length; j++) {
          for (var k = 0; k < this._elements.lists[i].childNodes.length; k++) {
            if (j === parseInt(this._elements.lists[i].childNodes[k].dataset.optionIndex)) {
              this._elements.lists[i].childNodes[k].style.top = this._controls.item.position.top + 'px';
              this._elements.lists[i].childNodes[k].style.left = '0px';
              this._controls.item.position.top += (this._elements.lists[i].childNodes[k].offsetHeight + this._settings.gap);
            }
          }
        }
      } else {
        for (var j = 0; j < this._elements.lists[i].childNodes.length; j++) {
          this._elements.lists[i].childNodes[j].style.top = this._controls.item.position.top + 'px';
          this._elements.lists[i].childNodes[j].style.left = '0px';
          this._controls.item.position.top += (this._elements.lists[i].childNodes[j].offsetHeight + this._settings.gap);
        }
      }
    }
  }

  return window['ListPicker'] = ListPicker;

}(window, document));
