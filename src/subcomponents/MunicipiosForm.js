import React from 'react';

export default function MunicipiosForm(props){
  return (
    <form action="" className="pure-form pure-form-stacked" onSubmit={props.submitForm}>
      <label htmlFor="stacked-nome">Nome</label>
      <input type="text" name="nome" value={props.nome} onChange={props.handleInputChange} minLength="4" maxLength="30" />
      <label htmlFor="stacked-sigla">UF</label>
      <select id="stacked-state" name="uf" value={props.ufId} onChange={props.handleInputChange}>
        <option value=""></option>
        {
          props.ufs.map((uf, index) => (
            <option key={index} value={uf.id}>{uf.sigla}</option>
          ))
        }
      </select>
      <button type="submit" className="pure-button button-submit">Salvar</button>&nbsp;&nbsp;
      <button type="button" onClick={props.ClearFields} className="pure-button">Cancelar</button>
    </form>
  )
}