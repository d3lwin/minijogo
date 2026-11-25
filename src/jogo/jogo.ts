import { Jogador } from "../personagens/jogador";
import { Mago } from "../personagens/mago";

/**
 * jogo.ts
 * ---------------------------------------------------------------------------
 * CLASSE DE MECÂNICA/ASSOCIAÇÃO: gerencia o cadastro de jogadores e as
 * batalhas.
 *
 * POLIMORFISMO: o array é do tipo Jogador[], portanto aceita objetos de
 * Jogador, Guerreiro e Mago. Em batalhar() não há instanceof nem condições
 * sobre o tipo: a chamada `atacante.atacar(adversario)` executa a versão
 * sobrescrita correta de forma dinâmica.
 *
 * ENCAPSULAMENTO: _jogadores não possui get nem set; o conteúdo só é
 * manipulado pelos métodos públicos desta classe.
 */
export class Jogo {
    private _jogadores: Jogador[] = [];

    /**
     * Inclui um jogador somente se ainda não existir outro com o mesmo ID.
     * @returns true se a inclusão foi realizada; false caso o ID já exista.
     */
    public incluir(jogador: Jogador): boolean {
        if (this.consultar(jogador.id) !== null) {
            return false;
        }

        this._jogadores.push(jogador);
        return true;
    }

    /**
     * Procura um jogador pelo ID.
     * @returns o jogador encontrado ou null se não existir.
     */
    public consultar(id: number): Jogador | null {
        const jogador = this._jogadores.find((j) => j.id === id);
        return jogador ?? null;
    }

    /**
     * Exclui um jogador pelo ID.
     * @returns true se a exclusão foi realizada; false se o ID não existir.
     */
    public excluir(id: number): boolean {
        const indice = this._jogadores.findIndex((j) => j.id === id);

        if (indice === -1) {
            return false;
        }

        this._jogadores.splice(indice, 1);
        return true;
    }

    /**
     * Realiza UM ataque entre dois jogadores.
     *
     * Regras:
     *  - os dois jogadores devem existir e estar vivos;
     *  - um jogador não pode atacar a si mesmo;
     *  - chama atacar() do atacante sem verificar seu tipo (polimorfismo).
     */
    public batalhar(idAtacante: number, idAdversario: number): void {
        const atacante = this.consultar(idAtacante);
        const adversario = this.consultar(idAdversario);

        // Jogadores inexistentes: operação não realizada.
        if (atacante === null || adversario === null) {
            return;
        }

        // Um jogador não pode atacar a si mesmo.
        if (idAtacante === idAdversario || atacante === adversario) {
            return;
        }

        // Os dois precisam estar vivos.
        if (!atacante.estaVivo() || !adversario.estaVivo()) {
            return;
        }

        // POLIMORFISMO: a implementação de atacar() depende do objeto real.
        atacante.atacar(adversario);
    }

    /** Quantidade de jogadores com vida maior que zero. */
    public contarJogadoresVivos(): number {
        return this._jogadores.filter((j) => j.estaVivo()).length;
    }

    /**
     * Retorna um NOVO array apenas com os jogadores vivos.
     * Alterações no array retornado não afetam o array interno.
     */
    public listarJogadoresVivos(): Jogador[] {
        return this._jogadores.filter((j) => j.estaVivo());
    }

    /**
     * Recupera mana de um jogador, se ele for um Mago.
     *
     * Aqui instanceof é necessário porque recuperarMana() não existe na
     * superclasse Jogador. Já em batalhar() não é preciso, pois atacar()
     * existe em toda a hierarquia (polimorfismo).
     */
    public recuperarMana(id: number, valor: number): void {
        const jogador = this.consultar(id);

        if (jogador instanceof Mago) {
            jogador.recuperarMana(valor);
        }
        // Se não for Mago, nenhuma operação é realizada.
    }

    /**
     * Retorna o jogador VIVO com maior força de ataque básica.
     * Em caso de empate, mantém o primeiro encontrado.
     * Retorna null se não houver jogadores vivos.
     */
    public consultarMaisForte(): Jogador | null {
        let maisForte: Jogador | null = null;

        for (const jogador of this._jogadores) {
            if (!jogador.estaVivo()) {
                continue;
            }

            // O operador ">" (e não ">=") preserva o primeiro em caso de empate.
            if (maisForte === null || jogador.forcaAtaque > maisForte.forcaAtaque) {
                maisForte = jogador;
            }
        }

        return maisForte;
    }

    /**
     * DESAFIO ADICIONAL: duelo com ataques alternados.
     *
     * O jogador 1 ataca primeiro; depois o jogador 2; e assim por diante,
     * até que um deles seja derrotado.
     *
     * @returns o vencedor, ou null se:
     *  - algum ID não existir;
     *  - os IDs forem iguais;
     *  - algum jogador já estiver morto;
     *  - uma rodada completa não causar dano (sem progresso).
     */
    public duelar(id1: number, id2: number): Jogador | null {
        const jogador1 = this.consultar(id1);
        const jogador2 = this.consultar(id2);

        if (jogador1 === null || jogador2 === null) {
            return null;
        }

        if (id1 === id2 || jogador1 === jogador2) {
            return null;
        }

        if (!jogador1.estaVivo() || !jogador2.estaVivo()) {
            return null;
        }

        while (jogador1.estaVivo() && jogador2.estaVivo()) {
            const vida1Antes = jogador1.vida;
            const vida2Antes = jogador2.vida;

            // Turno do jogador 1.
            jogador1.atacar(jogador2);
            if (!jogador2.estaVivo()) {
                return jogador1;
            }

            // Turno do jogador 2.
            jogador2.atacar(jogador1);
            if (!jogador1.estaVivo()) {
                return jogador2;
            }

            // Segurança: se ninguém perdeu vida na rodada, não há progresso.
            if (jogador1.vida === vida1Antes && jogador2.vida === vida2Antes) {
                return null;
            }
        }

        return null;
    }
}
