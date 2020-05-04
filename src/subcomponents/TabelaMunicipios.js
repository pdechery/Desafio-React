import React from 'react';

function TabelaMunicipios(props){
  return (
    <table className="pure-table pure-table-bordered">
        <thead>
            <tr>
                <th>Nome</th>
                <th>UF</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
          {
            props.municipios.length > 0 ? (
              props.municipios.map((item,index) => (
                <tr key={index}>
                    <td>{item.nome}</td>
                    <td>{props.getUFSigla(item.ufId)}</td>
                    <td><i className="far fa-edit" onClick={() => props.editMncp(item) }></i></td>
                    <td><i className="fas fa-trash" onClick={() => props.deleteMncp(item.id) }></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )
          }
        </tbody>
    </table> 
  )
}

export default TabelaMunicipios;