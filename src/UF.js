import React, { Component } from 'react';
import EstadosForm from './subcomponents/EstadosForm';
import TableEstados from './subcomponents/TableEstados';

class UF extends Component {

  constructor(props){
    super(props);
    this.state = {
      ufId: '',
      ufNome: '',
      ufSigla: ''
    }
    this.editUF = this.editUF.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.deleteUF = this.deleteUF.bind(this);
  }

  editUF(uf){
    const {id,nome,sigla} = uf;
    this.setState({
      ufId: id,
      ufNome: nome,
      ufSigla: sigla
    })
  }

  handleInputChange(event){
    const target = event.target;
    const [value,name] = [target.value, target.name];
    let stateVal = (name === 'nome') ? 'ufNome' : 'ufSigla';
    this.setState({
      [stateVal]: value
    })
  }

  submitForm(event){
    // update db
    event.preventDefault();

    const routeEdit = `http://localhost:3001/ufs/${this.state.ufId}`;
    const routePost = 'http://localhost:3001/ufs';
    const method = this.state.ufId ? 'PUT' : 'POST';
    const route = this.state.ufId ? routeEdit : routePost
    const body = {
      nome: this.state.ufNome,
      sigla: this.state.ufSigla
    }

    if(!this.state.ufId){
      const id = this.props.ufs.map(function(uf){ return uf.id });
      body.id = Math.max(...id) + 1;
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
          throw {
            'statusCode': 401,
            'message': "Falta o sagu"
          };
        }
        return res.json();
    })
    .then(data => {
      let ufsCopy = [];
      if(!this.state.ufId) {
        ufsCopy = [
          ...this.props.ufs,
          data
        ]
      } else {
        ufsCopy = this.props.ufs.map((uf) => {
          if(uf.id === data.id) {
            uf.nome = data.nome;
            uf.sigla = data.sigla;
          }
          return uf;
        });
      }
      this.props.setUFs(ufsCopy);
    })
    .catch((error) => {
      console.log(error);
    });

  }

  deleteUF(ufId){
    fetch(`http://localhost:3001/ufs/${ufId}`,{
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
      const ufsCopy = this.props.ufs.filter((uf) => {
        return uf.id !== ufId;
      });
      this.props.setUFs(ufsCopy);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render(){
    return (
      <div className="pure-u-2-5">
        <h2>Estados</h2>
        <EstadosForm 
          nome={this.state.ufNome}
          sigla={this.state.ufSigla}
          handleInputChange={this.handleInputChange}
          submitForm={this.submitForm}
        />
        <p>&nbsp;</p>
        <TableEstados 
          ufs={this.props.ufs}
          setUFs={this.props.setUFs}
          editUF={this.editUF}
          deleteUF={this.deleteUF}
        />
      </div>
    );
  }
}

export default UF;
