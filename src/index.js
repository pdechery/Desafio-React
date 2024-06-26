import React from 'react';
import { createRoot } from 'react-dom/client';
import BrasilUFsCrud from './App';
import 'purecss/build/pure.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.css';

const rootNode = document.getElementById('root');
const root = createRoot(rootNode);
root.render(<BrasilUFsCrud />)

