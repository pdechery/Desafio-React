import React, { Component } from 'react';
import UF from './UF';
import Municipios from './Municipios';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      ufs: [
        {
          id: '',
          nome:'',
          sigla:''
        }
      ],
      municipios: [
        {
          id: '',
          nome:'',
          ufId:''
        }
      ]
    }
    this.setUFs = this.setUFs.bind(this);
    this.setMunicipios = this.setMunicipios.bind(this);
  }

  setMunicipios(newMncps){
    this.setState({
      municipios: newMncps
    })
  }

  setUFs(newUFs){
    this.setState({
      ufs: newUFs
    })
  }

  componentDidMount(){
    // pegar estados
    fetch('http://localhost:3001/ufs')
    .then(res => {
      if(!res.ok) {
          throw {
            'statusCode': 401,
            'message': "Falta o xuxu"
          };
      }
      return res.json();
    })
    .then(data => {
      this.setState({
        ufs: data
      });
      // pegar municípios
      return fetch('http://localhost:3001/municipios').then(res => {
        if(!res.ok) {
            throw {
              'statusCode': 401,
              'message': "Falta o tomate"
            };
        }
        return res.json();
      }).then(data => {
        this.setState({
          municipios: data
        });
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }

  render(){
    return (
      <div className="pure-u-1">
        <h1>Estados e Municípios do Brasil</h1>    
        <UF ufs={this.state.ufs} setUFs={this.setUFs} /> 
        <Municipios ufs={this.state.ufs} municipios={this.state.municipios} setMncps={this.setMunicipios} />
      </div>
    );
  }
}

export default App;
