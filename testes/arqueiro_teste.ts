import { Jogador } from "../src/personagens/jogador";

/**
 * arqueiro_teste.ts
 * ---------------------------------------------------------------------------
 * Classes auxiliares usadas APENAS na suíte de testes.
 *
 * Elas demonstram dois pontos do enunciado:
 *  - Arqueiro: uma nova subclasse que sobrescreve atacar() sem exigir
 *    nenhuma alteração na classe Jogo (polimorfismo/extensibilidade).
 *  - Pacifista: subclasse que nunca causa dano, usada para testar a
 *    proteção contra duelo sem progresso.
 */

/** Subclasse extra: ataque comum + bônus de precisão. */
export class Arqueiro extends Jogador {
    private _bonusPrecisao: number;

    constructor(
        id: number,
        nome: string,
        vida: number,
        forcaAtaque: number,
        bonusPrecisao: number = 5
    ) {
        super(id, nome, vida, forcaAtaque);

        if (!Number.isFinite(bonusPrecisao) || bonusPrecisao < 0) {
            throw new Error(
                `Bônus de precisão inválido (${bonusPrecisao}). Deve ser maior ou igual a zero.`
            );
        }

        this._bonusPrecisao = bonusPrecisao;
    }

    public get bonusPrecisao(): number {
        return this._bonusPrecisao;
    }

    public atacar(adversario: Jogador): void {
        super.atacar(adversario);
        adversario.receberDano(this._bonusPrecisao);
    }
}

/** Subclasse extra que ignora o ataque; serve para testar o duelo sem progresso. */
export class Pacifista extends Jogador {
    public atacar(_adversario: Jogador): void {
        // Intencionalmente não causa dano.
    }
}
