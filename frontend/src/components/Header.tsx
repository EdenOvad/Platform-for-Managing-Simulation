/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import userImg from '../assets/images/user.png';
import { getToken } from '../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/action';
import { RootState } from '../redux/store';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const accessToken = getToken();
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const currentRoute = location.pathname;
  const user_info = useSelector((user: RootState) => user.user_name)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/")
    }
  })

  const onLogoutHandler = () => {
    dispatch(logout())
    navigate("/")
  };

  return (
    <header>
      <div className="container">
        <Navbar expand="md">
          <NavbarBrand
            href={
              accessToken ? '/' : '/'
            }>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} className="ms-auto" />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ms-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <img src={userImg} height={50} alt="user" className="user-img" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem onClick={onLogoutHandler}>Log out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;
