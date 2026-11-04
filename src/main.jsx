import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/scene.css';
import './styles/lamps.css';
import './styles/card.css';
import './styles/wish.css';
import './styles/story.css';
import copy from './lib/copy.js';
import App from './App.jsx';
import { initRow } from './lib/row.js';
import { ELEVATION } from './elevation.js';

document.documentElement.lang = copy.site.lang;
initRow(); // read the share fragment once, before the first render
createRoot(document.getElementById('root')).render(<App />);
if (ELEVATION) import('./elev/index.js').then((m) => m.startElevation()).catch(() => { document.documentElement.setAttribute('data-elev', '0'); });
// first light: the static lit diya (#poster) is only for the moment before React; with elevation off or failed it is removed once the page has mounted
requestAnimationFrame(() => requestAnimationFrame(() => { const p = document.getElementById('poster'); if (p && document.documentElement.getAttribute('data-elev') !== '1') { p.style.opacity = '0'; setTimeout(() => p.remove(), 320); } }));
