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
                background: '#F2EBEB',
                tipoLinha: 'linha-vermelha',
                corTexto: 'fonteVermelha',
                corCaixaTexto: 'vermelho',
                corTextoEvento: 'fonteVermelha',
                corTextoCaixa: 'fonteBranco',
                corCaixaTextop:'fonteBranco'
            };
        } else {
            return {
                background: '#172833',
                tipoLinha: 'linha-branca',
                corTexto: 'fonteBranco',
                corCaixaTexto: 'branco',
                corTextoEvento: 'fonteBranco',
                corTextoCaixa: 'fonteVermelha',
                corCaixaTextop:'fontePreto'
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
                        <div class="timeline-data">
                            <h2  class="${estilo.corTextoEvento}"><strong>${evento.data}</strong></h2>
                        </div>
                        <div class="timeline-evento-container">
                            <div class="icone-wrapper">
                                <img src="images/${icone}" class="icone">
                            </div>
                            <div class='caixatexto ${estilo.corCaixaTexto}'>
                                <a href='${evento.link}' target="_blank">
                                    <div class="flex">
                                        <div>
                                            <h2 class="${estilo.corTextoCaixa}">${decreto}<br>
                                            <strong>${evento.titulo}</strong></h2>
                                            <p class="${estilo.corCaixaTextop}">${evento.descricao}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        return `
            <div class="timeline-year-block" style="background: ${estilo.background}; width: 100vw;">
                <div class="timeline-year-content">
                    <div class="timeline ${estilo.tipoLinha}" style="padding-bottom: 30px;">
                        <div class="timeline-ano">
                            <div class="timeline-bulletano" style="margin-top: 30px; margin-bottom: 20px;"></div>
                            <div class="timeline-content">
                                <h2 class="anotexto ${estilo.corTexto}" style="margin-top: 30px; margin-bottom: 20px;">${ano}</h2>
                            </div>
                        </div>
                        ${eventosHTML}
                    </div>
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
