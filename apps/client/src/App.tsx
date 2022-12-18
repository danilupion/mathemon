import { Route, Routes } from 'react-router-dom';

import './App.css';
import Home from './components/home';
import Layout from './layouts/Layout';
import { Operator } from './models/ArithmeticOperation';
import MultiplicationTable from './pages/multiplicationTable';
import MultiplicationTables from './pages/multiplicationTables';
import Pokedex from './pages/pokedex';
import Quiz from './pages/quiz';

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
