$(function () {
    var casa_selecionada = null;
    var peca_selecionada = null;
    var personagens = null;
    var jogadores = null;
    var qtdLinhas = 30;
    var qtdColunas = 35;

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
            qtdMovimento: 3
        };
    }

    function marcarMovimentoZigZag(linhaInicio, colunaInicio, qtdMaximoMovimento) {
        var i;
        for (i = 0; i < qtdLinhas; i++) {
            for (j = 0; j < qtdColunas; j++) {
                if (i == linhaInicio || j == colunaInicio) {
                    continue;
                }

                var diffLinha = Math.abs(linhaInicio - i);
                var diffColuna = Math.abs(colunaInicio - j);
                var diffTotal = diffLinha + diffColuna;

                console.log("diffLinha: ", diffLinha);
                console.log("diffColuna: ", diffColuna);
                console.log("diffTotal: ", diffTotal);

                if (diffTotal <= qtdMaximoMovimento) {
                    var nome_casa = getNomeCasa(i, j);
                    $("#" + nome_casa).addClass("casa_possivel");   
                }
            }
        }
    }

    function marcarMovimento(linhaInicio, colunaInicio, qtdMaximoMovimento) {
        var i;
        for (i = 0; i < qtdLinhas; i++) {
            for (j = 0; j < qtdColunas; j++) {
                var diffLinha = Math.abs(linhaInicio - i);
                var diffColuna = Math.abs(colunaInicio - j);
                var diffTotal = diffLinha + diffColuna;

                console.log("diffLinha: ", diffLinha);
                console.log("diffColuna: ", diffColuna);
                console.log("diffTotal: ", diffTotal);

                if (diffTotal <= qtdMaximoMovimento) {
                    var nome_casa = getNomeCasa(i, j);
                    $("#" + nome_casa).addClass("casa_possivel");   
                }
            }
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
        atualizarTela();
    }

    function desenharJogadores() {
        for (var i = 0, len = jogadores.length; i < len; i++) {
            var jogador = jogadores[i];
            var nomeCasa = getNomeCasa(jogador.linha, jogador.coluna);
            var iniciais = jogador.nome.split(" ").map((n,i,a)=> i === 0 || i+1 === a.length ? n[0] : null).join("");
            $("#" + nomeCasa).append("<div class='jogador' id='jogador_" + jogador.id + "'>" + iniciais + "</div>");
        }
    }


    function atualizarTela() {
        limparTabuleiro();
        montarTabuleiro();
        criarJogadores();
        desenharJogadores();

        $(".casa").click(casaOnClick);
    }

    function casaOnClick() {
        casa_selecionada = $(this).attr("id");
        //$("#" + casa_selecionada).removeClass("casa_selecionada");
        atualizarTela();
        $("#" + casa_selecionada).addClass("casa_selecionada");
        $("#info_casa_selecionada").text(casa_selecionada);

        
        peca_selecionada = $("#" + casa_selecionada).children(".jogador").attr("id");
        if (peca_selecionada == null) {
            peca_selecionada = "NENHUM JOGADOR SELECIONADO";
        } else {
            //marcar movimento possivel
            var jogadorId = peca_selecionada.split("_")[1];
            var jogadorSelecionado = buscarJogador(jogadorId);
            marcarMovimento(jogadorSelecionado.linha, jogadorSelecionado.coluna, 3);
        }
        $("#info_peca_selecionada").text(peca_selecionada.toString());
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
});