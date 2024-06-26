import React, { Component } from 'react';
import { useState } from 'react';
import MunicipiosForm from './subcomponents/MunicipiosForm';
import TabelaMunicipios from './subcomponents/TabelaMunicipios';
import ValidationErrors from './subcomponents/ValidationErrors';

export default function Municipios({ufs, municipios, setMncps}) {
  
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

  function validateForm() {

    let valid = true;
    const regex = /^[^0-9]*$/;
    const nomes = municipios.map((item) => {return item.nome});

    const NoNameValidation = !mncp.mNome ? 'É necessário informar o NOME do Município' : '';
    const NoUFValidation = !mncp.mUfId ? 'É necessário informar a UF do Município' : '';
    const RegexValidation = !regex.test(mncp.mNome) ? 'O NOME do município deve conter somente letras' : '';
    const ExistantNomeValidation = !mncp.mId && nomes.includes(mncp.mNome) ? 'Nome de Município já existente' : ''; // somente no Create

    if(NoNameValidation || NoUFValidation || RegexValidation || ExistantNomeValidation) {
      setMncp(state => {
        const newErrors = [NoNameValidation, NoUFValidation, RegexValidation, ExistantNomeValidation];
        return {
          validationErrors: newErrors,
          invalidForm: true
        }
      });
      valid = false;
    }

    return valid;

  }

  function editMncp(mncp) {
    const {id, nome, ufId} = mncp;
    setMncp({
      mId: id,
      mNome: nome,
      mUfId: ufId
    })
  }

  function submitForm(event) {

    event.preventDefault();

    const isValid = validateForm();

    if(!isValid) return false;
    
    const routeEdit = `http://localhost:3001/municipios/${mncp.mId}`;
    const routePost = 'http://localhost:3001/municipios';
    const method = mncp.mId ? 'PUT' : 'POST';
    const route = mncp.mId ? routeEdit : routePost
    const body = {
      nome: mncp.mNome,
      ufId: mncp.mUfId
    }

    if(!mncp.mId){
      const id = municipios.map(function(mncp){ return mncp.id });
      body.id = Math.max(...id) + 1 + "";
    };
    
    fetch(route, {
      method:method,
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => {
        if(!res.ok){  
          throw new Error("Houve um problema com a requisição, tente novamente");
        }
        return res.json();
    })
    .then(data => {
      let mncpsCopy = [];
      if(!mncp.mId) {
        mncpsCopy = [...municipios, data]
      } else {
        mncpsCopy = municipios.map((mncp) => {
          if(mncp.id === data.id) {
            mncp.nome = data.nome;
            mncp.ufId = data.ufId;
          }
          return mncp;
        });
      }
      setMncps(mncpsCopy);
      ClearFields();
    })
    .catch((error) => {
      console.log(error);
    });
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
      <MunicipiosForm 
        ufs={ufs} 
        nome={mncp.mNome}
        ufId={mncp.mUfId}
        handleInputChange={handleInputChange}
        submitForm={submitForm}
        ClearFields={ClearFields}
      />
      <p>&nbsp;</p>
      <TabelaMunicipios 
        ufs={ufs} 
        setMncps={setMncps}
        municipios={municipios} 
        getUFSigla={getUFSigla} 
        editMncp={editMncp}
        deleteMncp={deleteMncp}
      />
    </div>
  );
}