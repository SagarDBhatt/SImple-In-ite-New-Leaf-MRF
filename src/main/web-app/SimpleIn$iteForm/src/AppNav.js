import React, { Component } from 'react';
import {Nav,Navbar,NavItem,NavbarBrand,NavLink} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'

class AppNav extends Component {
    state = {  }
    render() { 
        return (
            <div>
              <Navbar color="light" Green expand="md">
                <NavbarBrand href="/"><h4>Simple In$ite</h4></NavbarBrand>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink tag={Link} to="/index" className="inactive" 
                         activeClassName="active">Home</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/incomingMaterial" className="inactive" 
                         activeClassName="active">Inbound Material</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/Production" className="inactive" 
                         activeClassName="active">Processed Material</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/soldMaterial" className="inactive" 
                         activeClassName="active">Shipped Material</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/trashOut" className="inactive" 
                         activeClassName="active">Trash out</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/machinehours" className="inactive" 
                         activeClassName="active">Machine hours</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/employeeTimesheet" className="inactive" 
                         activeClassName="active">Employee Timesheet</NavLink>
                    </NavItem>
                    {/* <NavItem>
                      <NavLink tag={Link} to='/login' className='inactive'
                        activeClassName='active'>Login</NavLink>
                    </NavItem> */}
                    {/* <NavItem>
                      <NavLink tag={Link} to='/profile' className='inactive'
                        activeClassName='active'>profile</NavLink>
                    </NavItem> */}
                  </Nav>
              </Navbar>
            </div>
          );
    }
}
 
export default AppNav;