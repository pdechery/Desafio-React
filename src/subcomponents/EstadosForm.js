import React from 'react'
import { useContext } from 'react';

import { UfContext } from '../context/AppContext';

export default function EstadosForm({ uf, handleInputChange, ClearFields, setUFs}){

  const ufs = useContext(UfContext);
  
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
      ClearFields();
    })
    .catch((error) => {
      console.log(error);
    });

  }

  return (
    <form action="" className="pure-form pure-form-stacked" onSubmit={submitForm} >
        <label htmlFor="stacked-nome">Nome</label>
        <input type="text" name="nome" value={uf.ufNome} minLength="4" maxLength="20" onChange={handleInputChange} />
        <label htmlFor="stacked-sigla">Sigla</label>
        <input type="text" name="sigla" value={uf.ufSigla} minLength="2" maxLength="2" onChange={handleInputChange} />
        <button type="submit" className="pure-button button-submit">Salvar</button>&nbsp;&nbsp;
        <button type="button" onClick={ClearFields} className="pure-button">Cancelar</button>
    </form>
  )

}