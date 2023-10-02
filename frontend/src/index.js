import React from 'react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import UserTable from './components/UserTable';

function App() {
  return (
    <UserTable/>
  )
}

render(<App />, document.getElementById('root'));