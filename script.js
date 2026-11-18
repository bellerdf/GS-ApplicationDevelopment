document.getElementById('input-termo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buscarParadas();
    }
});

async function buscarParadas() {
    const termo = document.getElementById('input-termo').value.trim();
    if (!termo) {
        alert('Digite o nome ou endereço de um ponto!');
        return;
    }

    const listaDiv = document.getElementById('lista-paradas');
    listaDiv.innerHTML = '<p>Buscando paradas...</p>';
    document.getElementById('previsao-section').classList.add('hidden');
    document.getElementById('resultados-section').classList.remove('hidden');

    try {
        const res = await fetch(`/api/sptrans?acao=buscarParada&termo=${encodeURIComponent(termo)}`);
        const paradas = await res.json();

        listaDiv.innerHTML = '';

        if (!paradas || paradas.length === 0) {
            listaDiv.innerHTML = '<p>Nenhuma parada encontrada para este termo.</p>';
            return;
        }

        paradas.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${p.np}</h3>
                <p><strong>Endereço:</strong> ${p.ed}</p>
                <p style="font-size: 0.8rem; margin-top: 0.25rem;">Código da Parada: ${p.cp}</p>
            `;
            card.onclick = () => carregarPrevisao(p.cp, p.np);
            listaDiv.appendChild(card);
        });
    } catch (error) {
        listaDiv.innerHTML = '<p>Erro ao buscar paradas. Tente novamente.</p>';
    }
}

async function carregarPrevisao(codigoParada, nomeParada) {
    document.getElementById('titulo-parada').innerText = `Previsão: ${nomeParada}`;
    document.getElementById('resultados-section').classList.add('hidden');
    document.getElementById('previsao-section').classList.remove('hidden');

    const listaPrev = document.getElementById('lista-previsoes');
    listaPrev.innerHTML = '<p>Carregando veículos em tempo real...</p>';

    try {
        const res = await fetch(`/api/sptrans?acao=previsaoParada&codigoParada=${codigoParada}`);
        const dados = await res.json();

        listaPrev.innerHTML = '';

        if (!dados.p || !dados.p.l || dados.p.l.length === 0) {
            listaPrev.innerHTML = '<p>Não há ônibus previstos para este ponto no momento.</p>';
            return;
        }

        dados.p.l.forEach(linha => {
            linha.vs.forEach(veiculo => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>🚌 Linha ${linha.c}</h3>
                    <p><strong>Letreiro:</strong> ${linha.lt0} ➔ ${linha.lt1}</p>
                    <p><strong>Chegada estimada:</strong> ${veiculo.t}</p>
                    <p style="font-size: 0.8rem;">Prefixo do veículo: ${veiculo.p}</p>
                    ${veiculo.a ? '<span class="tag-acessivel">♿ Veículo Acessível</span>' : ''}
                `;
                listaPrev.appendChild(card);
            });
        });
    } catch (error) {
        listaPrev.innerHTML = '<p>Erro ao carregar previsões.</p>';
    }
}

function voltarParaBuscas() {
    document.getElementById('previsao-section').classList.add('hidden');
    document.getElementById('resultados-section').classList.remove('hidden');
}
