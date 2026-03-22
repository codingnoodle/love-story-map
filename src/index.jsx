import React from 'react';
import { createRoot } from 'react-dom/client';
import WandCanvas from './WandCanvas';

const rootElement = document.getElementById('wand-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<WandCanvas />);
}
