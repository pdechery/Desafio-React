import React, { Component } from 'react';
import MunicipiosForm from './subcomponents/MunicipiosForm';
import TabelaMunicipios from './subcomponents/TabelaMunicipios';
import ValidationErrors from './subcomponents/ValidationErrors';

class Municipios extends Component {
  constructor(props){
    super(props);
    this.state = {
      mId: "",
      mNome: "",
      mUfId: "",
      validationErrors: [],
      invalidForm: false
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
    let {name, value} = event.target;
    let stateVal = name === 'nome' ? 'mNome' : 'mUfId';
    
    this.setState({
      [stateVal]: value
    });
  }

  ClearFields = () => {
    this.setState({
      mId: '',
      mNome: '',
      mUfId: '',
    })
  }

  validateForm = () => {

    let valid = true;
    const regex = /^[^0-9]*$/;

    const NoNameValidation = !this.state.mNome ? 'É necessário informar o nome do Município' : '';
    const NoUFValidation = !this.state.mUfId ? 'É necessário informar a sigla do Município' : '';
    const RegexValidation = !regex.test(this.state.mNome) ? 'O nome do município deve conter somente letras' : '';

    if(NoNameValidation || NoUFValidation || RegexValidation) {
      this.setState(state => {
        const newErrors = [NoNameValidation, NoUFValidation, RegexValidation];
        return {
          validationErrors: newErrors,
          invalidForm: true
        }
      }, () => console.log(this.state.validationErrors));
      valid = false;
    }

    return valid;

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

    event.preventDefault();

    const isValid = this.validateForm();

    if(!isValid) return false;
    
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
    
    fetch(route, {
      method:method,
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => {
        if(!res.ok){
          throw new Error('Houve um problema com a requisição. Tente novamente.');
        }
        return res.json();
    })
    .then(data => {
      let mncpsCopy = [];
      if(!this.state.mId) {
        mncpsCopy = [...this.props.municipios, data]
      } else {
        mncpsCopy = this.props.municipios.map((mncp) => {
          if(mncp.id === data.id) {
            mncp.nome = data.nome;
            mncp.ufId = data.ufId;
          }
          return mncp;
        });
      }
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
        throw new Error('Houve um problema com a requisição. Tente novamente.');
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
        {this.state.invalidForm && <ValidationErrors errors={this.state.validationErrors} />}
        <h2>Municípios</h2>
        <MunicipiosForm 
          ufs={this.props.ufs} 
          nome={this.state.mNome} 
          ufId={this.state.mUfId}
          handleInputChange={this.handleInputChange}
          handleBlur={this.handleBlur}
          submitForm={this.submitForm}
          ClearFields={this.ClearFields}
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