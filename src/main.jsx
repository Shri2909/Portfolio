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

document.documentElement.lang = copy.site.lang;
initRow(); // read the share fragment once, before the first render
createRoot(document.getElementById('root')).render(<App />);
