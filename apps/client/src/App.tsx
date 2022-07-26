import { Route, Routes } from 'react-router-dom';

import './App.css';
import Layout from './layouts/Layout';
import { Operator } from './models/ArithmeticOperation';
import Home from './pages/Home';
import MultiplicationTable from './pages/MultiplicationTable';
import MultiplicationTables from './pages/MultiplicationTables';
import Pokedex from './pages/Pokedex';
import Quiz from './pages/Quiz';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="addition" element={<Quiz operator={Operator.addition} />} />
          <Route path="subtraction" element={<Quiz operator={Operator.subtraction} />} />
          <Route path="multiplication" element={<Quiz operator={Operator.multiplication} />} />
          <Route path="multiplicationTables" element={<MultiplicationTables />} />
          <Route path="multiplicationTables/:table" element={<MultiplicationTable />} />
          <Route path="pokedex" element={<Pokedex />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
