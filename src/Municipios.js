import React, { Component } from 'react';
import { useState } from 'react';
import { useContext } from 'react';

import { MuContext, UfContext } from './context/AppContext';

import MunicipiosForm from './subcomponents/MunicipiosForm';
import TabelaMunicipios from './subcomponents/TabelaMunicipios';
import ValidationErrors from './subcomponents/ValidationErrors';

export default function Municipios({municipios, setMncps}) {

  const ufs = useContext(UfContext);

  const [mncp, setMncp] = useState({
      mId: "",
      mNome: "",
      mUfId: "",
      validationErrors: [],
      invalidForm: false
    });

  function getUFSigla(ufId) {
    const uf = ufs.filter((uf) => {
      return uf.id === ufId;
    })
    if(uf.length > 0) {
      return uf[0].sigla;
    }
  }

  function handleInputChange(event) {
    let {name, value} = event.target;
    let stateVal = name === 'nome' ? 'mNome' : 'mUfId';
    setMncp({
      ...mncp,
      [stateVal]: value
    });
  }

  function ClearFields() {
    setMncp({
      mId: '',
      mNome: '',
      mUfId: '',
    })
  }

  function editMncp(mncp) {
    const {id, nome, ufId} = mncp;
    setMncp({
      mId: id,
      mNome: nome,
      mUfId: ufId
    })
  }

  function deleteMncp(mId) {
    fetch(`http://localhost:3001/municipios/${mId}`,{
      method:'DELETE'
    })
    .then(res => {
      if(!res.ok){
        throw new Error('Houve um problema com a requisição. Tente novamente.');
      }
      return res.json();
    })
    .then(data => {
      const mncpsCopy = municipios.filter((mncp) => {
        return mncp.id !== mId;
      });
      setMncps(mncpsCopy);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="pure-u-1-2">
      
      {mncp.invalidForm && <ValidationErrors errors={mncp.validationErrors} />}
      
      <h2>Municípios</h2>
      
      <MuContext.Provider value={municipios}>
        
        <MunicipiosForm 
          mncp={mncp}
          handleInputChange={handleInputChange}
          ClearFields={ClearFields}
          setMncps={setMncps}
        />
        
        <p>&nbsp;</p>
        
        <TabelaMunicipios 
          getUFSigla={getUFSigla} 
          editMncp={editMncp}
          deleteMncp={deleteMncp}
        />

      </MuContext.Provider>

    </div>
  );
}