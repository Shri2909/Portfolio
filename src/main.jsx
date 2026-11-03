import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import copy from './lib/copy.js';
import App from './App.jsx';

document.documentElement.lang = copy.site.lang;
createRoot(document.getElementById('root')).render(<App />);
