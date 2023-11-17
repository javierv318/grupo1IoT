import '../routes/Dashboard.css'
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
} from "reactstrap";

var newData = new Array();
function data() {
  fetch("http://20.42.107.153:3000/parqueadero/laser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    newData=data;
  })
}
data();

var acceso = new Array();
const getAcceso = () => {
  fetch("http://20.42.107.153:3000/parqueadero/camara", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      acceso = data;
    })
    .catch((error) => {
      throw error;
    });
}
getAcceso();
  
  class App extends React.Component {
    state = {
      dataAcceso:acceso,
      acceso:{
        id:"",
        fechahora:"",
        placa:""
      },
      data:newData,
      modalInsertar: false,
      form: {
        id: "",
        led_id: "",
        nivel_luz: "",
        fechahora: "",
      }
    };
    
    actualizar() {
      fetch("http://20.42.107.153:3000/parqueadero/laser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            data: data,
          });
        })
        .catch((error) => {
          throw error;
        });
      fetch("http://20.42.107.153:3000/parqueadero/camara", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            dataAcceso: data,
          });
        })
        .catch((error) => {
          throw error;
        });
    }

    verificar(dato:any) {
      var ulr = "http://20.42.107.153:3000/parqueadero/camara/"+dato.placa;
      fetch(ulr, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((response) => {
          if(response.status == 200){
            var ver = window.alert("Verificado con éxito");
            ver;
          }
          else{
            var ver = window.alert("No se ha podido verificar");
            ver;
          }
        })
        .catch((error) => {
          throw error;
        });
    }
    
    timestamp_to_iso_date(timestamp: any) {

      var date = new Date(0);

      date.setUTCSeconds(timestamp);

      var dayComplete = (date.toISOString())
      dayComplete = dayComplete.substring(0, 19);

      return dayComplete;
    };

    handleChange = (e: { target: { name: any; value: any; }; }) => {
      this.setState({
        form: {
          ...this.state.form,
          [e.target.name]: e.target.value,
        },
      });
    };

    render() {
      
      return (
        <>
          <Container>
            <br />
            <Button color="success" onClick={()=>this.actualizar()}>Actualizar</Button>
            <br />
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Fecha y hora</th>
                  <th>Placa</th>
                  <th>¿Verificado?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.dataAcceso[this.state.dataAcceso.length-1].id}</td>
                  <td>{this.timestamp_to_iso_date(this.state.dataAcceso[this.state.dataAcceso.length-1].fechahora)}</td>
                  <td>{this.state.dataAcceso[this.state.dataAcceso.length-1].placa}</td>
                  <td><Button color="info" onClick={() => {this.verificar(this.state.dataAcceso[this.state.dataAcceso.length-1]);}}>Verificar</Button></td>
                </tr>
              </tbody>
            </Table>
            <br />
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Led ID</th>
                  <th>Nivel de luz</th>
                  <th>Fecha y Hora</th>
                  <th>Bahía</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.reverse().map((dato) => (
                  <tr key={dato.id}>
                    <td>{dato.id}</td>
                    <td>{dato.led_id}</td>
                    <td>{dato.nivel_luz}</td>
                    <td>{this.timestamp_to_iso_date(dato.fechahora)}</td>
                    <td>Modulo no implementado</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </>
      );
    }
  }
  export default App;
  