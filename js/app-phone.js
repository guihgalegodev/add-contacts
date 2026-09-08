export default class AppPhone {
  constructor(btnAdd, btnMostrar, nome, numero, result) {
    this.btnAdd = document.getElementById(btnAdd);
    this.btnMostrar = document.getElementById(btnMostrar);
    this.nome = document.getElementById(nome);
    this.numero = document.getElementById(numero);
    this.result = document.getElementById(result);

    this.events = ["touchstart", "click"];
  }

  cleanInputs() {
    this.nome.value = "";
    this.numero.value = "";
  }

 async addContato(e) {
    e.preventDefault();
    const newContato = this.criarContato();

    if (typeof newContato === "string") {
      window.alert(newContato);
      return;
    }

    try {
    // Envia o objeto novo contato em formato JSON para a API backend
    const response = await fetch("http://localhost:3000/contatos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContato), // Converte o objeto JS para String JSON
    });
    if (response.ok) {
      const contatoSalvo = await response.json();
      console.log(`${contatoSalvo.nome} adicionado aos contatos no backend!`);
      this.cleanInputs();
    } else {
      const erro = await response.json();
      window.alert(`Erro ao salvar contato: ${erro.erro}`);
    }
  } catch (error) {
    console.error("Erro na conexão com a API:", error);
    window.alert("Não foi possível conectar ao servidor backend.");
  }
  }

  async mostrarContatosSalvos(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/contatos");
    
    const contatos = await response.json();
    console.log("Contatos retornados da API:", contatos);

    if (contatos.length > 0) {
      const listaAntiga = document.querySelector(".lista-contatos");
      if (listaAntiga) {
        listaAntiga.remove();
      }
      const divMostrarContatos = document.createElement("div");
      divMostrarContatos.classList.add("lista-contatos");

      contatos.forEach((contato) => {
        const contatoDiv = document.createElement("div");
        contatoDiv.classList.add("contato");
        contatoDiv.innerHTML = `<p>Nome: ${contato.nome}</p>
        <p>Numero: ${contato.numero}</p>`;
        divMostrarContatos.appendChild(contatoDiv);
      });

      this.result.appendChild(divMostrarContatos);
    } else {
      window.alert("Adicione ao menos um contato");
    }
  }

  criarContato() {
    const nome = this.nome.value;
    const numero = this.numero.value;

    if (nome.length >= 3 && numero.length == 11) {
      return {
        nome,
        numero,
      };
    } else {
      return "Preencha os dados corretamente";
    }
  }

  addBtnsEvent() {
    this.events.forEach((event) => {
      this.btnAdd.addEventListener(event, (e) => {
        this.addContato(e);
      });
      this.btnMostrar.addEventListener(event, (e) => {
        this.mostrarContatosSalvos(e);
      });
    });
  }

  init() {
    if (this.nome && this.numero && this.btnAdd) {
      this.addBtnsEvent();
    }
    return this;
  }
}
