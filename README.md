# Gerador de Senhas

Gerador de senhas seguras feito com **HTML, CSS e JavaScript puro**. Tudo acontece no seu navegador: nenhuma senha é enviada pela internet.

🔗 **Usar online:** https://nidragnnar.github.io/Password-Generate/ (depois de ativar o GitHub Pages, veja abaixo)

## Recursos

- **Sorteio seguro** com `crypto.getRandomValues()`, o gerador de números aleatórios próprio para criptografia
- Escolha de **maiúsculas, minúsculas, números e símbolos**, com pelo menos um caractere de cada tipo escolhido
- Opção de **evitar caracteres parecidos** (`I`, `l`, `1`, `O`, `0`, `o`)
- Tamanho de **6 a 64** caracteres
- **Medidor de força** baseado na entropia da senha (em bits)
- Uma nova senha é gerada sempre que você muda uma opção
- Copiar com um clique, com aviso de confirmação
- Layout responsivo e acessível (labels, foco visível, `prefers-reduced-motion`)

## Como funciona

**Sorteio sem viés.** `Math.random()` não é seguro para senhas porque os números podem ser previstos. Por isso o sorteio usa `crypto.getRandomValues()` e descarta os valores que deixariam alguns caracteres mais prováveis que outros (o chamado *viés de módulo*).

**Todos os tipos garantidos.** Primeiro é sorteado um caractere de cada tipo marcado. O resto é sorteado entre todos os caracteres permitidos, e no fim a senha é embaralhada (algoritmo Fisher-Yates), para os caracteres garantidos não ficarem sempre no começo.

**Força.** A força é calculada pela entropia: `tamanho × log2(quantidade de caracteres possíveis)`.

| Entropia | Força |
| --- | --- |
| menos de 45 bits | Fraca |
| 45 a 64 bits | Média |
| 65 a 89 bits | Forte |
| 90 bits ou mais | Muito forte |

## Estrutura

```
Password-Generate/
├── index.html
├── style.css
├── script.js
└── assets/
    └── logo.png
```

## Como rodar

Não precisa instalar nada: basta abrir o `index.html` no navegador.

## Publicar no GitHub Pages

No repositório, vá em **Settings → Pages**, selecione a branch `main` e a pasta `/ (root)` e salve.
