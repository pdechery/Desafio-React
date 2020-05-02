import React, { Component } from 'react';

function TableEstados(props){
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
                  <td><i className="far fa-edit" onClick={() => props.editUF(item.id) }></i></td>
                  <td><i className="fas fa-trash"onClick={() => props.deleteUF(item.id) }></i></td>
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

function EstadosForm(props){
  return (
    <form action="" className="pure-form pure-form-stacked" onSubmit={props.submitForm} >
        <label htmlFor="stacked-nome">Nome</label>
        <input type="text" name="nome" value={props.nome} onChange={props.handleInputChange} />
        <label htmlFor="stacked-sigla">Sigla</label>
        <input type="text" name="sigla" value={props.sigla} onChange={props.handleInputChange} />
        <button type="submit" className="pure-button pure-button-primary">Salvar</button>
    </form>
  )
}

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
      ],
      ufId: '',
      ufNome: '',
      ufSigla: ''
    }
    this.editUF = this.editUF.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.deleteUF = this.deleteUF.bind(this);
  }

  editUF(ufId){
    const uf = this.state.ufs.filter((item, index)=> {
      return item.id === ufId;
    });
    this.setState({
      ufId: uf[0].id,
      ufNome: uf[0].nome,
      ufSigla: uf[0].sigla
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
    const id = this.state.ufs.map(function(uf){ return uf.id });
    if(!this.state.ufId){
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
          ...this.state.ufs,
          data
        ]
      } else {
        ufsCopy = this.state.ufs.map((uf) => {
          if(uf.id === data.id) {
            uf.nome = data.nome;
            uf.sigla = data.sigla;
          }
          return uf;
        });
      }
      this.setState({
        ufs: ufsCopy
      })
    })
    .catch((error) => {
      console.log(error);
    });

  }

  deleteUF(ufId){
    console.log(ufId);
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
      const ufsCopy = this.state.ufs.filter((uf) => {
        return uf.id !== ufId;
      });
      this.setState({
        ufs: ufsCopy
      })
    })
    .catch((error) => {
      console.log(error);
    });
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
    const editId = this.state.ufId;
    return (
      <span>
        <h2>Estados</h2>
        <EstadosForm 
          nome={this.state.ufNome}
          sigla={this.state.ufSigla}
          handleInputChange={this.handleInputChange}
          submitForm={this.submitForm}
        />
        <p>&nbsp;</p>
        <TableEstados 
          ufs={this.state.ufs} 
          editUF={this.editUF}
          deleteUF={this.deleteUF} 
        />
      </span>
    );
  }
}

export default App;
