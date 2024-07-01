import React from 'react';
import { useContext } from 'react';

import { UfContext, MuContext } from '../context/AppContext';

export default function MunicipiosForm({ mncp, handleInputChange, ClearFields, setMncps}){

  const municipios = useContext(MuContext);
  const ufs = useContext(UfContext);

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

  return (
    <form action="" className="pure-form pure-form-stacked" onSubmit={submitForm}>
      <label htmlFor="stacked-nome">Nome</label>
      <input type="text" name="nome" value={mncp.mNome} onChange={handleInputChange} minLength="4" maxLength="30" />
      <label htmlFor="stacked-sigla">UF</label>
      <select id="stacked-state" name="uf" value={mncp.mUfId} onChange={handleInputChange}>
        <option value=""></option>
        {
          ufs.map((uf, index) => (
            <option key={index} value={uf.id}>{uf.sigla}</option>
          ))
        }
      </select>
      <button type="submit" className="pure-button button-submit">Salvar</button>&nbsp;&nbsp;
      <button type="button" onClick={ClearFields} className="pure-button">Cancelar</button>
    </form>
  )
}