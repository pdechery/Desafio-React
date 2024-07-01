import React from 'react';
import { useContext } from 'react';

import { UfContext, MuContext } from '../context/AppContext';

export default function TabelaMunicipios({ getUFSigla, editMncp, deleteMncp}){

  const municipios = useContext(MuContext);

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
            municipios.length > 0 ? (
              municipios.map((item,index) => (
                <tr key={index}>
                    <td>{item.nome}</td>
                    <td>{getUFSigla(item.ufId)}</td>
                    <td><i className="far fa-edit" onClick={() => editMncp(item) }></i></td>
                    <td><i className="fas fa-trash" onClick={() => deleteMncp(item.id) }></i></td>
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