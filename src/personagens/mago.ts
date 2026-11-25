import { Jogador } from "./jogador";

/**
 * mago.ts
 * ---------------------------------------------------------------------------
 * HERANÇA: Mago é um Jogador especializado.
 *
 * - Herda _id, _nome, _vida e _forcaAtaque.
 * - Acrescenta apenas o atributo próprio _mana.
 * - SOBRESCREVE atacar(): gasta 10 de mana para causar dano dobrado.
 * - Não possui setter de mana: ela só muda pelos comportamentos da classe
 *   (atacar e recuperarMana), conforme a regra de negócio.
 */
export class Mago extends Jogador {
    /** Custo de um ataque mágico. */
    private static readonly CUSTO_ATAQUE_MAGICO: number = 10;
    /** Limite máximo de mana. */
    private static readonly MANA_MAXIMA: number = 100;

    private _mana: number;

    /**
     * @param mana mana inicial, entre 0 e 100
     */
    constructor(
        id: number,
        nome: string,
        vida: number,
        forcaAtaque: number,
        mana: number
    ) {
        // Inicializa primeiro os atributos herdados.
        super(id, nome, vida, forcaAtaque);

        if (!Number.isFinite(mana) || mana < 0 || mana > Mago.MANA_MAXIMA) {
            throw new Error(`Mana inicial inválida (${mana}). Deve estar entre 0 e 100.`);
        }

        this._mana = mana;
    }

    /** Mana atual. Somente leitura: não há setter. */
    public get mana(): number {
        return this._mana;
    }

    /**
     * SOBRESCRITA:
     * - Com pelo menos 10 de mana: consome 10 e causa o DOBRO do dano comum.
     * - Sem mana suficiente: realiza apenas o ataque comum.
     *
     * Em ambos os casos o ataque comum da superclasse é reaproveitado com
     * super.atacar(). No ataque mágico, o dano equivalente à força de ataque
     * é aplicado uma segunda vez, resultando em 2 x forcaAtaque.
     */
    public atacar(adversario: Jogador): void {
        if (this._mana >= Mago.CUSTO_ATAQUE_MAGICO) {
            this._mana -= Mago.CUSTO_ATAQUE_MAGICO;

            super.atacar(adversario); // primeira metade do dano dobrado
            adversario.receberDano(this.forcaAtaque); // segunda metade
            return;
        }

        super.atacar(adversario); // ataque comum, sem gastar mana
    }

    /**
     * Recupera mana respeitando o limite de 100.
     * Ignora valores menores ou iguais a zero.
     */
    public recuperarMana(valor: number): void {
        if (!Number.isFinite(valor) || valor <= 0) {
            return;
        }

        this._mana = Math.min(Mago.MANA_MAXIMA, this._mana + valor);
    }
}
