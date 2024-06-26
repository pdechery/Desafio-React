import React from 'react'

export default function TableEstados(props){
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
          props.ufs.length > 0 ? (
            props.ufs.map((item, index) => (
              <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.sigla}</td>
                  <td><i className="far fa-edit" onClick={() => props.editUF(item) }></i></td>
                  <td><i className="fas fa-trash" onClick={() => props.deleteUF(item.id) }></i></td>
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