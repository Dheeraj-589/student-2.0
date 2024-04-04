// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';

import StudentForm from './components/student';

const root = document.getElementById('root');

const renderApp = () => {
  createRoot(root).render(<StudentForm />);
};

if (root instanceof HTMLDivElement) {
  renderApp();
} else {
  root.onload = renderApp;
}
