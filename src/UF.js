import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import EstadosForm from './subcomponents/EstadosForm';
import TableEstados from './subcomponents/TableEstados';
import ValidationErrors from './subcomponents/ValidationErrors';

export default function UF({ufs, setUFs}) {

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
    console.log({[stateVal]:value});
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

  function validateForm() {

    let valid = true;
    const regex = /^[^0-9]*$/;
    const siglas = ufs.map((item) => {return item.sigla});
    const nomes = ufs.map((item) => {return item.nome});

    const NoNameValidation = !uf.ufNome ? 'É necessário informar o NOME do Estado' : '';
    const NoUFValidation = !uf.ufSigla ? 'É necessário informar a SIGLA do Estado' : '';
    const RegexValidation = !regex.test(uf.ufNome) ? 'O NOME do Estado deve conter somente letras' : '';
    const RegexValidationSigla = !regex.test(uf.ufSigla) ? 'A SIGLA deve conter somente letras' : '';
    const ExistantUFValidation = !uf.ufId && siglas.includes(uf.ufSigla) ? 'Sigla já existente' : ''; // somente no Create
    const ExistantNomeValidation = !uf.ufId && nomes.includes(uf.ufNome) ? 'Nome já existente' : ''; // somente no Create

    if(NoNameValidation || NoUFValidation || RegexValidation || RegexValidationSigla || ExistantUFValidation || ExistantNomeValidation) {
      
      setUF(state => {
        const newErrors = [NoNameValidation, NoUFValidation, RegexValidation, RegexValidationSigla, ExistantUFValidation, ExistantNomeValidation];
        return {
          validationErrors: newErrors,
          invalidForm: true
        }
      });
      
      valid = false;
    }

    return valid;

  }

  function submitForm(event){
    event.preventDefault();

    const isValid = validateForm();

    if(!isValid) return false;

    const routeEdit = `http://localhost:3001/ufs/${uf.ufId}`;
    const routePost = 'http://localhost:3001/ufs';
    const method = uf.ufId ? 'PUT' : 'POST';
    const route = uf.ufId ? routeEdit : routePost
    const body = {
      nome: uf.ufNome,
      sigla: uf.ufSigla
    }

    if(!uf.ufId){
      const id = ufs.map(function(uf){ return uf.id });
      body.id = Math.max(...id) + 1 + ""  ;
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
      let ufsCopy = [];
      if(!uf.ufId) {
        ufsCopy = [
          ...ufs,
          data
        ]
      } else {
        ufsCopy = ufs.map((uf) => {
          if(uf.id === data.id) {
            uf.nome = data.nome;
            uf.sigla = data.sigla;
          }
          return uf;
        });
      }
      setUFs(ufsCopy);
      this.ClearFields();
    })
    .catch((error) => {
      console.log(error);
    });

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
        nome={uf.ufNome}
        sigla={uf.ufSigla}
        handleInputChange={handleInputChange}
        submitForm={submitForm}
        ClearFields={ClearFields}
      />
      <p>&nbsp;</p>
      <TableEstados 
        ufs={ufs}
        setUFs={setUFs}
        editUF={editUF}
        deleteUF={deleteUF}
      />
    </div>
  );
}
