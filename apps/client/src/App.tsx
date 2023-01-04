import { Operator } from '@mathemon/common/models/operation';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import NotSignedInGuard from './guards/NotSignedInGuard';
import usePageTracking from './hooks/usePageTracking';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import MultiplicationTable from './pages/MultiplicationTable';
import MultiplicationTables from './pages/MultiplicationTables';
import NotFound from './pages/NotFound';
import Pokedex from './pages/Pokedex';
import Quiz from './pages/Quiz';
import SignIn from './pages/SignIn';

const App = () => {
  usePageTracking();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="addition" element={<Quiz operator={Operator.addition} />} />
          <Route path="subtraction" element={<Quiz operator={Operator.subtraction} />} />
          <Route path="multiplication" element={<Quiz operator={Operator.multiplication} />} />
          <Route path="division" element={<Quiz operator={Operator.division} />} />
          <Route path="multiplicationTables" element={<MultiplicationTables />} />
          <Route path="multiplicationTables/:table" element={<MultiplicationTable />} />
          <Route path="pokedex" element={<Pokedex />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/signIn" element={<NotSignedInGuard />}>
          <Route path="" element={<SignIn />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
