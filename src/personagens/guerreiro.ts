import { Jogador } from "./jogador";

/**
 * guerreiro.ts
 * ---------------------------------------------------------------------------
 * HERANÇA: Guerreiro é um Jogador especializado.
 *
 * - Não redeclara _id, _nome, _vida nem _forcaAtaque: eles são herdados.
 * - Acrescenta apenas o atributo próprio _bonusAtaque.
 * - SOBRESCREVE atacar() para somar o bônus ao ataque comum, reaproveitando
 *   a implementação da superclasse por meio de super.atacar().
 */
export class Guerreiro extends Jogador {
    private _bonusAtaque: number;

    /**
     * @param bonusAtaque dano adicional do guerreiro; deve ser >= 0
     */
    constructor(
        id: number,
        nome: string,
        vida: number,
        forcaAtaque: number,
        bonusAtaque: number
    ) {
        // super() inicializa os atributos herdados antes dos atributos próprios.
        super(id, nome, vida, forcaAtaque);

        if (!Number.isFinite(bonusAtaque) || bonusAtaque < 0) {
            throw new Error(
                `Bônus de ataque inválido (${bonusAtaque}). Deve ser maior ou igual a zero.`
            );
        }

        this._bonusAtaque = bonusAtaque;
    }

    /** Dano adicional aplicado depois do ataque comum. */
    public get bonusAtaque(): number {
        return this._bonusAtaque;
    }

    /**
     * O bônus é uma configuração do guerreiro, então possui setter.
     * O setter rejeita valores negativos (lança exceção).
     */
    public set bonusAtaque(bonusAtaque: number) {
        if (!Number.isFinite(bonusAtaque) || bonusAtaque < 0) {
            throw new Error(
                `Bônus de ataque inválido (${bonusAtaque}). Deve ser maior ou igual a zero.`
            );
        }

        this._bonusAtaque = bonusAtaque;
    }

    /**
     * SOBRESCRITA + REUTILIZAÇÃO:
     * 1. super.atacar() aplica o dano da força de ataque normal;
     * 2. em seguida, o dano adicional do bônus é aplicado ao adversário.
     *
     * Dano total = forçaAtaque + bonusAtaque.
     */
    public atacar(adversario: Jogador): void {
        super.atacar(adversario);

        if (this._bonusAtaque > 0) {
            adversario.receberDano(this._bonusAtaque);
        }
    }
}
