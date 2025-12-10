const CHAVE = "meu_controle_financas";

// inicial
let dados = {
    salario: 0,
    despesas: []
};

// --- PEGANDO OS ELEMENTOS DA TELA ---
const inpSalario = document.getElementById("salario");
const textoSalario = document.getElementById("mostrarSalario");

const totalDespesas = document.getElementById("totalDespesas");
const saldoFinal = document.getElementById("saldoFinal");

const inpData = document.getElementById("data");
const inpNome = document.getElementById("nome");
const inpValor = document.getElementById("valor");
const inpId = document.getElementById("idDespesa");

const tabela = document.querySelector("#tabelaDespesas tbody");
const msgVazio = document.getElementById("msgVazio");


// formatar em reais
function dinheiro(n) {
    return Number(n).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// -------------- CARREGAR / SALVAR NO LOCALSTORAGE ----------
function carregar() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) {
        dados = JSON.parse(salvo);
    }
    mostrarNaTela();
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    mostrarNaTela();
}


// ----------------------- MOSTRAR TUDO NA TELA ---------------
function mostrarNaTela() {

    textoSalario.textContent = dinheiro(dados.salario);

    // limpar tabela
    tabela.innerHTML = "";

    if (dados.despesas.length === 0) {
        msgVazio.style.display = "block";
    } else {
        msgVazio.style.display = "none";
    }

    // colocar despesas na tabela
    dados.despesas.forEach(item => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${item.data}</td>
            <td>${item.nome}</td>
            <td>${dinheiro(item.valor)}</td>
            <td>
                <button onclick="editarDespesa('${item.id}')">Editar</button>
                <button onclick="excluirDespesa('${item.id}')">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });

    const total = dados.despesas.reduce((soma, item) => soma + Number(item.valor), 0);

    totalDespesas.textContent = dinheiro(total);
    saldoFinal.textContent = dinheiro(dados.salario - total);
}


// --- SALVAR SALÁRIO ---
document.getElementById("formSalario").addEventListener("submit", e => {
    e.preventDefault();

    let valor = Number(inpSalario.value);

    if (isNaN(valor) || valor < 0) {
        alert("Digite um salário válido.");
        return;
    }

    dados.salario = valor;
    salvar();

    inpSalario.value = "";
});


// -- SALVAR / EDITAR DESPESA ---
document.getElementById("formDespesa").addEventListener("submit", e => {
    e.preventDefault();

    let data = inpData.value;
    let nome = inpNome.value.trim();
    let valor = Number(inpValor.value);
    let idEdicao = inpId.value;

    if (!data || !nome || isNaN(valor) || valor <= 0) {
        alert("Preencha tudo corretamente.");
        return;
    }

    // Se estiver editando
    if (idEdicao) {
        let item = dados.despesas.find(d => d.id === idEdicao);
        if (item) {
            item.data = data;
            item.nome = nome;
            item.valor = valor;
        }
    } 
    // Senão, criar nova
    else {
        dados.despesas.push({
            id: String(Date.now()),
            data,
            nome,
            valor
        });
    }

    limparFormulario();
    salvar();
});



function limparFormulario() {
    inpData.value = "";
    inpNome.value = "";
    inpValor.value = "";
    inpId.value = "";
}

function editarDespesa(id) {
    let item = dados.despesas.find(d => d.id === id);
    if (!item) return;

    inpData.value = item.data;
    inpNome.value = item.nome;
    inpValor.value = item.valor;
    inpId.value = item.id;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirDespesa(id) {
    if (!confirm("Deseja excluir a despesa?")) return;

    dados.despesas = dados.despesas.filter(d => d.id !== id);
    salvar();
}

carregar();


