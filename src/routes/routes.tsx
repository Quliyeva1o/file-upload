import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/index';
import Home from '../pages/home';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
    </Route>
  </Routes>
);

export default AppRoutes;
