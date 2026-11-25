import { Jogador } from "../src/personagens/jogador";
import { Guerreiro } from "../src/personagens/guerreiro";
import { Mago } from "../src/personagens/mago";
import { Jogo } from "../src/jogo/jogo";
import { Arqueiro, Pacifista } from "./arqueiro_teste";

/**
 * testes.ts
 * ---------------------------------------------------------------------------
 * SUÍTE DE TESTES do sistema de batalha.
 *
 * Não usa framework externo: um pequeno verificador próprio registra [OK] e
 * [FALHA], mostra os valores obtidos e retorna código de saída 1 se algo
 * falhar (útil para CI/GitHub Actions).
 *
 * Organização:
 *  1. Jogador
 *  2. Guerreiro
 *  3. Mago
 *  4. Jogo
 *  5. Sequência oficial do enunciado (item 7)
 *  6. Desafio adicional (duelar)
 *  7. Extensibilidade (Arqueiro)
 */

// ===========================================================================
// Infraestrutura de testes
// ===========================================================================
let totalTestes = 0;
let totalFalhas = 0;

function mensagemDeErro(erro: unknown): string {
    return erro instanceof Error ? erro.message : String(erro);
}

/** Executa um caso de teste e registra o resultado. */
function teste(descricao: string, acao: () => void): void {
    totalTestes++;

    try {
        acao();
        console.log(`[OK]    ${descricao}`);
    } catch (erro) {
        totalFalhas++;
        console.error(`[FALHA] ${descricao}`);
        console.error(`        -> ${mensagemDeErro(erro)}`);
    }
}

/** Garante que uma condição seja verdadeira. */
function verificar(condicao: boolean, mensagem: string): void {
    if (!condicao) {
        throw new Error(mensagem);
    }
}

/** Compara dois valores com === e mostra ambos em caso de erro. */
function igual<T>(obtido: T, esperado: T, rotulo: string = "valor"): void {
    if (obtido !== esperado) {
        throw new Error(`${rotulo}: esperado ${String(esperado)}, obtido ${String(obtido)}`);
    }
}

/** Garante que a ação lance uma exceção (opcionalmente com trecho na mensagem). */
function lancaErro(acao: () => void, trecho?: string): void {
    try {
        acao();
    } catch (erro) {
        if (trecho !== undefined && !mensagemDeErro(erro).includes(trecho)) {
            throw new Error(
                `Exceção lançada, mas a mensagem não contém "${trecho}": ${mensagemDeErro(erro)}`
            );
        }
        return;
    }

    throw new Error("Era esperada uma exceção, mas nenhuma foi lançada.");
}

function secao(titulo: string): void {
    console.log(`\n=== ${titulo} ===`);
}

// ===========================================================================
// 1) Jogador
// ===========================================================================
secao("1. Jogador");

teste("getters expõem id, nome, vida e força de ataque", () => {
    const jogador = new Jogador(1, "Arthur", 80, 15);

    igual(jogador.id, 1, "id");
    igual(jogador.nome, "Arthur", "nome");
    igual(jogador.vida, 80, "vida");
    igual(jogador.forcaAtaque, 15, "forcaAtaque");
});

teste("setter de nome altera e remove espaços nas extremidades", () => {
    const jogador = new Jogador(1, "Arthur", 100, 15);
    jogador.nome = "  Rei Arthur  ";

    igual(jogador.nome, "Rei Arthur", "nome");
});

teste("setter de nome rejeita string vazia", () => {
    const jogador = new Jogador(1, "Arthur", 100, 15);
    lancaErro(() => {
        jogador.nome = "   ";
    }, "não pode ser vazio");
    igual(jogador.nome, "Arthur", "nome preservado");
});

teste("construtor aceita os limites de vida 0 e 100", () => {
    igual(new Jogador(1, "Sem vida", 0, 10).vida, 0);
    igual(new Jogador(2, "Cheio", 100, 10).vida, 100);
});

teste("construtor rejeita vida negativa ou acima de 100", () => {
    lancaErro(() => new Jogador(1, "Inválido", -1, 10), "entre 0 e 100");
    lancaErro(() => new Jogador(1, "Inválido", 101, 10), "entre 0 e 100");
});

teste("construtor rejeita força de ataque menor ou igual a zero", () => {
    lancaErro(() => new Jogador(1, "Inválido", 100, 0), "maior que zero");
    lancaErro(() => new Jogador(1, "Inválido", 100, -5), "maior que zero");
});

teste("construtor rejeita nome vazio", () => {
    lancaErro(() => new Jogador(1, "   ", 100, 10), "nome");
});

teste("atacar reduz a vida do adversário pela força de ataque", () => {
    const atacante = new Jogador(1, "Arthur", 100, 15);
    const alvo = new Jogador(2, "Thor", 100, 20);

    atacante.atacar(alvo);

    igual(alvo.vida, 85, "vida do alvo");
    igual(atacante.vida, 100, "vida do atacante (inalterada)");
});

teste("receberDano ignora valores menores ou iguais a zero", () => {
    const jogador = new Jogador(1, "Arthur", 50, 15);

    jogador.receberDano(0);
    jogador.receberDano(-30);

    igual(jogador.vida, 50, "vida");
});

teste("receberDano nunca deixa a vida negativa", () => {
    const jogador = new Jogador(1, "Arthur", 20, 15);

    jogador.receberDano(999);

    igual(jogador.vida, 0, "vida");
    igual(jogador.estaVivo(), false, "estaVivo");
});

teste("estaVivo reflete vida > 0", () => {
    const jogador = new Jogador(1, "Arthur", 1, 15);

    igual(jogador.estaVivo(), true, "com vida 1");
    jogador.receberDano(1);
    igual(jogador.estaVivo(), false, "com vida 0");
});

teste("recuperarVida aumenta a vida e respeita o limite de 100", () => {
    const jogador = new Jogador(1, "Arthur", 70, 15);

    jogador.recuperarVida(20);
    igual(jogador.vida, 90, "após +20");

    jogador.recuperarVida(50);
    igual(jogador.vida, 100, "após +50 (limitado a 100)");
});

teste("recuperarVida ignora valores menores ou iguais a zero", () => {
    const jogador = new Jogador(1, "Arthur", 40, 15);

    jogador.recuperarVida(0);
    jogador.recuperarVida(-10);

    igual(jogador.vida, 40, "vida");
});

// ===========================================================================
// 2) Guerreiro
// ===========================================================================
secao("2. Guerreiro");

teste("Guerreiro herda de Jogador e mantém os atributos herdados", () => {
    const guerreiro = new Guerreiro(2, "Thor", 100, 20, 10);

    verificar(guerreiro instanceof Jogador, "deveria ser instanceof Jogador");
    igual(guerreiro.id, 2, "id herdado");
    igual(guerreiro.nome, "Thor", "nome herdado");
    igual(guerreiro.vida, 100, "vida herdada");
    igual(guerreiro.forcaAtaque, 20, "força herdada");
    igual(guerreiro.bonusAtaque, 10, "bônus próprio");
});

teste("ataque do Guerreiro soma força + bônus (20 + 10 = 30)", () => {
    const guerreiro = new Guerreiro(2, "Thor", 100, 20, 10);
    const alvo = new Jogador(1, "Arthur", 100, 15);

    guerreiro.atacar(alvo);

    igual(alvo.vida, 70, "vida do alvo");
});

teste("Guerreiro com bônus zero causa apenas o ataque comum", () => {
    const guerreiro = new Guerreiro(2, "Thor", 100, 20, 0);
    const alvo = new Jogador(1, "Arthur", 100, 15);

    guerreiro.atacar(alvo);

    igual(alvo.vida, 80, "vida do alvo");
});

teste("setter de bônus aceita zero e valores positivos", () => {
    const guerreiro = new Guerreiro(2, "Thor", 100, 20, 10);

    guerreiro.bonusAtaque = 0;
    igual(guerreiro.bonusAtaque, 0, "bônus zero");

    guerreiro.bonusAtaque = 15;
    igual(guerreiro.bonusAtaque, 15, "bônus 15");
});

teste("setter de bônus rejeita valor negativo e preserva o anterior", () => {
    const guerreiro = new Guerreiro(2, "Thor", 100, 20, 10);

    lancaErro(() => {
        guerreiro.bonusAtaque = -1;
    }, "maior ou igual a zero");

    igual(guerreiro.bonusAtaque, 10, "bônus preservado");
});

teste("construtor do Guerreiro rejeita bônus negativo", () => {
    lancaErro(() => new Guerreiro(2, "Thor", 100, 20, -5), "maior ou igual a zero");
});

// ===========================================================================
// 3) Mago
// ===========================================================================
secao("3. Mago");

teste("Mago herda de Jogador e expõe mana", () => {
    const mago = new Mago(3, "Merlin", 100, 15, 20);

    verificar(mago instanceof Jogador, "deveria ser instanceof Jogador");
    igual(mago.id, 3, "id herdado");
    igual(mago.forcaAtaque, 15, "força herdada");
    igual(mago.mana, 20, "mana própria");
});

teste("construtor aceita mana 0 e 100", () => {
    igual(new Mago(1, "Mago", 100, 15, 0).mana, 0);
    igual(new Mago(2, "Mago", 100, 15, 100).mana, 100);
});

teste("construtor rejeita mana negativa ou acima de 100", () => {
    lancaErro(() => new Mago(1, "Mago", 100, 15, -1), "entre 0 e 100");
    lancaErro(() => new Mago(1, "Mago", 100, 15, 101), "entre 0 e 100");
});

teste("ataque mágico com mana suficiente causa o dobro e gasta 10", () => {
    const mago = new Mago(3, "Merlin", 100, 15, 20);
    const alvo = new Jogador(1, "Arthur", 100, 15);

    mago.atacar(alvo);

    igual(alvo.vida, 70, "vida do alvo (30 de dano)");
    igual(mago.mana, 10, "mana após o ataque");
});

teste("ataque mágico funciona com exatamente 10 de mana", () => {
    const mago = new Mago(3, "Merlin", 100, 15, 10);
    const alvo = new Jogador(1, "Arthur", 100, 15);

    mago.atacar(alvo);

    igual(alvo.vida, 70, "vida do alvo (30 de dano)");
    igual(mago.mana, 0, "mana após o ataque");
});

teste("sem mana suficiente o Mago faz apenas o ataque comum", () => {
    const mago = new Mago(3, "Merlin", 100, 15, 9);
    const alvo = new Jogador(1, "Arthur", 100, 15);

    mago.atacar(alvo);

    igual(alvo.vida, 85, "vida do alvo (15 de dano)");
    igual(mago.mana, 9, "mana não é gasta");
});

teste("recuperarMana soma e respeita o limite de 100", () => {
    const mago = new Mago(3, "Merlin", 100, 15, 0);

    mago.recuperarMana(30);
    igual(mago.mana, 30, "após +30");

    mago.recuperarMana(90);
    igual(mago.mana, 100, "após +90 (limitado a 100)");
});

teste("recuperarMana ignora valores menores ou iguais a zero", () => {
    const mago = new Mago(3, "Merlin", 100, 15, 50);

    mago.recuperarMana(0);
    mago.recuperarMana(-10);

    igual(mago.mana, 50, "mana");
});

// ===========================================================================
// 4) Jogo
// ===========================================================================
secao("4. Jogo");

teste("incluir aceita IDs únicos e rejeita duplicados", () => {
    const jogo = new Jogo();

    igual(jogo.incluir(new Jogador(1, "Arthur", 100, 15)), true, "primeiro ID 1");
    igual(jogo.incluir(new Guerreiro(2, "Thor", 100, 20, 10)), true, "ID 2");
    igual(jogo.incluir(new Mago(3, "Merlin", 100, 15, 20)), true, "ID 3");
    igual(
        jogo.incluir(new Guerreiro(2, "Clone", 100, 20, 10)),
        false,
        "ID 2 duplicado"
    );
});

teste("consultar retorna o jogador pelo ID ou null", () => {
    const jogo = new Jogo();
    const arthur = new Jogador(1, "Arthur", 100, 15);
    jogo.incluir(arthur);

    igual(jogo.consultar(1), arthur, "ID existente");
    igual(jogo.consultar(999), null, "ID inexistente");
});

teste("excluir remove pelo ID e informa se a operação ocorreu", () => {
    const jogo = new Jogo();
    jogo.incluir(new Jogador(1, "Arthur", 100, 15));

    igual(jogo.excluir(1), true, "exclusão existente");
    igual(jogo.consultar(1), null, "consulta após exclusão");
    igual(jogo.excluir(1), false, "exclusão repetida");
    igual(jogo.excluir(999), false, "exclusão inexistente");
});

teste("é possível reincluir um ID depois de excluí-lo", () => {
    const jogo = new Jogo();
    jogo.incluir(new Jogador(1, "Arthur", 100, 15));
    jogo.excluir(1);

    igual(jogo.incluir(new Jogador(1, "Arthur II", 100, 15)), true);
});

teste("batalhar usa polimorfismo: Guerreiro causa 30 e Mago causa 30", () => {
    const jogo = new Jogo();
    const alvo1 = new Jogador(10, "Alvo 1", 100, 10);
    const alvo2 = new Jogador(11, "Alvo 2", 100, 10);

    jogo.incluir(new Guerreiro(1, "Thor", 100, 20, 10));
    jogo.incluir(new Mago(2, "Merlin", 100, 15, 20));
    jogo.incluir(alvo1);
    jogo.incluir(alvo2);

    jogo.batalhar(1, 10); // Guerreiro: 20 + 10
    jogo.batalhar(2, 11); // Mago: 15 x 2

    igual(alvo1.vida, 70, "vida após guerreiro");
    igual(alvo2.vida, 70, "vida após mago");
});

teste("batalhar não permite atacar a si mesmo", () => {
    const jogo = new Jogo();
    const arthur = new Jogador(1, "Arthur", 100, 15);
    jogo.incluir(arthur);

    jogo.batalhar(1, 1);

    igual(arthur.vida, 100, "vida");
});

teste("batalhar ignora jogadores inexistentes", () => {
    const jogo = new Jogo();
    const arthur = new Jogador(1, "Arthur", 100, 15);
    const thor = new Guerreiro(2, "Thor", 100, 20, 10);
    jogo.incluir(arthur);
    jogo.incluir(thor);

    jogo.batalhar(999, 2);
    jogo.batalhar(1, 999);

    igual(arthur.vida, 100, "vida de Arthur");
    igual(thor.vida, 100, "vida de Thor");
});

teste("jogador morto não ataca e jogador morto não recebe ataque", () => {
    const jogo = new Jogo();
    const morto = new Jogador(1, "Morto", 0, 15);
    const vivo = new Jogador(2, "Vivo", 100, 20);
    jogo.incluir(morto);
    jogo.incluir(vivo);

    jogo.batalhar(1, 2); // atacante morto
    igual(vivo.vida, 100, "vida do vivo após ataque inválido");

    jogo.batalhar(2, 1); // alvo morto
    igual(morto.vida, 0, "vida do morto continua 0");
});

teste("contarJogadoresVivos e listarJogadoresVivos ignoram mortos", () => {
    const jogo = new Jogo();
    jogo.incluir(new Jogador(1, "Morto", 0, 10));
    jogo.incluir(new Guerreiro(2, "Thor", 100, 20, 10));
    jogo.incluir(new Mago(3, "Merlin", 100, 15, 20));

    igual(jogo.contarJogadoresVivos(), 2, "quantidade de vivos");

    const vivos = jogo.listarJogadoresVivos();
    igual(vivos.length, 2, "tamanho da lista");
    igual(vivos[0].nome, "Thor", "primeiro vivo");
    igual(vivos[1].nome, "Merlin", "segundo vivo");
});

teste("listarJogadoresVivos retorna um novo array", () => {
    const jogo = new Jogo();
    jogo.incluir(new Jogador(1, "Arthur", 100, 15));

    const lista = jogo.listarJogadoresVivos();
    lista.length = 0;

    igual(jogo.contarJogadoresVivos(), 1, "array interno preservado");
});

teste("recuperarMana só funciona para Mago", () => {
    const jogo = new Jogo();
    const thor = new Guerreiro(1, "Thor", 100, 20, 10);
    const merlin = new Mago(2, "Merlin", 100, 15, 20);
    jogo.incluir(thor);
    jogo.incluir(merlin);

    jogo.recuperarMana(2, 30);
    igual(merlin.mana, 50, "mana do mago");

    // Thor não é mago: a chamada deve ser ignorada, sem erro e sem efeitos.
    jogo.recuperarMana(1, 50);
    igual(thor.vida, 100, "vida de Thor inalterada");
    igual(merlin.mana, 50, "mana de Merlin inalterada");
});

teste("recuperarMana de ID inexistente não faz nada", () => {
    const jogo = new Jogo();
    jogo.incluir(new Mago(2, "Merlin", 100, 15, 20));

    jogo.recuperarMana(999, 50);

    igual(jogo.consultar(2)?.vida, 100, "jogo permanece consistente");
});

teste("consultarMaisForte ignora mortos e escolhe maior ataque", () => {
    const jogo = new Jogo();
    const morto = new Guerreiro(1, "Morto forte", 0, 50, 10);
    const thor = new Guerreiro(2, "Thor", 100, 20, 10);
    const merlin = new Mago(3, "Merlin", 100, 15, 20);
    jogo.incluir(morto);
    jogo.incluir(thor);
    jogo.incluir(merlin);

    igual(jogo.consultarMaisForte(), thor, "mais forte vivo");
});

teste("consultarMaisForte mantém o primeiro em caso de empate", () => {
    const jogo = new Jogo();
    const primeiro = new Jogador(1, "Primeiro", 100, 15);
    const segundo = new Jogador(2, "Segundo", 100, 15);
    jogo.incluir(primeiro);
    jogo.incluir(segundo);

    igual(jogo.consultarMaisForte(), primeiro, "primeiro empatado");
});

teste("consultarMaisForte retorna null se não houver vivos", () => {
    const jogo = new Jogo();
    jogo.incluir(new Jogador(1, "Morto", 0, 15));

    igual(jogo.consultarMaisForte(), null);
});

// ===========================================================================
// 5) Sequência oficial do enunciado (item 7)
// ===========================================================================
secao("5. Sequência oficial do enunciado");

const jogoOficial = new Jogo();
const arthur = new Jogador(1, "Arthur", 100, 15);
const thor = new Guerreiro(2, "Thor", 100, 20, 10);
const merlin = new Mago(3, "Merlin", 100, 15, 20);

teste("cadastro: inclui Arthur, Thor e Merlin", () => {
    igual(jogoOficial.incluir(arthur), true, "Arthur");
    igual(jogoOficial.incluir(thor), true, "Thor");
    igual(jogoOficial.incluir(merlin), true, "Merlin");
});

teste("Arthur ataca Thor -> Thor fica com 85 de vida", () => {
    jogoOficial.batalhar(1, 2);
    igual(thor.vida, 85, "vida de Thor");
});

teste("Thor ataca Merlin -> Merlin fica com 70 de vida", () => {
    jogoOficial.batalhar(2, 3);
    igual(merlin.vida, 70, "vida de Merlin");
});

teste("Merlin ataca Arthur -> Arthur fica com 70 e mana cai para 10", () => {
    jogoOficial.batalhar(3, 1);
    igual(arthur.vida, 70, "vida de Arthur");
    igual(merlin.mana, 10, "mana de Merlin");
});

teste("Merlin ataca Arthur novamente -> Arthur fica com 40 e mana zera", () => {
    jogoOficial.batalhar(3, 1);
    igual(arthur.vida, 40, "vida de Arthur");
    igual(merlin.mana, 0, "mana de Merlin");
});

teste("Merlin ataca pela 3ª vez sem mana -> Arthur fica com 25", () => {
    jogoOficial.batalhar(3, 1);
    igual(arthur.vida, 25, "vida de Arthur");
    igual(merlin.mana, 0, "mana de Merlin");
});

teste("Thor ataca Arthur -> Arthur fica com 0 de vida", () => {
    jogoOficial.batalhar(2, 1);
    igual(arthur.vida, 0, "vida de Arthur");
    igual(arthur.estaVivo(), false, "Arthur está morto");
});

teste("Arthur morto tenta atacar Thor -> ataque não realizado", () => {
    jogoOficial.batalhar(1, 2);
    igual(thor.vida, 85, "vida de Thor");
});

teste("contagem de vivos -> 2 jogadores", () => {
    igual(jogoOficial.contarJogadoresVivos(), 2);
});

teste("listagem de vivos -> Thor e Merlin", () => {
    const vivos = jogoOficial.listarJogadoresVivos();
    igual(vivos.length, 2, "quantidade");
    igual(vivos[0].nome, "Thor", "primeiro");
    igual(vivos[1].nome, "Merlin", "segundo");
});

teste("recuperar 30 de mana de Merlin -> mana 30", () => {
    jogoOficial.recuperarMana(3, 30);
    igual(merlin.mana, 30, "mana de Merlin");
});

teste("consultar jogador mais forte -> Thor", () => {
    igual(jogoOficial.consultarMaisForte()?.nome, "Thor", "mais forte");
});

teste("incluir outro jogador com ID 2 -> inclusão não realizada", () => {
    const clone = new Guerreiro(2, "Thor clone", 100, 20, 10);
    igual(jogoOficial.incluir(clone), false, "retorno da inclusão");
    igual(jogoOficial.consultar(2), thor, "jogador original preservado");
});

teste("recuperar 50 de mana de Thor (não é mago) -> operação não realizada", () => {
    const manaMerlinAntes = merlin.mana;

    jogoOficial.recuperarMana(2, 50);

    igual(merlin.mana, manaMerlinAntes, "mana de Merlin inalterada");
    igual(thor.vida, 85, "vida de Thor inalterada");
});

// ===========================================================================
// 6) Desafio adicional: duelar()
// ===========================================================================
secao("6. Desafio adicional: duelar()");

teste("duelo Thor x Merlin termina com Thor vencedor", () => {
    const jogo = new Jogo();
    const thorDuelo = new Guerreiro(1, "Thor", 100, 20, 10);
    const merlinDuelo = new Mago(2, "Merlin", 100, 15, 20);
    jogo.incluir(thorDuelo);
    jogo.incluir(merlinDuelo);

    const vencedor = jogo.duelar(1, 2);

    igual(vencedor, thorDuelo, "vencedor");
    igual(merlinDuelo.vida, 0, "vida do perdedor");
    igual(thorDuelo.estaVivo(), true, "vencedor vivo");
});

teste("duelo entre iguais pode ser vencido pelo jogador 1 (ataca primeiro)", () => {
    const jogo = new Jogo();
    const jogador1 = new Jogador(1, "Jogador 1", 100, 15);
    const jogador2 = new Jogador(2, "Jogador 2", 100, 15);
    jogo.incluir(jogador1);
    jogo.incluir(jogador2);

    igual(jogo.duelar(1, 2), jogador1, "vencedor");
});

teste("duelar retorna null para IDs iguais, inexistentes ou mortos", () => {
    const jogo = new Jogo();
    jogo.incluir(new Jogador(1, "Vivo", 100, 15));
    jogo.incluir(new Jogador(2, "Morto", 0, 15));

    igual(jogo.duelar(1, 1), null, "IDs iguais");
    igual(jogo.duelar(1, 999), null, "adversário inexistente");
    igual(jogo.duelar(999, 1), null, "atacante inexistente");
    igual(jogo.duelar(1, 2), null, "adversário morto");
    igual(jogo.duelar(2, 1), null, "atacante morto");
});

teste("duelar retorna null quando não há progresso na batalha", () => {
    const jogo = new Jogo();
    const pacifista1 = new Pacifista(1, "Pacifista 1", 100, 10);
    const pacifista2 = new Pacifista(2, "Pacifista 2", 100, 10);
    jogo.incluir(pacifista1);
    jogo.incluir(pacifista2);

    igual(jogo.duelar(1, 2), null, "sem dano -> null");
});

// ===========================================================================
// 7) Extensibilidade: nova subclasse sem alterar Jogo
// ===========================================================================
secao("7. Extensibilidade com Arqueiro");

teste("Jogo aceita uma nova subclasse de Jogador por polimorfismo", () => {
    const jogo = new Jogo();
    const arqueiro = new Arqueiro(1, "Legolas", 100, 10);
    const alvo = new Jogador(2, "Alvo", 100, 10);
    jogo.incluir(arqueiro);
    jogo.incluir(alvo);

    jogo.batalhar(1, 2);

    // Arqueiro: ataque comum (10) + 5 de bônus de precisão.
    igual(alvo.vida, 85, "vida do alvo");
});

// ===========================================================================
// Resumo final
// ===========================================================================
const aprovados = totalTestes - totalFalhas;

console.log(`\n${"=".repeat(60)}`);
console.log(`RESULTADO: ${aprovados}/${totalTestes} testes passaram.`);

if (totalFalhas > 0) {
    console.error(`${totalFalhas} teste(s) falharam.`);
    process.exitCode = 1;
} else {
    console.log("Todos os testes passaram.");
}
console.log("=".repeat(60));
