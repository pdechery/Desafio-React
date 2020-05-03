import React, { Component } from 'react';
import MunicipiosForm from './subcomponents/MunicipiosForm';
import TabelaMunicipios from './subcomponents/TabelaMunicipios';

class Municipios extends Component {
  constructor(props){
    super(props);
    this.state = {
      mId: "",
      mNome: "",
      mUfId: ""
    }
  }

  getUFSigla = (ufId) => {
    const uf = this.props.ufs.filter((uf) => {
      return uf.id === ufId;
    })
    if(uf.length > 0) {
      return uf[0].sigla;
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    let stateVal = isNaN(target.value) ? 'mNome' : 'mUfId';
    this.setState({
      [stateVal]: target.value
    })
  }

  editMncp = (mncp) => {
    const {id, nome, ufId} = mncp;
    this.setState({
      mId: id,
      mNome: nome,
      mUfId: ufId
    })
  }

  submitForm = (event) => {
    // update db
    event.preventDefault();

    console.log('submitForm');
    console.log(this.state.mId);

    const routeEdit = `http://localhost:3001/municipios/${this.state.mId}`;
    const routePost = 'http://localhost:3001/municipios';
    const method = this.state.mId ? 'PUT' : 'POST';
    const route = this.state.mId ? routeEdit : routePost
    const body = {
      nome: this.state.mNome,
      ufId: +this.state.mUfId
    }

    if(!this.state.mId){
      const id = this.props.municipios.map(function(mncp){ return mncp.id });
      body.id = Math.max(...id) + 1;
    };

    console.log('body');
    console.log(body);
    
    fetch(route, {
      method:method,
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => {
        if(!res.ok){
          throw {
            'statusCode': 401,
            'message': "Falta o sagu"
          };
        }
        return res.json();
    })
    .then(data => {
      let mncpsCopy = [];
      if(!this.state.mId) {
        mncpsCopy = [
          ...this.props.municipios,
          data
        ]
      } else {
        mncpsCopy = this.props.municipios.map((mncp) => {
          if(mncp.id === data.id) {
            mncp.nome = data.nome;
            mncp.ufId = data.ufId;
          }
          return mncp;
        });
      }
      console.log('mncpsCopy');
      console.log(mncpsCopy);
      this.props.setMncps(mncpsCopy);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  deleteMncp = (mId) => {
    fetch(`http://localhost:3001/municipios/${mId}`,{
      method:'DELETE'
    })
    .then(res => {
      if(!res.ok){
        throw {
          'statusCode': 401,
          'message': "Falta o xinxim"
        };
      }
      return res.json();
    })
    .then(data => {
      const mncpsCopy = this.props.municipios.filter((mncp) => {
        return mncp.id !== mId;
      });
      this.props.setMncps(mncpsCopy);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render(){
    return (
      <div className="pure-u-2-5">
        <h2>Municípios</h2>
        <MunicipiosForm 
          ufs={this.props.ufs} 
          nome={this.state.mNome} 
          ufId={this.state.mUfId}
          handleInputChange={this.handleInputChange}
          submitForm={this.submitForm}
        />
        <p>&nbsp;</p>
        <TabelaMunicipios 
          ufs={this.props.ufs} 
          setMncps={this.props.setMncps}
          municipios={this.props.municipios} 
          getUFSigla={this.getUFSigla} 
          editMncp={this.editMncp}
          deleteMncp={this.deleteMncp}
        />
      </div>
    );
  }
}

export default Municipios;