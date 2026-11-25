/**
 * jogador.ts
 * ---------------------------------------------------------------------------
 * Classe BASE da hierarquia do jogo de batalha.
 *
 * Responsabilidades:
 *  - guardar os dados comuns a todos os tipos de jogador;
 *  - controlar a vida por meio de regras de negócio (receberDano/recuperarVida);
 *  - oferecer o ataque comum que será reaproveitado pelas subclasses.
 *
 * Encapsulamento:
 *  - todos os atributos são `private` e prefixados com "_";
 *  - o acesso externo ocorre pelas propriedades (get/set sem "_");
 *  - `_id`, `_vida` e `_forcaAtaque` NÃO possuem setter: são alterados apenas
 *    pelo construtor ou por métodos que implementam regras de negócio.
 */
export class Jogador {
    /** Limite máximo de vida, usado pelo construtor e por recuperarVida(). */
    private static readonly VIDA_MAXIMA: number = 100;

    private _id: number;
    private _nome: string;
    private _vida: number;
    private _forcaAtaque: number;

    /**
     * Cria um jogador comum.
     * @param id identificador único (não pode ser alterado depois)
     * @param nome nome do jogador
     * @param vida vida inicial, entre 0 e 100
     * @param forcaAtaque dano do ataque comum, maior que zero
     */
    constructor(id: number, nome: string, vida: number, forcaAtaque: number) {
        if (!Number.isFinite(vida) || vida < 0 || vida > Jogador.VIDA_MAXIMA) {
            throw new Error(`Vida inicial inválida (${vida}). Deve estar entre 0 e 100.`);
        }

        if (!Number.isFinite(forcaAtaque) || forcaAtaque <= 0) {
            throw new Error(
                `Força de ataque inválida (${forcaAtaque}). Deve ser maior que zero.`
            );
        }

        if (nome.trim().length === 0) {
            throw new Error("O nome do jogador não pode ser vazio.");
        }

        this._id = id;
        this._nome = nome.trim();
        this._vida = vida;
        this._forcaAtaque = forcaAtaque;
    }

    // -----------------------------------------------------------------------
    // Métodos de acesso (get/set)
    // -----------------------------------------------------------------------

    /** Identificador único. Somente leitura após a criação. */
    public get id(): number {
        return this._id;
    }

    public get nome(): string {
        return this._nome;
    }

    /** O nome é um dado cadastral simples, por isso possui setter. */
    public set nome(nome: string) {
        if (nome.trim().length === 0) {
            throw new Error("O nome do jogador não pode ser vazio.");
        }

        this._nome = nome.trim();
    }

    /** Vida atual. Sem setter: só muda por receberDano()/recuperarVida(). */
    public get vida(): number {
        return this._vida;
    }

    /** Força do ataque comum. Sem setter: definida na criação do jogador. */
    public get forcaAtaque(): number {
        return this._forcaAtaque;
    }

    // -----------------------------------------------------------------------
    // Regras de negócio
    // -----------------------------------------------------------------------

    /**
     * Ataque comum: causa dano igual à força de ataque.
     *
     * As subclasses Guerreiro e Mago sobrescrevem este método e chamam
     * `super.atacar(adversario)` para reaproveitar esta implementação.
     */
    public atacar(adversario: Jogador): void {
        adversario.receberDano(this._forcaAtaque);
    }

    /**
     * Reduz a vida do jogador.
     * - Ignora valores menores ou iguais a zero.
     * - A vida nunca fica negativa (mínimo 0).
     */
    public receberDano(valor: number): void {
        if (!Number.isFinite(valor) || valor <= 0) {
            return;
        }

        this._vida = Math.max(0, this._vida - valor);
    }

    /** Retorna true se a vida for maior que zero. */
    public estaVivo(): boolean {
        return this._vida > 0;
    }

    /**
     * Aumenta a vida respeitando o limite máximo de 100.
     * Ignora valores menores ou iguais a zero.
     */
    public recuperarVida(valor: number): void {
        if (!Number.isFinite(valor) || valor <= 0) {
            return;
        }

        this._vida = Math.min(Jogador.VIDA_MAXIMA, this._vida + valor);
    }

    /**
     * Representação textual usada na demonstração.
     * `this.constructor.name` devolve o nome real da subclasse (Guerreiro,
     * Mago etc.) sem precisar de instanceof.
     */
    public toString(): string {
        return (
            `#${this._id} ${this._nome} (${this.constructor.name}) - ` +
            `vida: ${this._vida}, ataque: ${this._forcaAtaque}`
        );
    }
}
