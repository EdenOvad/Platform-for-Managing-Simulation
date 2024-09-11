import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import FullScreenLoader from './components/FullScreenLoader';
import { useDispatch } from 'react-redux';
import { login } from './redux/action/action';
import ExperimentDetails from './pages/ExperimentDetails';
import { getUserData } from './utils/Utils';
import RequiredUser from './components/RequiredUser';

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("token") !== 'null') {
      // console.log(localStorage.getItem("token"));

      dispatch(login(localStorage.getItem("token")))
    }
  }, []);

  const getHomeRoute = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return <Navigate to="/simulation" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getHomeRoute()} />
          <Route element={<RequiredUser />}>
            <Route path="/simulation" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/experiment/:id" element={<ExperimentDetails />} />
      </Routes>
    </Suspense>
  );
}

export default App;
