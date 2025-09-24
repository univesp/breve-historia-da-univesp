// Timeline dinâmica da Univesp
class UnivespTimeline {
    constructor() {
        this.eventos = [];
        this.timelineContainer = null;
    }

    // Carrega os dados do JSON
    async carregarDados() {
        try {
            const response = await fetch('./data/datas.json');
            this.eventos = await response.json();
            console.log('Dados carregados:', this.eventos);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    // Agrupa eventos por ano
    agruparPorAno() {
        const eventosPorAno = {};
        
        this.eventos.forEach(evento => {
            if (!eventosPorAno[evento.ano]) {
                eventosPorAno[evento.ano] = [];
            }
            eventosPorAno[evento.ano].push(evento);
        });
        
        return eventosPorAno;
    }

    // Determina se o ano deve ter fundo branco ou vermelho (alternado)
    obterEstiloAno(ano, index) {
        // Anos pares: fundo branco, texto vermelho
        // Anos ímpares: fundo vermelho, texto branco
        const isEven = index % 2 === 0;
        
        if (isEven) {
            return {
                background: '#fff',
                tipoLinha: 'linha-vermelha',
                corTexto: 'fonteVermelha',
                corCaixaTexto: 'vermelho',
                corTextoEvento: 'fonteVermelha',
                corTextoCaixa: 'fonteBranco'
            };
        } else {
            return {
                background: '#ed3b48',
                tipoLinha: 'linha-branca',
                corTexto: 'fonteBranco',
                corCaixaTexto: 'branco',
                corTextoEvento: 'fonteBranco',
                corTextoCaixa: 'fonteVermelha'
            };
        }
    }

    // Gera HTML para um ano
    gerarHTMLAno(ano, eventos, estilo) {
        let eventosHTML = '';
        
        eventos.forEach(evento => {
            const decreto = evento.decreto ? evento.decreto : '';
            const icone = evento.icone || '01.svg';
            
            eventosHTML += `
                <div class="timeline-event">
                    <div class="timeline-bullet"></div>
                    <div class="timeline-content">
                        <h2 class="${estilo.corTextoEvento}"><strong>${evento.data}</strong></h2>
                        <div class="icone-wrapper">
                            <img src="images/${icone}" class="icone">
                        </div>
                        <div class='caixatexto ${estilo.corCaixaTexto}'>
                            <a href='${evento.link}' target="_blank">
                                <div class="flex">
                                    <h2 class="${estilo.corTextoCaixa}">${decreto}<br>
                                    <strong>${evento.titulo}</strong></h2>
                                </div>
                                <p class="${estilo.corTextoCaixa}">${evento.descricao}</p>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        return `
            <div class="${ano}" style="background: ${estilo.background}; width: 100%;">
                <div class="timeline ${estilo.tipoLinha}">
                    <div class="timeline-ano">
                        <div class="timeline-bulletano"></div>
                        <div class="timeline-content">
                            <h2 class="anotexto ${estilo.corTexto}">${ano}</h2>
                        </div>
                    </div> 
                    ${eventosHTML}
                </div>
            </div>
        `;
    }

    // Gera toda a timeline
    gerarTimeline() {
        const eventosPorAno = this.agruparPorAno();
        const anos = Object.keys(eventosPorAno).sort();
        let timelineHTML = '';
        
        anos.forEach((ano, index) => {
            const eventos = eventosPorAno[ano];
            const estilo = this.obterEstiloAno(ano, index);
            timelineHTML += this.gerarHTMLAno(ano, eventos, estilo);
        });
        
        return timelineHTML;
    }

    // Renderiza a timeline no DOM
    renderizar() {
        const timelineContainer = document.querySelector('.timeline');
        if (timelineContainer) {
            
            const timelineParent = timelineContainer.parentNode;
            
            
            const abertura = timelineParent.querySelector('#abertura').parentNode;
            let elementoAtual = abertura.nextElementSibling;
            
            while (elementoAtual) {
                const proximo = elementoAtual.nextElementSibling;
                elementoAtual.remove();
                elementoAtual = proximo;
            }
            
            // Adiciona o HTML gerado
            const timelineHTML = this.gerarTimeline();
            abertura.insertAdjacentHTML('afterend', timelineHTML);
        }
    }

    // Inicializa a timeline
    async inicializar() {
        await this.carregarDados();
        this.renderizar();
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const timeline = new UnivespTimeline();
    timeline.inicializar();
});
