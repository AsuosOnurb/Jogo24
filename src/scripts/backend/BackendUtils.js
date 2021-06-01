export function ParseScoreData(dataString) {

    let data = [];
    let j = 0;
    dataString = dataString.split('&');
    for (let i = 0; i < dataString.length; i++) {
        dataString[i] = dataString[i].split('=')[1];
        if (i % 5 == 0) {
            j++;
            dataString[i] = dataString[i].split(" ");

            if (dataString[i].length == 1) {

                dataString[i] = dataString[i][0];
            }
            else {
                dataString[i] = dataString[i][0] + " " + dataString[i][dataString[i].length - 1];
            }
            data.push(j);
        }
        if (i % 5 == 2) {
            dataString[i] = dataString[i].replace("Agrupamento de Escolas", "A.E.");
        }
        data.push(dataString[i]);
    }

    return data;
}

export function ParsedUpdatedScoreData(dataString) {
    let data = [];
    let j = 0;
    dataString = dataString.split('&');
    for (let i = 0; i < dataString.length; i++) {
        dataString[i] = dataString[i].split('=')[1];
        if (i % 5 == 0) {
            j++;
            dataString[i] = dataString[i].split(" ");
            if (dataString[i].length == 1) {

                dataString[i] = dataString[i][0];
            }
            else {
                dataString[i] = dataString[i][0] + " " + dataString[i][dataString[i].length - 1];
            }
            data.push({
                name: j
            });
        }
        if (i % 5 == 2) {
            dataString[i] = dataString[i].replace("Agrupamento de Escolas", "A.E.");
        }
        data.push({
            name: dataString[i]
        });

    }

    return data;
}

export function ParseLoginData(dataString) {
    if (dataString != "false") {

        return {
            'user': dataString.split(",")[0],                        // username
            'firstName': dataString.split(",")[1],                       // primeiro nome do aluno
            'escola': dataString.split(",")[2],                          // codigo da escola
            'turma': dataString.split(",")[3]
        };

    }
    else {
        //scene.loginErrorMsg.visible = true;
        return "WRONG_PASSWORD";
    }

}