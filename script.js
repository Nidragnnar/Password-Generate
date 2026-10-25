// ========== Conjuntos de caracteres ==========
const CONJUNTOS = {
    maiusculas: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    minusculas: "abcdefghijklmnopqrstuvwxyz",
    numeros: "0123456789",
    simbolos: "!@#$%&*()-_=+[]{};:,.?/",
};

// Caracteres fáceis de confundir na hora de ler ou digitar
const PARECIDOS = /[Il1O0o]/g;

// ========== Sorteio seguro ==========
// Usa crypto.getRandomValues (gerador próprio para criptografia) em vez de Math.random,
// que é previsível. Descarta valores acima do maior múltiplo de "max" para que
// todos os resultados tenham exatamente a mesma chance (sem viés de módulo).
function numeroAleatorio(max) {
    const limite = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    do {
        crypto.getRandomValues(buffer);
    } while (buffer[0] >= limite);
    return buffer[0] % max;
}

function caractereAleatorio(texto) {
    return texto[numeroAleatorio(texto.length)];
}

// Embaralhamento Fisher-Yates com o sorteio seguro
function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = numeroAleatorio(i + 1);
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

// Gera a senha garantindo pelo menos um caractere de cada tipo escolhido
function gerarSenha(tamanho, tipos, evitarParecidos) {
    const conjuntos = tipos.map((tipo) =>
        evitarParecidos ? CONJUNTOS[tipo].replace(PARECIDOS, "") : CONJUNTOS[tipo]
    );
    const todos = conjuntos.join("");

    const caracteres = conjuntos.map(caractereAleatorio);
    while (caracteres.length < tamanho) {
        caracteres.push(caractereAleatorio(todos));
    }
    return { senha: embaralhar(caracteres).join(""), tamanhoAlfabeto: todos.length };
}

// ========== Força da senha ==========
// Entropia em bits = tamanho × log2(quantidade de caracteres possíveis)
function calcularForca(tamanho, tamanhoAlfabeto) {
    const bits = Math.round(tamanho * Math.log2(tamanhoAlfabeto));
    if (bits < 45) return { nivel: 1, texto: "Fraca", bits };
    if (bits < 65) return { nivel: 2, texto: "Média", bits };
    if (bits < 90) return { nivel: 3, texto: "Forte", bits };
    return { nivel: 4, texto: "Muito forte", bits };
}

// ========== Interface ==========
const campoSenha = document.querySelector("#senha");
const slider = document.querySelector("#tamanho");
const valorTamanho = document.querySelector("#valor-tamanho");
const opcoes = document.querySelectorAll("input[name=tipo]");
const evitarParecidos = document.querySelector("#parecidos");
const botaoGerar = document.querySelector("#gerar");
const botaoCopiar = document.querySelector("#copiar");
const forca = document.querySelector(".forca");
const forcaTexto = document.querySelector("#forca-texto");
const aviso = document.querySelector("#aviso");

function tiposEscolhidos() {
    return [...opcoes].filter((o) => o.checked).map((o) => o.value);
}

function atualizar() {
    const tipos = tiposEscolhidos();
    const tamanho = Number(slider.value);
    valorTamanho.textContent = tamanho;
    slider.style.setProperty("--progresso", `${((tamanho - slider.min) / (slider.max - slider.min)) * 100}%`);

    const { senha, tamanhoAlfabeto } = gerarSenha(tamanho, tipos, evitarParecidos.checked);
    campoSenha.value = senha;

    const resultado = calcularForca(tamanho, tamanhoAlfabeto);
    forca.dataset.nivel = resultado.nivel;
    forcaTexto.textContent = `${resultado.texto} (${resultado.bits} bits)`;
}

// Não deixa desmarcar a última opção: a senha precisa de pelo menos um tipo
opcoes.forEach((opcao) => {
    opcao.addEventListener("change", () => {
        if (tiposEscolhidos().length === 0) {
            opcao.checked = true;
            mostrarAviso("Escolha pelo menos um tipo de caractere.");
            return;
        }
        atualizar();
    });
});

slider.addEventListener("input", atualizar);
evitarParecidos.addEventListener("change", atualizar);
botaoGerar.addEventListener("click", () => {
    atualizar();
    campoSenha.classList.remove("nova");
    void campoSenha.offsetWidth; // reinicia a animação
    campoSenha.classList.add("nova");
});

let temporizadorAviso;
function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.classList.add("visivel");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove("visivel"), 2000);
}

async function copiarSenha() {
    try {
        await navigator.clipboard.writeText(campoSenha.value);
        mostrarAviso("Senha copiada!");
    } catch {
        // Alternativa para navegadores que bloqueiam a área de transferência
        campoSenha.select();
        mostrarAviso("Selecionei a senha: use Ctrl+C para copiar.");
    }
}

botaoCopiar.addEventListener("click", copiarSenha);
campoSenha.addEventListener("click", copiarSenha);

atualizar();
