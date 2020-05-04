import React from 'react';

function MunicipiosForm(props){
  return (
    <form action="" className="pure-form pure-form-stacked" onSubmit={props.submitForm}>
      <label htmlFor="stacked-nome">Nome</label>
      <input type="text" name="nome" value={props.nome} onChange={props.handleInputChange} onBlur={props.handleBlur} />
      <label htmlFor="stacked-sigla">UF</label>
      <select id="stacked-state" name="uf" onChange={props.handleInputChange} onBlur={props.handleBlur}>
        <option value=""></option>
        {
          props.ufs.map((item, index) => (
            <option key={index} selected={item.id === props.ufId} value={item.id}>{item.sigla}</option>
          ))
        }
      </select>
      <button type="submit" className="pure-button pure-button-primary">Salvar</button>&nbsp;&nbsp;
      <button type="button" onClick={props.ClearFields} className="pure-button">Cancelar</button>
    </form>
  )
}

export default MunicipiosForm;