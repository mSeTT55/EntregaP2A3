import React, { useState, useContext } from 'react';
import '../MenuSuperiorMobile.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/Auth/AuthContext';


function DropdownButtonMobile() {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const btnLogout = async () => {
      await auth.sair();
      navigate('/');
    } 

  
    return (
      <div className="dropdown">
        <button onClick={toggleDropdown}>MINHA CONTA</button>
        {isOpen && (
          <div id="dropdown-content2" className="dropdown-content2">
            <NavLink to={"/series"}>Séries</NavLink>
            <NavLink to={"/minhalista"}>Minha Lista</NavLink>
            <NavLink to={"/contato"}>Contato</NavLink>
            <NavLink to={"/perfil"}>Perfil</NavLink>
            <a onClick={btnLogout}>Sair</a>
          </div>
        )}
      </div>
    );
}

export default DropdownButtonMobile;

/*
<div>
  <button onclick="dropdown2()" className="dropbtn2">MINHA CONTA</button>
  <div id="dropdown-content2" className="dropdown-content2">
      <a href="/Séries/index.html">Séries</a>
      <a href="/Minha_Lista/index.html">Minha Lista</a>
      <a href="/Contato/index.html">Contato</a>
      <a href="/perfil/index.html">Perfil</a>
      <a href="/Pag_inicial/index.html">Sair</a>
  </div>
</div> 
*/