const descricoes = {
    "INFO": "Informações sobre o sistema.",
    "WARN": "Aviso sobre possível problema.",
    "ERROR": "Falha que pede uma prioridade.",
    "DEBUG": "Alerta usado para depuração.",
    "SEC": "Aviso de segurança ou acesso suspeito."
};

let tagSelecionada = null;

function mostrarDescricao(tag) {
    tagSelecionada = tag;
    const descricaoDiv = document.getElementById('descricao');

    descricaoDiv.innerHTML = `
        <strong>${tag}</strong>: ${descricoes[tag] || "Sem descrição disponível."}
        <br><br>
        <input type="text" id="busca-termo" placeholder="Pesquisar dentro de ${tag}">
        <button id="btn-buscar">Buscar</button>
        <button id="btn-limpar">Limpar</button>
        <div id="resultado-busca" class="resultados"></div>
    `;

    // Eventos dos botões
    document.getElementById('btn-buscar').onclick = () => {
        if (tagSelecionada) filtrarTermo(tagSelecionada);
    };

    document.getElementById('btn-limpar').onclick = limparPesquisa;

    descricaoDiv.classList.add('ativa');
    setTimeout(() => {
        descricaoDiv.classList.remove('ativa');
    }, 100000000000);
}

function filtrarTermo(tag) {
    const termo = document.getElementById('busca-termo').value;

    fetch(`/buscar/${tag}?q=${encodeURIComponent(termo)}`)
        .then(response => response.json())
        .then(data => {
            const resultadoDiv = document.getElementById('resultado-busca');
            const resultados = data.resultados;

            if (resultados.length === 0) {
                resultadoDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
            } else {
                // Destaca o termo encontrado dentro da linha
                resultadoDiv.innerHTML = resultados
                    .map(item => {
                        const regex = new RegExp(`(${termo})`, "gi");
                        return `<p>${item.replace(regex, '<mark>$1</mark>')}</p>`;
                    })
                    .join("");
            }
        })
        .catch(err => {
            console.error("Erro ao buscar:", err);
            document.getElementById('resultado-busca').innerHTML = "<p>Erro ao buscar dados.</p>";
        });
}

function limparPesquisa() {
    const campo = document.getElementById('busca-termo');
    const resultados = document.getElementById('resultado-busca');

    if (campo) campo.value = "";
    if (resultados) resultados.innerHTML = "";
}

function limparTudo() {
    document.querySelector("form").reset();

    const resultadoTags = document.getElementById("resultado-tags");
    if (resultadoTags) {
        resultadoTags.innerHTML = "";
    }
    const descricao = document.getElementById("descricao");
    if (descricao) {
        descricao.innerHTML = "";
    }
}