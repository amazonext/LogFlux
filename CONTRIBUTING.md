# Como Contribuir para o LogFlux 

Primeiramente, obrigado pelo seu interesse em contribuir com o LogFlux! Estamos felizes em ter você aqui. Toda contribuição é bem-vinda, desde a correção de um simples erro de digitação até a implementação de uma nova funcionalidade complexa.

## Código de Conduta

Este projeto e todos que participam dele são regidos pelo nosso [Código de Conduta](/CODE_OF_CONDUCT.md). Ao participar, você concorda em seguir seus termos. Por favor, reporte comportamentos inaceitáveis.

## Como Você Pode Contribuir

Existem várias maneiras de contribuir, e todas são valiosas:

* **Reportando Bugs:** Se encontrar um problema, por favor, abra uma "Issue" descrevendo o bug com o máximo de detalhes possível.
* **Sugerindo Melhorias:** Tem uma ideia para uma nova funcionalidade ou uma melhoria em algo existente? Abra uma "Issue" para que possamos discuti-la.
* **Escrevendo Código:** Se você quer corrigir um bug ou implementar uma funcionalidade, ficaremos felizes em revisar seu Pull Request.

## Guia para Contribuição de Código

Se você deseja contribuir com código, siga os passos abaixo. Isso torna o processo mais fácil tanto para você quanto para os mantenededores do projeto.

1.  **Faça um Fork** do repositório clicando no botão "Fork" no canto superior direito.

2.  **Clone o seu fork** para a sua máquina local:
    ```sh
    git clone [https://github.com/seu-usuario/logflux.git](https://github.com/seu-usuario/logflux.git)
    ```

3.  **Crie uma nova branch** para trabalhar na sua modificação. Escolha um nome descritivo para a branch.
    ```sh
    # Exemplo para uma nova funcionalidade:
    git checkout -b feat/adicionar-modo-claro

    # Exemplo para uma correção de bug:
    git checkout -b fix/problema-no-upload
    ```

4.  **Faça as suas alterações** no código. Lembre-se de seguir as boas práticas e o estilo do projeto.

5.  **Faça o commit** das suas alterações com uma mensagem clara e descritiva, seguindo a convenção de commits:
    ```sh
    git commit -m "feat: Adiciona o botão para alternar entre modo claro e escuro"
    ```
    *Para mais detalhes sobre as mensagens de commit, consulte o `README.md`.*

6.  **Envie suas alterações** para o seu fork no GitHub:
    ```sh
    git push origin feat/adicionar-modo-claro
    ```

7.  **Abra um Pull Request (PR)** no repositório original do LogFlux. No corpo do PR, descreva claramente o que você fez, por que fez e como isso pode ser testado.

8.  **Aguarde a revisão.** Os mantenedores do projeto irão revisar seu código, fornecer feedback e, se tudo estiver certo, farão o merge das suas alterações.

Obrigado mais uma vez pela sua contribuição!