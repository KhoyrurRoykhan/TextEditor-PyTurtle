import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaBomb, FaBook, FaBookReader, FaCentercode, FaCode, FaCodeBranch, FaCodepen, FaConnectdevelop, FaFileCode, FaFreeCodeCamp, FaGamepad, FaLaptopCode, FaLeanpub, FaRedRiver, FaScrewdriver, FaTrophy, FaWalking, FaWater } from 'react-icons/fa'; // Import icons
import './assets/navbar.css';

const Navigasibar = () => {

  const [nama, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // refreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const refreshToken = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/token');
  //     const decoded = jwtDecode(response.data.accessToken);
  //     setName(decoded.nama);
  //   } catch (error) {
  //     if (error.response) {
  //       navigate('/login');
  //     }
  //   }
  // };

  return (
    <Navbar className="bg-success fixed-top">
      <Container>
      <Nav.Link style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }} href="/"> <FaCode /> Text Editor Python Turtle</Nav.Link>
        <Navbar.Toggle />
        <Navbar.Collapse id="basic-navbar-nav" style={{ marginLeft: '20px'}}>
          <Nav className="me-auto">
            {/* <Nav.Link style={{color: 'white'}} className='ml-5' href="/belajar/pendahuluan"><FaBookReader /> Belajar Turtle</Nav.Link>
            <Nav.Link style={{color: 'white'}} className='ml-5' href="/challanges"><FaGamepad /> Tantangan</Nav.Link>
            <Nav.Link style={{color: 'white'}} className='ml-5' href="/texteditor"><FaCode /> Text Editor</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end" style={{color: 'white'}}>
          <Navbar.Text style={{color: 'white'}}>
            {/* Signed in as: <a href="#login">{nama}</a> */}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigasibar;