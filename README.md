# Mini Jogo de Batalha — POO em TypeScript

Exercício de revisão de **Programação Orientada a Objetos** (IFPI — ADS) com foco em:

- encapsulamento com atributos `private` e prefixo `_`;
- herança com `extends` e `super()`;
- sobrescrita de métodos (`override` conceitual de `atacar()`);
- reutilização de código com `super.atacar()`;
- polimorfismo com um array `Jogador[]`;
- verificação de tipos com `instanceof` apenas onde é realmente necessário;
- regras de negócio controlando vida, dano e mana.

O sistema gerencia três tipos de jogador — **Jogador comum**, **Guerreiro** e **Mago** — e permite cadastrar, consultar, excluir, batalhar e duelar.

---

## Sumário

- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Hierarquia de classes](#hierarquia-de-classes)
- [Implementação por classe](#implementação-por-classe)
  - [Jogador](#1-jogador)
  - [Guerreiro](#2-guerreiro)
  - [Mago](#3-mago)
  - [Jogo](#4-jogo)
- [Sequência oficial de testes](#sequência-oficial-de-testes)
- [Desafio adicional: `duelar()`](#desafio-adicional-duelar)
- [Checklist de requisitos](#checklist-de-requisitos)
- [Questões conceituais respondidas](#questões-conceituais-respondidas)
- [Decisões de implementação](#decisões-de-implementação)

---

## Estrutura do projeto

```text
Atividade base/
├── src/
│   ├── personagens/
│   │   ├── jogador.ts       # classe base
│   │   ├── guerreiro.ts     # subclasse de Jogador
│   │   └── mago.ts          # subclasse de Jogador
│   ├── jogo/
│   │   └── jogo.ts          # mecânicas de cadastro e batalha
│   └── app.ts               # demonstração da sequência do enunciado
├── testes/
│   ├── testes.ts            # suíte automatizada (61 verificações)
│   └── arqueiro_teste.ts    # subclasses auxiliares só para os testes
├── poo_07_exercicio_base_revisao.pdf
├── package.json
├── tsconfig.json
└── README.md
```

A separação foi feita em três grupos:

1. **Personagens** (`src/personagens`): a hierarquia de classes.
2. **Mecânicas de jogo** (`src/jogo`): cadastro, batalhas e duelos.
3. **Testes** (`testes`): verificações automatizadas e classes auxiliares.

---

## Como executar

Pré-requisito: **Node.js 18+** e **npm**.

```bash
# instalar dependências de desenvolvimento (TypeScript e tipos do Node)
npm install

# compilar o projeto
npm run build

# executar a demonstração do enunciado
npm start

# executar a suíte completa de testes
npm test

# limpar a pasta dist
npm run clean
```

Saída esperada do `npm test`:

```text
============================================================
RESULTADO: 61/61 testes passaram.
Todos os testes passaram.
============================================================
```

---

## Hierarquia de classes

```text
                 ┌──────────────────────┐
                 │       Jogador        │
                 ├──────────────────────┤
                 │ - _id: number        │
                 │ - _nome: string      │
                 │ - _vida: number      │
                 │ - _forcaAtaque:number│
                 ├──────────────────────┤
                 │ + atacar()           │
                 │ + receberDano()      │
                 │ + estaVivo()         │
                 │ + recuperarVida()    │
                 └──────────┬───────────┘
                            │ extends
             ┌──────────────┴──────────────┐
             │                             │
   ┌─────────▼─────────┐         ┌─────────▼─────────┐
   │     Guerreiro     │         │       Mago        │
   ├───────────────────┤         ├───────────────────┤
   │ - _bonusAtaque    │         │ - _mana           │
   ├───────────────────┤         ├───────────────────┤
   │ + atacar()        │         │ + atacar()        │
   │ + get/set bonus   │         │ + recuperarMana() │
   └───────────────────┘         └───────────────────┘
```

`Jogo` se **associa** a vários jogadores por meio de `private _jogadores: Jogador[]`.

---

## Implementação por classe

### 1. Jogador

Arquivo: `src/personagens/jogador.ts`

**Atributos privados**

| Atributo | Tipo | Descrição |
|---|---|---|
| `_id` | `number` | identificador único, imutável após a criação |
| `_nome` | `string` | nome do jogador |
| `_vida` | `number` | pontos de vida (0 a 100) |
| `_forcaAtaque` | `number` | dano do ataque comum |

**Construtor**

- recebe os quatro valores;
- valida vida entre **0 e 100**;
- valida força de ataque **maior que zero**;
- valida nome não vazio;
- lança `Error` quando algum valor é inválido.

**Get/set**

| Propriedade | get | set | Justificativa |
|---|---|---|---|
| `id` | ✅ | ❌ | não pode ser alterado depois da criação |
| `nome` | ✅ | ✅ | dado cadastral simples |
| `vida` | ✅ | ❌ | só muda por `receberDano()` e `recuperarVida()` |
| `forcaAtaque` | ✅ | ❌ | definida na criação; não deve ser alterada livremente |

**Métodos**

- `atacar(adversario)`: chama `adversario.receberDano(this._forcaAtaque)`.
- `receberDano(valor)`: ignora `valor <= 0` e nunca deixa a vida abaixo de zero.
- `estaVivo()`: retorna `vida > 0`.
- `recuperarVida(valor)`: ignora `valor <= 0` e limita a vida a **100**.
- `toString()`: representação textual usada na demonstração.

> A validação com `Number.isFinite` também impede que `NaN` ou `Infinity` quebrem as regras de negócio.

### 2. Guerreiro

Arquivo: `src/personagens/guerreiro.ts`

- usa `extends Jogador`;
- **não redeclara** `_id`, `_nome`, `_vida` nem `_forcaAtaque`;
- adiciona apenas `private _bonusAtaque: number`;
- chama `super(id, nome, vida, forcaAtaque)` no construtor;
- valida bônus `>= 0`;
- implementa `get bonusAtaque` e `set bonusAtaque` (o setter rejeita negativos);
- sobrescreve `atacar()`:

```ts
public atacar(adversario: Jogador): void {
    super.atacar(adversario);                 // ataque comum
    adversario.receberDano(this._bonusAtaque); // dano adicional
}
```

Com força 20 e bônus 10, o dano total é **30**.

### 3. Mago

Arquivo: `src/personagens/mago.ts`

- usa `extends Jogador`;
- adiciona apenas `private _mana: number`;
- chama `super(id, nome, vida, forcaAtaque)` no construtor;
- valida mana entre **0 e 100**;
- possui `get mana`, mas **não possui setter**;
- a mana só muda por `atacar()` e `recuperarMana()`;
- sobrescreve `atacar()`:
  - com **10 ou mais** de mana: consome 10 e causa **o dobro** do dano comum;
  - com menos de 10: realiza apenas o ataque comum;
  - em ambos os casos reutiliza `super.atacar()`.

```ts
public atacar(adversario: Jogador): void {
    if (this._mana >= Mago.CUSTO_ATAQUE_MAGICO) {
        this._mana -= Mago.CUSTO_ATAQUE_MAGICO;

        super.atacar(adversario);              // 1ª metade do dano
        adversario.receberDano(this.forcaAtaque); // 2ª metade
        return;
    }

    super.atacar(adversario); // ataque comum
}
```

- `recuperarMana(valor)`: ignora `valor <= 0` e limita a mana a **100**.

### 4. Jogo

Arquivo: `src/jogo/jogo.ts`

**Atributo único**

```ts
private _jogadores: Jogador[] = [];
```

Não existe `get` nem `set` para esse array. O conteúdo é manipulado exclusivamente pelos métodos da classe.

**Métodos**

| Método | Comportamento |
|---|---|
| `incluir(jogador)` | inclui se o ID ainda não existir; retorna `boolean` |
| `consultar(id)` | retorna o jogador ou `null` |
| `excluir(id)` | remove pelo ID; retorna `boolean` |
| `batalhar(idAtacante, idAdversario)` | valida e executa **um** ataque |
| `contarJogadoresVivos()` | quantidade de jogadores com vida > 0 |
| `listarJogadoresVivos()` | **novo** array apenas com os vivos |
| `recuperarMana(id, valor)` | recupera mana somente se o jogador for `Mago` |
| `consultarMaisForte()` | jogador vivo com maior força básica; primeiro em caso de empate |
| `duelar(id1, id2)` | desafio adicional: ataques alternados até a morte |

**Regras de `batalhar()`**

- os dois jogadores devem existir;
- os dois devem estar vivos;
- um jogador não pode atacar a si mesmo;
- o ataque é feito com `atacante.atacar(adversario)`;
- **não** há `instanceof` nem `switch` sobre o tipo: o polimorfismo decide qual versão de `atacar()` será executada.

**`instanceof` em `recuperarMana()`**

```ts
const jogador = this.consultar(id);

if (jogador instanceof Mago) {
    jogador.recuperarMana(valor);
}
```

Aqui o `instanceof` é necessário porque `recuperarMana()` **não existe** em `Jogador` — apenas em `Mago`.

---

## Sequência oficial de testes

A demonstração (`npm start`) e a suíte (`npm test`) reproduzem a sequência do PDF:

| # | Operação | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | Arthur ataca Thor | Thor com 85 de vida | ✅ |
| 2 | Thor ataca Merlin | Merlin com 70 de vida | ✅ |
| 3 | Merlin ataca Arthur | Arthur com 70 de vida (mana 10) | ✅ |
| 4 | Merlin ataca Arthur novamente | Arthur com 40 de vida (mana 0) | ✅ |
| 5 | Merlin ataca Arthur pela 3ª vez | Arthur com 25 de vida (sem mana) | ✅ |
| 6 | Thor ataca Arthur | Arthur com 0 de vida | ✅ |
| 7 | Arthur tenta atacar Thor | ataque não realizado | ✅ |
| 8 | Contar jogadores vivos | 2 | ✅ |
| 9 | Listar jogadores vivos | Thor e Merlin | ✅ |
| 10 | Recuperar 30 de mana de Merlin | Merlin com 30 de mana | ✅ |
| 11 | Consultar jogador mais forte | Thor | ✅ |
| 12 | Incluir outro jogador com ID 2 | inclusão não realizada | ✅ |
| 13 | Recuperar 50 de mana de Thor | operação não realizada (não é mago) | ✅ |

Além da sequência oficial, a suíte cobre:

- limites de vida (0 e 100), dano excedente e cura limitada;
- validação de construtores e setters;
- bônus do Guerreiro e mana do Mago;
- ataques com mana 0, 9, 10 e 20;
- `incluir`, `consultar`, `excluir` e reinclusão de ID;
- batalhas inválidas (ID inexistente, jogador morto, ataque contra si);
- cópia defensiva em `listarJogadoresVivos()`;
- empate em `consultarMaisForte()`;
- duelo com vencedor, empate, IDs inválidos e ausência de progresso;
- inclusão de uma nova subclasse (`Arqueiro`) **sem alterar `Jogo`**, comprovando a extensibilidade por polimorfismo.

---

## Desafio adicional: `duelar()`

```ts
public duelar(id1: number, id2: number): Jogador | null
```

- o jogador 1 ataca primeiro;
- depois o jogador 2;
- os turnos se alternam até alguém ser derrotado;
- retorna o **vencedor** ou `null` quando:
  - algum ID não existe;
  - os dois IDs são iguais;
  - algum jogador já está morto;
  - uma rodada completa não causa dano (sem progresso).

O duelo usa `atacar()` diretamente, portanto também se beneficia do polimorfismo: Guerreiro soma bônus, Mago pode gastar mana, e qualquer subclasse futura funciona sem mudanças.

---

## Checklist de requisitos

| Requisito do PDF | Onde foi atendido |
|---|---|
| Todos os atributos `private` | todas as classes |
| Prefixo `_` nos atributos | `_id`, `_nome`, `_vida`, `_forcaAtaque`, `_bonusAtaque`, `_mana`, `_jogadores`, `_bonusPrecisao` |
| `get`/`set` sem underscore | `id`, `nome`, `vida`, `forcaAtaque`, `bonusAtaque`, `mana` |
| Sem setters indiscriminados | sem setter para `id`, `vida`, `forcaAtaque`, `mana` e `_jogadores` |
| `extends` para herança | `Guerreiro extends Jogador`, `Mago extends Jogador` |
| `super()` nos construtores | `Guerreiro` e `Mago` |
| `super.metodo()` para reutilizar | `super.atacar()` em `Guerreiro` e `Mago` |
| Sem duplicar atributos/métodos herdados | subclasses só acrescentam o que é próprio |
| Vida entre 0 e 100 | construtor, `receberDano()` e `recuperarVida()` |
| Força de ataque positiva | construtor de `Jogador` |
| Bônus `>= 0` | construtor e setter de `Guerreiro` |
| Mana entre 0 e 100 | construtor e `recuperarMana()` |
| `atacar()` polimórfico | `Jogo.batalhar()` e `Jogo.duelar()` |
| `instanceof` apenas em `recuperarMana()` | `Jogo.recuperarMana()` |
| Array `Jogador[]` | `Jogo._jogadores` |
| Sem get/set para `_jogadores` | `Jogo` |
| Testes da aplicação | `testes/testes.ts` |
| Desafio adicional | `Jogo.duelar()` |

---

## Questões conceituais respondidas

### 1. Por que não foi necessário declarar novamente os atributos `_id`, `_nome`, `_vida` e `_forcaAtaque` nas classes `Guerreiro` e `Mago`?

Porque a herança faz com que as subclasses **recebam** os atributos e métodos da superclasse. Redeclará-los duplicaria o estado, poderia criar duas versões do mesmo dado e quebraria a ideia de reaproveitamento. Além disso, como são `private`, a subclasse não teria acesso direto ao atributo da superclasse.

### 2. A classe `Guerreiro` pode acessar diretamente o atributo `_forcaAtaque` da superclasse? Justifique.

Não. Em TypeScript, `private` restringe o acesso à própria classe que declarou o membro — nem subclasses podem acessá-lo diretamente. O `Guerreiro` deve usar a propriedade pública `forcaAtaque` (getter) ou métodos herdados. No código, a subclasse usa `this.forcaAtaque` quando precisa do valor.

> Observação: `protected` permitiria acesso direto na subclasse, mas o enunciado exige `private`.

### 3. Qual a diferença entre acessar `this._forcaAtaque` e `this.forcaAtaque`?

- `this._forcaAtaque` acessa o **atributo diretamente**. Só é permitido dentro da própria classe `Jogador`.
- `this.forcaAtaque` chama o **getter** `get forcaAtaque()`, que é a forma pública e encapsulada de leitura. O getter poderia aplicar validações, cálculos ou formatação sem expor o estado interno.

### 4. Por que não foi implementado um método `set` para a propriedade `vida`?

Porque a vida é controlada por regras de negócio. Um setter livre permitiria definir valores negativos, acima de 100 ou ignorar o estado de morte. Somente `receberDano()` e `recuperarVida()` devem alterá-la, garantindo os limites **0..100**.

### 5. Qual a finalidade da palavra reservada `super()` nos construtores das subclasses?

`super()` chama o **construtor da superclasse**. Ele inicializa os atributos herdados (`_id`, `_nome`, `_vida`, `_forcaAtaque`) antes que a subclasse inicialize seus próprios atributos (`_bonusAtaque` ou `_mana`). Em TypeScript, é obrigatório chamar `super()` antes de usar `this` no construtor da subclasse.

### 6. Qual a diferença entre utilizar `super()` e `super.atacar()`?

- `super(...)`: invoca o **construtor** da superclasse.
- `super.atacar(...)`: invoca o **método** `atacar()` da superclasse, permitindo reaproveitar a implementação existente dentro de um método sobrescrito.

### 7. Por que foi possível armazenar objetos das três classes em um único array do tipo `Jogador[]`?

Porque `Guerreiro` e `Mago` são **subtipos** de `Jogador` (herdam dele). Em POO, um objeto de uma subclasse pode ser tratado como objeto da superclasse. Assim, o array guarda referências para os três tipos e o método `atacar()` é resolvido dinamicamente conforme o objeto real — isso é **polimorfismo**.

### 8. Onde ocorre a sobrescrita de métodos no exercício?

Em `Guerreiro.atacar()` e `Mago.atacar()`, que substituem a implementação de `Jogador.atacar()`. O método `atacar()` é declarado na superclasse e redefinido nas subclasses com o mesmo nome e assinatura.

### 9. Por que foi necessário utilizar `instanceof` no método `recuperarMana()`, mas não no método `batalhar()`?

- Em `recuperarMana()`, o método `recuperarMana()` existe **apenas em `Mago`**, não em `Jogador`. Se o objeto for apenas um `Jogador` ou um `Guerreiro`, a chamada nem existe; por isso é preciso verificar o tipo antes.
- Em `batalhar()`, `atacar()` existe na superclasse e é sobrescrito pelas subclasses. Basta chamar `atacante.atacar(adversario)` e o **polimorfismo** escolhe a implementação correta, sem `instanceof`.

### 10. O que precisaria ser alterado na classe `Jogo` caso fosse criada uma nova subclasse `Arqueiro`, que também sobrescrevesse `atacar()`?

**Nada** em `Jogo`, desde que `Arqueiro extends Jogador` e implemente `atacar()` com a mesma assinatura. O `Arqueiro` pode ser incluído no array `Jogador[]` e `batalhar()` continuará chamando `atacante.atacar()` de forma polimórfica.

Isso é demonstrado em `testes/arqueiro_teste.ts`: a subclasse `Arqueiro` é integrada ao jogo sem modificar `Jogo`.

---

## Decisões de implementação

1. **Validação com exceções**  
   O enunciado não define o comportamento para dados inválidos. Optou-se por lançar `Error` com mensagem descritiva, impedindo que objetos inválidos sejam criados. Os setters que recebem valores inválidos também lançam exceção e preservam o valor anterior.

2. **`Number.isFinite`**  
   Além das comparações numéricas, o código rejeita `NaN` e `Infinity`, evitando estados impossíveis.

3. **Setters apenas onde há justificativa**  
   `nome` (cadastro), `bonusAtaque` (configuração do guerreiro). Não há setters para `id`, `vida`, `forcaAtaque`, `mana` ou `_jogadores`.

4. **Constantes privadas**  
   `VIDA_MAXIMA`, `CUSTO_ATAQUE_MAGICO` e `MANA_MAXIMA` evitam números mágicos e centralizam as regras.

5. **`listarJogadoresVivos()` retorna cópia**  
   O `filter()` já cria um novo array. Assim, alterações na lista retornada não afetam o cadastro interno do jogo.

6. **`consultarMaisForte()` usa `>`**  
   A comparação estrita mantém o primeiro jogador em caso de empate, conforme pedido.

7. **`duelar()` com proteção contra loop infinito**  
   Se uma rodada completa não alterar a vida de nenhum dos dois, o método retorna `null`.

8. **Sem `instanceof` em `batalhar()` e `duelar()`**  
   Esses métodos dependem apenas de `atacar()`, que é polimórfico. O único `instanceof` do sistema está em `Jogo.recuperarMana()`, conforme a especificação.

9. **Separação em pastas**  
   A organização em `personagens`, `jogo` e `testes` deixa explícita a divisão entre modelo, mecânica e verificação, além de facilitar a manutenção.

---

## Tecnologias

- **TypeScript 7** (`strict: true`)
- **Node.js** (execução do JavaScript compilado)
- Sem frameworks de teste externos: a suíte usa um verificador próprio com código de saída adequado para CI.

---

Projeto desenvolvido para a disciplina de **Programação Orientada a Objetos — ADS/IFPI**.
