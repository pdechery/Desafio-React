import React from 'react'
import { useContext } from 'react';

import { UfContext } from '../context/AppContext';


export default function TableEstados({ editUF, deleteUF}){

  const ufs = useContext(UfContext);

  return (
    <table className="pure-table pure-table-bordered">
        <thead>
            <tr>
                <th>Nome</th>
                <th>Sigla</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        {
          ufs.length > 0 ? (
            ufs.map((item, index) => (
              <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.sigla}</td>
                  <td><i className="far fa-edit" onClick={() => editUF(item) }></i></td>
                  <td><i className="fas fa-trash" onClick={() => deleteUF(item.id) }></i></td>
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