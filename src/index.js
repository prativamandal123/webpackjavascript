import sidebarItems from './sidebar-config.json';
import './style.css';

const sidebar = document.createElement('div');
sidebar.className = 'sidebar';

sidebarItems.forEach(item => {
  const el = document.createElement('div');
  el.className = 'sidebar-item';
  el.innerHTML = `${item.icon} ${item.label}`;
  el.dataset.type = item.type;
  sidebar.appendChild(el);
});

document.body.appendChild(sidebar);
