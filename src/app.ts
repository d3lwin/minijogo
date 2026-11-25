import { Jogador } from "./personagens/jogador";
import { Guerreiro } from "./personagens/guerreiro";
import { Mago } from "./personagens/mago";
import { Jogo } from "./jogo/jogo";

/**
 * app.ts
 * ---------------------------------------------------------------------------
 * DEMONSTRAÇÃO da aplicação (item 7 da atividade).
 *
 * Este arquivo apenas executa a sequência pedida no PDF e imprime os
 * resultados. As verificações automáticas ficam em `testes/testes.ts`.
 */

/** Formata o estado relevante de qualquer jogador. */
function estado(jogador: Jogador): string {
    let texto = `vida ${jogador.vida}`;

    if (jogador instanceof Mago) {
        texto += `, mana ${jogador.mana}`;
    }

    return texto;
}

function titulo(texto: string): void {
    console.log(`\n=== ${texto} ===`);
}

// ===========================================================================
// Cadastro dos jogadores
// ===========================================================================
const jogo = new Jogo();

const arthur = new Jogador(1, "Arthur", 100, 15);
const thor = new Guerreiro(2, "Thor", 100, 20, 10);
const merlin = new Mago(3, "Merlin", 100, 15, 20);

titulo("Cadastro");
console.log(`Incluir Arthur: ${jogo.incluir(arthur)}`);
console.log(`Incluir Thor: ${jogo.incluir(thor)}`);
console.log(`Incluir Merlin: ${jogo.incluir(merlin)}`);
console.log(
    `Incluir outro jogador com ID 2: ${jogo.incluir(
        new Guerreiro(2, "Thor clone", 100, 20, 10)
    )} (esperado: false)`
);

// ===========================================================================
// Sequência de batalhas do enunciado
// ===========================================================================
titulo("Batalhas");

jogo.batalhar(1, 2);
console.log(`Arthur ataca Thor -> Thor: ${estado(thor)} (esperado: vida 85)`);

jogo.batalhar(2, 3);
console.log(`Thor ataca Merlin -> Merlin: ${estado(merlin)} (esperado: vida 70)`);

jogo.batalhar(3, 1);
console.log(
    `Merlin ataca Arthur (1ª vez) -> Arthur: ${estado(arthur)}, Merlin: ${estado(
        merlin
    )} (esperado: vida 70, mana 10)`
);

jogo.batalhar(3, 1);
console.log(
    `Merlin ataca Arthur (2ª vez) -> Arthur: ${estado(arthur)}, Merlin: ${estado(
        merlin
    )} (esperado: vida 40, mana 0)`
);

jogo.batalhar(3, 1);
console.log(
    `Merlin ataca Arthur (3ª vez, sem mana) -> Arthur: ${estado(
        arthur
    )}, Merlin: ${estado(merlin)} (esperado: vida 25, mana 0)`
);

jogo.batalhar(2, 1);
console.log(`Thor ataca Arthur -> Arthur: ${estado(arthur)} (esperado: vida 0)`);

jogo.batalhar(1, 2);
console.log(
    `Arthur (morto) tenta atacar Thor -> Thor: ${estado(
        thor
    )} (esperado: ataque não realizado)`
);

// ===========================================================================
// Consultas e operações
// ===========================================================================
titulo("Consultas");

console.log(`Jogadores vivos: ${jogo.contarJogadoresVivos()} (esperado: 2)`);
console.log(
    `Lista de vivos: ${jogo
        .listarJogadoresVivos()
        .map((j) => j.nome)
        .join(", ")} (esperado: Thor, Merlin)`
);

jogo.recuperarMana(3, 30);
console.log(`Recuperar 30 de mana de Merlin -> Merlin: ${estado(merlin)} (esperado: mana 30)`);

const maisForte = jogo.consultarMaisForte();
console.log(`Jogador mais forte: ${maisForte?.nome ?? "null"} (esperado: Thor)`);

jogo.recuperarMana(2, 50);
console.log(
    `Recuperar 50 de mana de Thor -> operação ignorada, pois Thor não é mago ` +
        `(Merlin continua com mana ${merlin.mana})`
);

// ===========================================================================
// Desafio adicional
// ===========================================================================
titulo("Desafio adicional: duelar()");

const jogoDuelo = new Jogo();
const thorDuelo = new Guerreiro(1, "Thor", 100, 20, 10);
const merlinDuelo = new Mago(2, "Merlin", 100, 15, 20);

jogoDuelo.incluir(thorDuelo);
jogoDuelo.incluir(merlinDuelo);

const vencedor = jogoDuelo.duelar(1, 2);
console.log(
    `Duelo Thor x Merlin -> vencedor: ${vencedor?.nome ?? "null"} ` +
        `(Thor: ${estado(thorDuelo)}, Merlin: ${estado(merlinDuelo)})`
);

// ===========================================================================
// Estado final
// ===========================================================================
titulo("Estado final do cadastro original");

for (const jogador of jogo.listarJogadoresVivos()) {
    console.log(`  ${jogador.toString()}`);
}

console.log(
    "\nDica: execute `npm test` para rodar a suíte completa de verificações automáticas.\n"
);
