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
  fetch("http://localhost:3000/parqueadero/laser", {
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
  
  class App extends React.Component {
    state = {
      data:newData,
      modalActualizar: false,
      modalInsertar: false,
      form: {
        id: "",
        led_id: "",
        nivel_luz: "",
        fechahora: "",
      },
    };
    
    actualizar() {
      fetch("http://localhost:3000/parqueadero/laser", {
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
    }
    
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
            <br />
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Led ID</th>
                  <th>Nivel de luz</th>
                  <th>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((dato) => (
                  <tr key={dato.id}>
                    <td>{dato.id}</td>
                    <td>{dato.led_id}</td>
                    <td>{dato.nivel_luz}</td>
                    <td>{dato.fechahora}</td>
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
  