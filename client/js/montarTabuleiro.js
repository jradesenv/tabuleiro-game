$(function () {
    var casa_selecionada = null;
    var peca_selecionada = null;
    var personagens = null;
    var jogadores = null;
    var qtdLinhas = 30;
    var qtdColunas = 35;
    var jogadorSelecionado = null;
    var indexJogadorAtual = null;

    function Personagem(nome, descricao, habilidades) {
        return {
            nome: nome,
            descricao: descricao,
            habilidades: habilidades
        };
    }

    function Habilidade(nome) {
        return {
            nome: nome
        };
    }

    function Jogador(id, nome, linha, coluna, personagemId, personagemHabilidadeSelecionada) {
        return {
            id: id,
            nome: nome,
            linha: linha,
            coluna: coluna,
            personagemId: personagemId,
            personagemHabilidadeSelecionada: personagemHabilidadeSelecionada,
            qtdMovimento: 3,
            zigZagAtivo: false
        };
    }

    function marcarMovimento(linhaInicio, colunaInicio) {
        marcarCasaPossivel(linhaInicio - 1, colunaInicio);  //cima
        marcarCasaPossivel(linhaInicio + 1, colunaInicio);  //baixo
        marcarCasaPossivel(linhaInicio, colunaInicio - 1);  //esqueda
        marcarCasaPossivel(linhaInicio, colunaInicio + 1);  //direita
    }

    function marcarMovimentoZigZag(linhaInicio, colunaInicio) {
        marcarCasaPossivel(linhaInicio - 1, colunaInicio -1);  //cima
        marcarCasaPossivel(linhaInicio - 1, colunaInicio + 1);  //cima
        marcarCasaPossivel(linhaInicio + 1, colunaInicio + 1);  //baixo
        marcarCasaPossivel(linhaInicio + 1, colunaInicio - 1);  //baixo
        
    }

    function marcarCasaPossivel(linha, coluna) {
        var nome_casa = getNomeCasa(linha, coluna);
        var casa = $("#" + nome_casa);

        if (casa != null) {
            casa.addClass("casa_possivel");
        }
    }

    function criarPersonagens() {
        personagens = [
            new Personagem("Marvinho", "robô que pulo e acaba o jogo", [
                new Habilidade("Pula o mapa todo"),
                new Habilidade("Ri da cara do outro jogador")
            ])
        ];
    }

    function criarJogadores() {
        jogadores = [
            new Jogador(1, "Jean Robert Alves", 1, 1),
            new Jogador(2, "Alice Goerck", 10, 5),
            new Jogador(3, "Arthur Goerck Alves", 5, 7),
            new Jogador(4, "William Robert Alves", 3, 13),
            new Jogador(5, "Adrielly", 10, 25)
        ];
    }

    start();
    function start() {
        criarPersonagens();
        criarJogadores();
        atualizarTela();
    }

    function desenharJogadores() {
        console.log("desenharJogadores: ", jogadores);

        for (var i = 0, len = jogadores.length; i < len; i++) {
            var jogador = jogadores[i];
            var nomeCasa = getNomeCasa(jogador.linha, jogador.coluna);
            var iniciais = jogador.nome.split(" ").map((n,i,a)=> i === 0 || i+1 === a.length ? n[0] : null).join("");
            
            var jogadorControlId = "jogador_" + jogador.id;
            $("#" + nomeCasa).append("<div class='jogador' id='" + jogadorControlId + "'>" + iniciais + "</div>");

            if (jogadorSelecionado != null && jogadorSelecionado.id == jogador.id) {
                $("#" + jogadorControlId).addClass("jogador_selecionado");
            }
        }

        if (jogadorSelecionado != null) {
            if (jogadorSelecionado.zigZagAtivo) {
                marcarMovimentoZigZag(jogadorSelecionado.linha, jogadorSelecionado.coluna);
            } else {
                marcarMovimento(jogadorSelecionado.linha, jogadorSelecionado.coluna);
            }
        }
    }

    function atualizarJogadorAtual() {
        var jogadorAtual = null;
        var trocarJogador = false;

        if (indexJogadorAtual != null) {
            jogadorAtual = jogadores[indexJogadorAtual];
        } else {
            trocarJogador = true;
        }

        if (jogadorAtual != null && jogadorAtual.qtdMovimento <= 0) {
            jogadorAtual.qtdMovimento = 3;
            jogadorAtual.zigZagAtivo = false;
            trocarJogador = true;
        }

        if (trocarJogador) {
            if (indexJogadorAtual != null && indexJogadorAtual < (jogadores.length -1)) {
                indexJogadorAtual += 1;
            } else {
                indexJogadorAtual = 0;
            }

            jogadorAtual = jogadores[indexJogadorAtual];
            console.log("indexJogadorAtual % 2 == 0: ", indexJogadorAtual % 2 == 0);
            if (indexJogadorAtual % 2 == 0) {
                jogadorAtual.qtdMovimento = 6;
                jogadorAtual.zigZagAtivo = true;
            } else {
                jogadorAtual.qtdMovimento = 3;
                jogadorAtual.zigZagAtivo = false;
            }
        }

        selecionarJogador(jogadorAtual.id)
    }

    function atualizarTela() {
        atualizarJogadorAtual();
        limparTabuleiro();
        montarTabuleiro();
        desenharJogadores();

        $(".casa").click(casaOnClick);
    }

    function casaOnClick() {
        casa_selecionada = $(this).attr("id");
        
        var idControleJogador = $("#" + casa_selecionada).children(".jogador").attr("id");
        if (idControleJogador != null) {
            var jogadorId = idControleJogador.split("_")[1];
            selecionarJogador(jogadorId);
        } else {
            var isCasaPossivel = $("#" + casa_selecionada).hasClass("casa_possivel");

            console.log("isCasaPossivel: ", isCasaPossivel);
            if (isCasaPossivel) {
                var index = getIndexCasa(casa_selecionada);
                jogadorSelecionado.linha = index.linha;
                jogadorSelecionado.coluna = index.coluna;
                jogadorSelecionado.qtdMovimento -= 1;

                salvarJogador(jogadorSelecionado);
            }
        }

        atualizarTela();
    }

    function salvarJogador(jogadorSalvar) {
        var index = null;
        
        for (var i = 0, len = jogadores.length; i < len; i++) {
            if (jogadores[i].id == jogadorSalvar.id) {
                index = i;
                break;
            }
        }

        if (index != null) {
            console.log("salvando jogador index: ", index);
            jogadores[index] = jogadorSalvar;
        }

        console.log("salvarJogador: ", jogadores);
    }

    function selecionarJogador(id) {
        $("#info_peca_selecionada").text(id);

        jogadorSelecionado = buscarJogador(id);
        $("#info_qtd_movimentos").text(jogadorSelecionado.qtdMovimento);
    }

    function buscarJogador(id) {
        var jogador = null;
        
        for (var i = 0, len = jogadores.length; i < len; i++) {
            if (jogadores[i].id == id) {
                jogador = jogadores[i];
                break;
            }
        }

        return jogador;
    }

    function limparTabuleiro() {
        $("#tabuleiro").empty();
    }

    function montarTabuleiro() {
        var i;
        for (i = 0; i < qtdLinhas; i++) {
            $("#tabuleiro").append("<tr id='linha_" + i.toString() + "' class='linha' >");

            for (j = 0; j < qtdColunas; j++) {
                var nome_casa = getNomeCasa(i, j);
                var classe = "casa_normal";
                $("#linha_" + i.toString()).append("<td id='" + nome_casa + "' class='casa " + classe + "' />");
            }
        }
    }

    function getNomeCasa(linha, coluna) {
        return "casa_" + (linha + 1).toString() + "_" + (coluna + 1).toString();
    }

    function getIndexCasa(idCasa) {
        var parts = idCasa.split("_");
        return {
            linha: parts[1] -1,
            coluna: parts[2] - 1
        };
    }
});