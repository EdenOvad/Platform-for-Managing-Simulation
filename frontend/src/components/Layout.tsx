import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useEffect } from 'react';
import { login } from '../redux/action/action';
import { useDispatch } from 'react-redux';

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== 'null') {
      dispatch(login(token));
    }
  }, [dispatch]); // Add dependency array to avoid potential issues

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
