document.addEventListener('DOMContentLoaded', () => {
    
    //SELEÇÃO DOS ELEMENTOS DO DOM
    const logForm = document.getElementById('log-form');
    const animatedElements = document.querySelectorAll('.animate-on-load');
    const fileInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const resultadoTagsContainer = document.getElementById('resultado-tags');
    const tagsList = resultadoTagsContainer.querySelector('.tags-list');
    const descricaoContainer = document.getElementById('descricao');
    const btnLimparTudo = document.getElementById('btn-limpar-tudo');
    
    //Animações
    animatedElements.forEach(el => el.classList.add('animated'));
    
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', () => {
            fileNameDisplay.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'Nenhum arquivo selecionado';
        });
    }

    logForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(logForm);
        const submitButton = logForm.querySelector('button[type="submit"]');

        resultadoTagsContainer.classList.remove('hidden');
        tagsList.innerHTML = '<div class="loader"></div>';
        descricaoContainer.classList.add('hidden');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

        fetch('/processar', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) throw new Error('Falha na resposta do servidor.');
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                tagsList.innerHTML = `<p class="error-message">Erro: ${data.erro}</p>`;
                return;
            }
            
            tagsList.innerHTML = '';
            const resultado = data.resultado;

            if (Object.keys(resultado).length === 0) {
                tagsList.innerHTML = '<p>Nenhuma das tags selecionadas foi encontrada no arquivo.</p>';
                return;
            }

            for (const [tag, contagem] of Object.entries(resultado)) {
                const li = document.createElement('li');
                li.className = 'tag-item';
                li.dataset.tag = tag;
                li.innerHTML = `
                    <span class="tag-name">${tag}</span>
                    <span class="tag-count">${contagem}</span>
                `;
                tagsList.appendChild(li);
            }
        })
        .catch(error => {
            console.error('Erro ao processar o arquivo:', error);
            tagsList.innerHTML = `<p class="error-message">Não foi possível processar o arquivo. Tente novamente.</p>`;
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar';
        });
    });
    
    //FUNCIONALIDADE DE BUSCA DENTRO DAS TAGS
    const descricoes = {
        "INFO": "Registros informativos que rastreiam o fluxo normal de uma aplicação.",
        "WARN": "Indica um evento potencialmente prejudicial que pode exigir atenção.",
        "ERROR": "Falha ou erro que impede o funcionamento normal de uma operação.",
        "DEBUG": "Mensagens detalhadas usadas para depuração de código durante o desenvolvimento.",
        "SEC": "Alertas relacionados à segurança, como tentativas de login falhas ou acesso suspeito."
    };

    function mostrarDescricao(tag) {
        descricaoContainer.innerHTML = `
            <h3><i class="fa-solid fa-magnifying-glass"></i> Análise de: ${tag}</h3>
            <p>${descricoes[tag] || "Sem descrição disponível."}</p>
            <div class="form-group">
                <input type="text" id="busca-termo" placeholder="Pesquisar termo dentro de ${tag}...">
            </div>
            <div class="button-group">
                <button id="btn-buscar" class="btn btn-primary"><i class="fa-solid fa-search"></i> Buscar</button>
                <button id="btn-limpar-busca" class="btn btn-secondary"><i class="fa-solid fa-eraser"></i> Limpar</button>
            </div>
            <div id="resultado-busca"></div>
        `;

        document.getElementById('btn-buscar').addEventListener('click', () => filtrarTermo(tag));
        document.getElementById('btn-limpar-busca').addEventListener('click', limparPesquisa);
        document.getElementById('busca-termo').addEventListener('keyup', (event) => {
            if (event.key === 'Enter') filtrarTermo(tag);
        });

        descricaoContainer.classList.remove('hidden');
        setTimeout(() => descricaoContainer.classList.add('ativa'), 10);
    }

    function filtrarTermo(tag) {
        const termo = document.getElementById('busca-termo').value.trim();
        const resultadoDiv = document.getElementById('resultado-busca');
        const btnBuscar = document.getElementById('btn-buscar');

        if (!termo) {
            resultadoDiv.innerHTML = "<p>Por favor, digite um termo para buscar.</p>";
            return;
        }

        resultadoDiv.innerHTML = '<div class="loader"></div>';
        btnBuscar.disabled = true;
        btnBuscar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';

        fetch(`/buscar/${tag}?q=${encodeURIComponent(termo)}`)
            .then(response => {
                if (!response.ok) throw new Error(`Erro de rede: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                const resultados = data.resultados;
                if (resultados.length === 0) {
                    resultadoDiv.innerHTML = "<p>Nenhum resultado encontrado para o termo pesquisado.</p>";
                } else {
                    const regex = new RegExp(`(${termo})`, "gi");
                    resultadoDiv.innerHTML = resultados
                        .map(item => `<p>${item.replace(regex, '<mark>$1</mark>')}</p>`)
                        .join("");
                }
            })
            .catch(err => {
                console.error("Erro ao buscar:", err);
                resultadoDiv.innerHTML = "<p>Ocorreu um erro ao buscar os dados. Tente novamente.</p>";
            })
            .finally(() => {
                btnBuscar.disabled = false;
                btnBuscar.innerHTML = '<i class="fa-solid fa-search"></i> Buscar';
            });
    }

    function limparPesquisa() {
        const campoBusca = document.getElementById('busca-termo');
        const resultadoDiv = document.getElementById('resultado-busca');
        if (campoBusca) campoBusca.value = "";
        if (resultadoDiv) resultadoDiv.innerHTML = "";
    }

    function limparTudo() {
        logForm.reset();
        fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        resultadoTagsContainer.classList.add('hidden');
        tagsList.innerHTML = "";
        descricaoContainer.classList.add('hidden');
        descricaoContainer.innerHTML = "";
    }

    btnLimparTudo.addEventListener('click', limparTudo);

    if (tagsList) {
        tagsList.addEventListener('click', (event) => {
            const tagItem = event.target.closest('.tag-item');
            if (tagItem) {
                const tag = tagItem.dataset.tag;
                mostrarDescricao(tag);
            }
        });
    }
});