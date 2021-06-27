import { Scale } from "phaser";


export class ScoreTable {
    private currentScene: Phaser.Scene;


    constructor(rankingScene: Phaser.Scene) {
        this.CreateTable(rankingScene);
    }

    private CreateTable(rankingScene: Phaser.Scene): void {

        // Html string
        const htmlTable =
            `
        <table class="styled-table">
            <thead>
                <tr>
                    <th>Jogador</th>
                    <th>Pontos</th>
                    <th>Escola</th>
                    <th>Turma</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Bruno Alexandre Dias Novais de Sousa</td>
                    <td>6000</td>
                    <td>Eb23 Costa Cabral</td>
                    <td>4c - a4 - 20 turma fixe</td>
                    <td>02 - 07 - 1998</td>
                </tr>
                <tr>
                    <td>Bruno Alexandre Dias Novais de Sousa</td>
                    <td>6000</td>
                    <td>Eb23 Costa Cabral</td>
                    <td>4c - a4 - 20 turma fixe</td>
                    <td>02 - 07 - 1998</td>
                </tr>
                <tr>
                    <td>Bruno Alexandre Dias Novais de Sousa</td>
                    <td>6000</td>
                    <td>Eb23 Costa Cabral</td>
                    <td>4c - a4 - 20 turma fixe</td>
                    <td>02 - 07 - 1998</td>
                </tr>
            </tr>
                <!-- and so on... -->
            </tbody>
        </table>
        `;

        // Add the element to the game
        const tableGameObj = rankingScene.add
            .dom(0, 0).createFromHTML(htmlTable, 'div');

        tableGameObj.setPosition(
            rankingScene.scale.width / 2,
            rankingScene.scale.height / 2,
        );

        tableGameObj.setScale(2, 2);

    }
}