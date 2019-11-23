import { KSFView }from './KSFView';
const $ = require('jquery');
const jQuery = require('jquery');
// require('./KSFView.ts');
require('./KSFInfo.ts');
// import {*} from './renderer';
require('./Renderer.ts');


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 
  
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});

import * as Phaser from 'phaser';
// import Phaser = require('phaser'); // works!

import { jQuery } from 'jquery';
