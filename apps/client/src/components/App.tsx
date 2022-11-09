import { Route, Routes } from 'react-router-dom';

import { Operator } from '../models/ArithmeticOperation';

import './App.css';
import Home from './home';
import Layout from './layout';
import MultiplicationTable from './multiplicationTable';
import MultiplicationTables from './multiplicationTables';
import Quiz from './quiz';

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
        </Route>
      </Routes>
    </div>
  );
};

export default App;
