import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import logo from '../assets/logo-no-background.png';

import "../Navbar.css";

function Navbar123() {
  return (
    <Navbar expand="lg" className="bg-dark navbar-dark nav-main">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/home">
          <img
            src={logo}
            height="50"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto custom-nav">
            <Nav.Link as={NavLink} to="/home">DOMOV</Nav.Link>
            <Nav.Link as={NavLink} to="/map">ZEMLJEVID</Nav.Link>
            <Nav.Link as={NavLink} to="/podrobnosti/SLOVENIJA">PODROBNOSTI</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar123;