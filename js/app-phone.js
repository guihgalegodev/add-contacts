export default class AppPhone {
  constructor(btnAdd, btnMostrar, nome, numero, result) {
    this.btnAdd = document.getElementById(btnAdd);
    this.btnMostrar = document.getElementById(btnMostrar);
    this.nome = document.getElementById(nome);
    this.numero = document.getElementById(numero);
    this.result = document.getElementById(result);

    this.events = ["touchstart", "click"];

    this.url = "https://api-contatos-29hi.onrender.com/contatos";
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
      const response = await fetch(this.url, {
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

    const response = await fetch(this.url);

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
        this.contatoDiv = document.createElement("div");
        this.contatoDiv.classList.add("contato");
        this.contatoDiv.innerHTML = `<div class="dados-contato"><p class="nome">Nome: ${contato.nome}</p>
        <p class="numero">Numero: ${contato.numero}</p></div>
        <div class="btns-contato">
        <button class="btn-editar"><img src="./assets/edit-icon.svg"></button>
        <button class="btn-deletar"><img src="./assets/delete.svg"></button>
        </div>`;
        divMostrarContatos.appendChild(this.contatoDiv);
        const btns = this.contatoDiv.querySelectorAll(".btns-contato button");
        btns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            // e.preventDefault();
            const btnTarget = e.currentTarget;
            const targetContato =
              e.currentTarget.parentElement.previousElementSibling;
            const contNome = targetContato
              .querySelector(".nome")
              .innerText.replace("Nome: ", "");
            const contNumero = targetContato
              .querySelector(".numero")
              .innerText.replace("Numero: ", "");
            if (
              contNome === contato.nome &&
              contNumero === contato.numero &&
              btnTarget.className === "btn-deletar"
            ) {
              this.deletarContato(contato.id, targetContato.parentElement);
            } else if (
              contNome === contato.nome &&
              btnTarget.className === "btn-editar"
            ) {
              const divEdit = document.createElement("div");
              divEdit.classList.add("div-edit");
              const frmEdit = document.createElement("form");
              frmEdit.classList.add("frm-edit");
              frmEdit.innerHTML = `<input type="text" id="nomeAlt" maxlength="50">
              <input type="text" id="numeroAlt" maxlength="11"> 
              <button> Finalizar </button>`;
              const bntEdit = frmEdit.querySelector("button");
              const novoNome = frmEdit.querySelector("#nomeAlt");
              const novoNumero = frmEdit.querySelector("#numeroAlt");
              novoNome.value = contato.nome;
              novoNumero.value = contato.numero;

              divEdit.appendChild(frmEdit);
              document.body.appendChild(divEdit);

              bntEdit.addEventListener("click", (e) => {
                e.preventDefault();
                contato.nome = novoNome.value;
                contato.numero = novoNumero.value;
                const checkNewString = this.vericarString(novoNumero.value);
                if (checkNewString) {
                  window.alert("No campo Numero digite apenas numeros");
                  return;
                }
                this.editarContato(contato.id, contato);
                divEdit.remove();
                this.atualizarNoFront(
                  targetContato,
                  novoNome.value,
                  novoNumero.value,
                );
              });
              // this.result.insertAdjacentElement("afterend", frmEdit);
            }
          });
        });
      });

      this.result.appendChild(divMostrarContatos);

      return this.contatoDiv;
    } else {
      window.alert("Adicione ao menos um contato");
    }
  }

  vericarString(numero) {
    const arrayNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < numero.length; i++) {
      if (!arrayNumbers.includes(numero[i])) {
        return true;
      }
    }
  }

  atualizarNoFront(contato, novoNome, novoNumero) {
    const name = contato.querySelector(".nome");
    const numero = contato.querySelector(".numero");
    name.innerText = `Nome: ${novoNome}`;
    numero.innerText = `Numero: ${novoNumero}`;
  }

  async editarContato(id, contatoEditado) {
    console.log(id, contatoEditado);
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contatoEditado),
      });

      // Só remove da tela se a API do Render confirmar o sucesso (status 200-299)
      if (response.ok) {
        console.log(`Contato ${id} editado com sucesso.`);
      } else {
        console.error(
          "O servidor retornou um erro ao tentar editar:",
          response.statusText,
        );
        alert("Não foi possível editar o contato no servidor.");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert("Erro de rede. Verifique sua conexão ou se a API está ativa.");
    }
  }

  async deletarContato(id, element) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Só remove da tela se a API do Render confirmar o sucesso (status 200-299)
      if (response.ok) {
        element.remove();
        console.log(`Contato ${id} deletado com sucesso.`);
      } else {
        console.error(
          "O servidor retornou um erro ao tentar deletar:",
          response.statusText,
        );
        alert("Não foi possível deletar o contato no servidor.");
      }
    } catch (error) {
      // Captura erros de rede ou se o Render estiver fora do ar
      console.error("Erro ao conectar com a API:", error);
      alert("Erro de rede. Verifique sua conexão ou se a API está ativa.");
    }
  }

  criarContato() {
    const nome = this.nome.value;
    const numero = this.numero.value;
    const checkString = this.vericarString(numero);
    if (checkString) {
      window.alert("No campo Número: digite apenas numeros");
      return;
    }

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
