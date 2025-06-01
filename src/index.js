import sidebarItems from './sidebar-config.json';
import './style.css';

const sidebar = document.createElement('div'); //box
sidebar.className = 'sidebar'; //class in css

sidebarItems.forEach(item => {
  const el = document.createElement('div');
  el.className = 'sidebar-item';
  el.innerHTML = `${item.icon} ${item.label}`; // call item
  el.dataset.type = item.type;
  sidebar.appendChild(el);
});

document.body.appendChild(sidebar);
