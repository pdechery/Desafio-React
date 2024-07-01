import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { useContext } from 'react';

import EstadosForm from './subcomponents/EstadosForm';
import TableEstados from './subcomponents/TableEstados';
import ValidationErrors from './subcomponents/ValidationErrors';

export default function UF({setUFs}) {

   const [uf, setUF] = useState({
      ufId: '',
      ufNome: '',
      ufSigla: ''
    })

  function handleInputChange(event){
    const target = event.target;
    let [value,name] = [target.value, target.name];
    let stateVal = (name === 'nome') ? 'ufNome' : 'ufSigla';
    if(name === 'sigla') {
      value = value.toUpperCase();
    }
    setUF({
      ...uf,
      [stateVal]:value
    })
  }

  function ClearFields() {
    setUF({
      ufId: '',
      ufNome: '',
      ufSigla: '',
    })
  }

  function editUF(uf){
    const {id,nome,sigla} = uf;
    setUF({
      ufId: id,
      ufNome: nome,
      ufSigla: sigla,
      validationErrors: [],
      invalidForm: false
    })
  }

  function deleteUF(id){
    fetch(`http://localhost:3001/ufs/${id}`,{
      method:'DELETE'
    })
    .then(res => {
      if(!res.ok){
        throw new Error("Houve um problema com a requisição, tente novamente");
      }
      return res.json();
    })
    .then(data => {
      const ufsCopy = ufs.filter((uf) => {
        return uf.id !== data.id;
      });
      setUFs(ufsCopy);
      ClearFields();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="pure-u-1-2">
      {uf.invalidForm && <ValidationErrors errors={uf.validationErrors} />}
      <h2>Estados</h2>
      <EstadosForm 
        uf={uf}
        handleInputChange={handleInputChange}
        ClearFields={ClearFields}
        setUFs={setUFs}
      />
      <p>&nbsp;</p>
      <TableEstados 
        editUF={editUF}
        deleteUF={deleteUF}
      />
    </div>
  );
}
