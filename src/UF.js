import React, { Component } from 'react';
import EstadosForm from './subcomponents/EstadosForm';
import TableEstados from './subcomponents/TableEstados';
import ValidationErrors from './subcomponents/ValidationErrors';

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
      ufSigla: sigla,
      validationErrors: [],
      invalidForm: false
    })
  }

  handleInputChange(event){
    const target = event.target;
    let [value,name] = [target.value, target.name];
    let stateVal = (name === 'nome') ? 'ufNome' : 'ufSigla';
    if(name === 'sigla') {
      console.log(value);
      value = value.toUpperCase();
    }
    this.setState({
      [stateVal]: value
    })
  }

  ClearFields = () => {
    this.setState({
      ufId: '',
      ufNome: '',
      ufSigla: '',
    })
  }

  validateForm = () => {

    let valid = true;
    const regex = /^[^0-9]*$/;
    const siglas = this.props.ufs.map((item) => {return item.sigla});

    const NoNameValidation = !this.state.ufNome ? 'É necessário informar o NOME do Estado' : '';
    const NoUFValidation = !this.state.ufSigla ? 'É necessário informar a SIGLA do Estado' : '';
    const RegexValidation = !regex.test(this.state.ufNome) ? 'O NOME do Estado deve conter somente letras' : '';
    const RegexValidationSigla = !regex.test(this.state.ufSigla) ? 'A SIGLA deve conter somente letras' : '';
    const ExistantUFValidation = !this.state.ufId && siglas.includes(this.state.ufSigla) ? 'Sigla já existente' : ''; // somente no Create

    if(NoNameValidation || NoUFValidation || RegexValidation || RegexValidationSigla || ExistantUFValidation) {
      this.setState(state => {
        const newErrors = [NoNameValidation, NoUFValidation, RegexValidation, RegexValidationSigla, ExistantUFValidation];
        return {
          validationErrors: newErrors,
          invalidForm: true
        }
      }, () => console.log(this.state.validationErrors));
      valid = false;
    }

    return valid;

  }

  submitForm(event){
    // update db
    event.preventDefault();

    const isValid = this.validateForm();

    if(!isValid) return false;

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
          throw new Error("Houve um problema com a requisição, tente novamente");
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
      this.ClearFields();
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
        throw new Error("Houve um problema com a requisição, tente novamente");
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
      <div className="pure-u-1-2">
        {this.state.invalidForm && <ValidationErrors errors={this.state.validationErrors} />}
        <h2>Estados</h2>
        <EstadosForm 
          nome={this.state.ufNome}
          sigla={this.state.ufSigla}
          handleInputChange={this.handleInputChange}
          submitForm={this.submitForm}
          ClearFields={this.ClearFields}
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
