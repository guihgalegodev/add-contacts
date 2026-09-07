export default class AppPhone {
  constructor(btnAdd, btnMostrar, nome, numero, result) {
    this.btnAdd = document.getElementById(btnAdd);
    this.btnMostrar = document.getElementById(btnMostrar);
    this.nome = document.getElementById(nome);
    this.numero = document.getElementById(numero);
    this.result = document.getElementById(result);
    this.contatosSalvos = [];

    this.events = ["touchstart", "click"];
  }

  cleanInputs() {
    this.nome.value = "";
    this.numero.value = "";
  }

  addContato(e) {
    e.preventDefault();
    const newContato = this.criarContato();
    if (typeof newContato === "string") window.alert(newContato);
    else {
      this.contatosSalvos.push(newContato);
      console.log(`${nome.value} adicionado aos contatos`);
      this.cleanInputs();
    }
  }

  mostrarContatosSalvos(e) {
    e.preventDefault();

    if (this.contatosSalvos.length > 0) {
      const listaAntiga = document.querySelector(".lista-contatos");
      if (listaAntiga) {
        listaAntiga.remove();
      }
      const divMostrarContatos = document.createElement("div");
      divMostrarContatos.classList.add("lista-contatos");

      this.contatosSalvos.forEach((item) => {
        const contatoDiv = document.createElement("div");
        contatoDiv.classList.add("contato");
        contatoDiv.innerHTML = `<p>Nome: ${item.nome}</p>
        <p>Numero: ${item.numero}</p>`;
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
