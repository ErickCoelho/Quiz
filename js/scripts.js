/*Quizes List CSS*/

function getQuizzes(){
    promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promiseQuizzes.then(loadQuizzes);
    promiseQuizzes.catch(errorGetQuizzes);
}

function errorGetQuizzes(error){
    alert("Erro na função getQuizzes()");
}

function loadQuizzes(response){
    console.log(localStorage.getItem("id"));
    alert(localStorage.getItem("id"));

    let html = ``;
    if(false) //Com quizes próprios
        html=`
            <div class="quizesList">
                
                <div class="list seusQuizes">
                    <div class="seusQuizesHeader">
                        <div class="title">Seus Quizes</div>
                        <ion-icon name="add-circle" onclick="createQuizStart()"></ion-icon>
                    </div>
                    <ul>
                        <li>
                            <img src="https://uploads.metropoles.com/wp-content/uploads/2022/09/09161622/Simpsons-temporada-33-editado-2.jpg">                
                            <div class="quizTitle">Acerte os personagens corretos dos Simpsons e prove seu amor!</div>
                        </li>
                        <li>
                            <img src="https://uploads.metropoles.com/wp-content/uploads/2022/09/09161622/Simpsons-temporada-33-editado-2.jpg">                
                            <div class="quizTitle">Acerte os personagens corretos dos Simpsons e prove seu amor!</div>
                        </li>
                        <li>
                            <img src="https://uploads.metropoles.com/wp-content/uploads/2022/09/09161622/Simpsons-temporada-33-editado-2.jpg">                
                            <div class="quizTitle">Acerte os personagens corretos dos Simpsons e prove seu amor!</div>
                        </li>
                    </ul>
                </div>
                <div class="list todosQuizes">
                    <div class="title">Todos os Quizes</div>
                    <ul>
        `;
    else
        html=`
            <div class="quizesList">
                <div class="semQuizCriado">
                    <div>Você não criou nenhum quiz ainda :(</div>
                    <button onclick="createQuizStart()">Criar Quizzy</button>
                </div>
                <div class="list todosQuizes">
                    <div class="title">Todos os Quizes</div>
                    <ul>
        `;

    response.data.forEach(element => {
        //console.log(element);
        html+=`
            <li data-id="${element.id}" onclick="getQuizId(this)">
                <img src=${element.image}>                
                <div class="quizTitle">${element.title}</div>
            </li>
        `;
    });

    html +=`
            </ul>
        </div>
    </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;
}




/*Quizes Questions CSS*/

let totalQuestions = 0;
let rightAnswers = 0;
let totalAnswers = 0;
let levelsList = [];
let quizId = "";

function getQuizId(htmlElement){
    quizId = htmlElement.dataset.id;
    openQuiz(quizId);
}

function openQuiz(quizId){
    const geturl = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizId}`;
    //console.log(geturl);
    const promiseOpenQuiz = axios.get(geturl);

    promiseOpenQuiz.then(showQuiz);
    promiseOpenQuiz.catch(errorOpenQuiz);
}

function errorOpenQuiz(error){
    alert("Erro na função openQuiz()");
}

function showQuiz(response){
    totalQuestions = 0;
    totalAnswers = 0;
    rightAnswers = 0;

    let html = ``;
    html += `
        <div class="quizQuestions">
            <div class="quizQuestionsHeader">
                <img src="${response.data.image}">
                <div class="title">${response.data.title}</div>
            </div>

            <div class="quizQuestionsBody">
    `;

    response.data.questions.forEach(question => {
        html += `
            <div class="question">
                <div class="questionHeader" style="background-color: ${question.color};">${question.title}</div>
                <div class="questionOptions">
        `;
        question.answers.forEach(answer => {
            if(answer.isCorrectAnswer)
                html += `<div class="option right" onclick="selectAnswer(this)">`;
            else
                html += `<div class="option" onclick="selectAnswer(this)">`;
            html += `
                    <img src="${answer.image}">
                    <div class="text">${answer.text}</div>
                </div>
            `;
        });
        html += `</div></div>`;
        totalQuestions += 1;
    });

    html += `
    </div></div>
    `;
    //console.log(response.data);

    levelsList = response.data.levels;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;
}

function selectAnswer(element){
    if(!(element.classList.contains("selected") || element.classList.contains("notSelected"))){
        const parentElement = element.parentElement;
        const children = parentElement.children;

        for(let i = 0; i < children.length; i++)
            children[i].classList.add('notSelected');

        element.classList.remove('notSelected');
        element.classList.add('selected');

        if(element.classList.contains('right'))
            rightAnswers += 1;
        
        totalAnswers += 1;

        console.log("Right: " + rightAnswers);
        console.log("Answers: " + totalAnswers);
        console.log("Questions: " + totalQuestions);

        if(totalAnswers == totalQuestions)
            showLevel();
    }
}

function showLevel(){
    const grade = (rightAnswers/totalAnswers)*100;
    let i = 0;
    let count = 0;

    levelsList.forEach(level => {
        if(level.minValue >= levelsList[i].minValue && grade >= level.minValue)
            i = count;
        count += 1;
    });

    let html = ``;
    html += `
        <div class="question final">
            <div class="questionHeader">${levelsList[i].title}</div>
            <div class="questionOptions">
                <img src="${levelsList[i].image}">
                <div class="text">${levelsList[i].text}</div>
            </div>
        </div>

        <div class="buttons">
            <button class="restart" onclick="restarQuiz()">Reiniciar Quiz</button>
            <button class="home" onclick="getQuizzes()">Voltar pra home</button>
        </div>
    `;

    console.log("Right: " + rightAnswers);
    console.log("Answers: " + totalAnswers);
    console.log("Questions: " + totalQuestions);

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML += html;
}

function restarQuiz(){
    const geturl = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizId}`;
    //console.log(geturl);
    const promiseOpenQuiz = axios.get(geturl);

    promiseOpenQuiz.then(showQuiz);
    promiseOpenQuiz.catch(errorOpenQuiz);
}




/*New Quiz CSS*/

let title = "";
let url = "";
let nOfQuestions = "";
let nOfLevels = "";
let questions = [];
let levels = [];

function validateUrl(urlValidation){
    const urlRegex = new RegExp('^((http|https)://)[-a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$');

    if(urlRegex.test(urlValidation))
        return true;
    else
        return false;
}

function validateHex(hexValidation){
    const hexRegex = new RegExp('^#[0-9A-Fa-f]{6}$');

    if(hexRegex.test(hexValidation))
        return true;
    else
        return false;
}

function createQuizStart(){

    title = "";
    url = "";
    nOfQuestions = "";
    nOfLevels = "";
    questions = [];

    let html = ``;
    html += `
        <div class="newQuiz">

            <div class="start">
                <div class="title">Comece pelo começo</div>
                <div class="inputGroup">
                    <input 
                        type="text"
                        placeholder="Título"
                        id="title"
                    >
                    <input 
                        type="text"
                        placeholder="URL da imagem"
                        id="url"
                    >
                    <input 
                        type="number"
                        placeholder="Quantidade de perguntas"
                        id = "nOfQuestions"
                    >
                    <input 
                        type="number"
                        placeholder="Quantidade de níveis"
                        id = "nOfLevels"
                    >
                </div>
                <button onclick="validateStart()">Prosseguir pra criar perguntas</button>
            </div>

        </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}

function validateStart(){

    const titleElement = document.getElementById('title');
    title = titleElement.value;
    
    const urlElement = document.getElementById('url');
    url = urlElement.value;
    
    const nOfQuestionsElement = document.getElementById('nOfQuestions');
    nOfQuestions = nOfQuestionsElement.value;
    
    const nOfLevelsElement = document.getElementById('nOfLevels');
    nOfLevels = nOfLevelsElement.value;


    if(title.length < 20 || !validateUrl(url) || parseInt(nOfQuestions) < 3 || parseInt(nOfLevels) < 2){
       
        if(title.length < 20)
            alert(`O título deve ter mais de 20 caractéres`);
            
        if(!validateUrl(url))
            alert(`A entrada dever ter o formato de uma URL`);
            
        if(parseInt(nOfQuestions) < 3)
            alert(`O número mínimo de questões é 3`);

        if(parseInt(nOfLevels) < 2)
        alert(`O número mínimo de níveis é 2`);
    }
    else
        createQuizQuestions();
}

function createQuizQuestions(){

    console.log(title.length);
    console.log(validateUrl(url));
    console.log(parseInt(nOfQuestions));
    console.log(parseInt(nOfLevels));


    let html = ``;
    
    html += `
        <div class="newQuiz">

            <div class="createQuestions">
                <div class="title">Crie suas perguntas</div>
    `;
    
    for(let i = 0; i < parseInt(nOfQuestions); i++){
        html += `
            <div class="inputGroup pergunta${i+1}">
                <div class="title">Pergunta ${i+1}</div>
                <input 
                    type="text"
                    placeholder="Texto da pergunta"
                    id="questionText"
                >
                <input 
                    type="text"
                    placeholder="Cor de fundo da pergunta"
                    id="questionColor"
                >
                <div class="title">Resposta correta</div>
                <div class="resposta">
                    <input 
                        type="text"
                        placeholder="Resposta correta"
                        id="questionCorrectAnswer"
                    >
                    <input 
                        type="text"
                        placeholder="URL da imagem"
                        id="questionCorrectAnswerUrl"
                    >
                </div>
                <div class="title">Respostas incorretas</div>
                <div class="resposta">
                    <input 
                        type="text"
                        placeholder="Resposta incorreta 1"
                        id="questionWrongAnswer1"
                    >
                    <input 
                        type="text"
                        placeholder="URL da imagem 1"
                        id="questionWrongAnswerUrl1"
                    >
                </div>
                <div class="resposta">
                    <input 
                        type="text"
                        placeholder="Resposta incorreta 2"
                        id="questionWrongAnswer2"
                    >
                    <input 
                        type="text"
                        placeholder="URL da imagem 2"
                        id="questionWrongAnswerUrl2"
                    >
                </div>
                <div class="resposta">
                    <input 
                        type="text"
                        placeholder="Resposta incorreta 3"
                        id="questionWrongAnswer3"
                    >
                    <input 
                        type="text"
                        placeholder="URL da imagem 3"
                        id="questionWrongAnswerUrl3"
                    >
                </div>
            </div>
        `;

    }
    
    html += `
                <button onclick="validateQuizQuestions()">Prosseguir pra criar níveis</button>
            </div>

        </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}

function validateQuizQuestions(){

    //let isValidateQuizQuestions = true;
    questions = [];

    for(let i = 0; i < parseInt(nOfQuestions); i++){


        const questionElement = document.querySelector(`.pergunta${i+1}`);
        console.log(questionElement.innerHTML);

        const questionTextElement = questionElement.querySelector('#questionText');
        const questionText = questionTextElement.value;

        const questionColorElement = questionElement.querySelector('#questionColor');
        const questionColor = questionColorElement.value;

        const questionCorrectAnswerElement = questionElement.querySelector('#questionCorrectAnswer');
        const questionCorrectAnswer = questionCorrectAnswerElement.value;

        const questionCorrectAnswerUrlElement = questionElement.querySelector('#questionCorrectAnswerUrl');
        const questionCorrectAnswerUrl = questionCorrectAnswerUrlElement.value;

        const questionWrongAnswer1Element = questionElement.querySelector('#questionWrongAnswer1');
        const questionWrongAnswer1 = questionWrongAnswer1Element.value;

        const questionWrongAnswerUrl1Element = questionElement.querySelector('#questionWrongAnswerUrl1');
        const questionWrongAnswerUrl1 = questionWrongAnswerUrl1Element.value;

        const questionWrongAnswer2Element = questionElement.querySelector('#questionWrongAnswer2');
        const questionWrongAnswer2 = questionWrongAnswer2Element.value;

        const questionWrongAnswerUrl2Element = questionElement.querySelector('#questionWrongAnswerUrl2');
        const questionWrongAnswerUrl2 = questionWrongAnswerUrl2Element.value;

        const questionWrongAnswer3Element = questionElement.querySelector('#questionWrongAnswer3');
        const questionWrongAnswer3 = questionWrongAnswer3Element.value;

        const questionWrongAnswerUrl3Element = document.querySelector('#questionWrongAnswerUrl3');
        const questionWrongAnswerUrl3 = questionWrongAnswerUrl3Element.value;

        if(questionText.length < 20){
            alert(`O texto da pergunta ${i+1} deve ter no mínimo 20 caracteres!`);
            return;
        }
        
        if(!validateHex(questionColor)){
            alert(`A cor de fundo da pergunta ${i+1} deve ser escrita no formato de um hexadecimal!`);
            return;
        }

        let answersTemp = [];

        if(questionCorrectAnswer !== "" && validateUrl(questionCorrectAnswerUrl)){
            const rightAnswerTemp ={
                answer: questionCorrectAnswer,
                url: questionCorrectAnswerUrl,
                isCorrectAnswer: true,
            };
            answersTemp.push(rightAnswerTemp);
        }
        else{
            if(!validateUrl(questionCorrectAnswerUrl)){
                alert(`A URL da resposta correta na pergunta ${i+1} foi preenchido de maneira errada!`);
                return;
            }
            if(questionCorrectAnswer === ""){
                alert(`O texto da resposta correta na pergunta ${i+1} está vazio!`);
                return;
            }
        }
            



        let countWrongAnswers = 0;
        for(let j = 0; j < 3; j++){
            const currentVar = eval(`questionWrongAnswer${j+1}`);
            const currentVarUrl = eval(`questionWrongAnswerUrl${j+1}`);
            
            if(currentVar !== ""){
                if(validateUrl(currentVarUrl)){
                    const wrongAnswerTemp ={
                        answer: currentVar,
                        url: currentVarUrl,
                        isCorrectAnswer: false,
                    };
    
                    answersTemp.push(wrongAnswerTemp);
                    countWrongAnswers += 1;
                }
                else{
                    alert(`A url da resposta errada ${j+1} na pergunta ${i+1} foi preenchido de maneira errada!`);
                    return;
                }
            }
        }
        if(countWrongAnswers === 0){
            alert(`Preencha ao menos uma resposta incorreta de maneira completa na pergunta ${i+1}`);
            return;
        }


        let questionTemp = {
            title: questionText,
			color: questionColor,
			answers: answersTemp
        };

        console.log(questionTemp);

        questions.push(questionTemp);



    }

    /*if(isValidateQuizQuestions){
        questions = questionsTemp;
        createQuizLevels();
    }
    else{
        alert("6. Algum dos inputs não foi inserido corretamente!");
        alert((isValidateQuizQuestions).toString);
        createQuizQuestions();
    }*/
    console.log("Cheguei Aqui!!!");
    alert("Cheguei Aqui!!!");

    createQuizLevels();
}

function createQuizLevels(){
    console.log(questions);

    let html = ``;

    if(false)
        html += `
            <div class="newQuiz">

                <div class="levels">
                    <div class="title">Agora, decida os níveis!</div>
                    <div class="inputGroup">
                        <div class="title">Nível 1</div>
                        <input 
                            type="text"
                            placeholder="Agora, decida os níveis!"
                        >
                        <input 
                            type="text"
                            placeholder="% de acerto mínima"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem do nível"
                        >
                        <input 
                            type="text"
                            placeholder="Descrição do nível"
                        ></textarea>
                    </div>
                    <div class="inputGroup">
                        <div class="title">Nível 2</div>
                        <input 
                            type="text"
                            placeholder="Agora, decida os níveis!"
                        >
                        <input 
                            type="text"
                            placeholder="% de acerto mínima"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem do nível"
                        >
                        <input 
                            type="text"
                            placeholder="Descrição do nível"
                        ></textarea>
                    </div>
                    <button onclick="validateQuizLevels()">Finalizar Quizz</button>
                </div>

            </div>
        `;
    else{

        html += `
            <div class="newQuiz">
    
                <div class="levels">
                    <div class="title">Agora, decida os níveis!</div>
        `;
    
        for(let i = 0; i < parseInt(nOfLevels); i++){
            html += `
                <div class="inputGroup level${i+1}">
                    <div class="title">Nível ${i+1}</div>
                    <input 
                        type="text"
                        placeholder="Título do nível"
                        id="levelTitle"
                    >
                    <input 
                        type="number"
                        placeholder="% de acerto mínima"
                        id="minGrade"
                    >
                    <input 
                        type="text"
                        placeholder="URL da imagem do nível"
                        id="levelUrl"
                    >
                    <input 
                        type="text"
                        placeholder="Descrição do nível"
                        id="levelDescription"
                    ></textarea>
                </div>
            `;
        }
    
        html += `
                <button onclick="validateQuizLevels()">Finalizar Quizz</button>
                </div>
    
            </div>
        `;

    }

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}

function validateQuizLevels(){

    //let isValidateQuizQuestions = true;
    let acertoZero = false;

    let levelsTemp = [];
    for(let i = 0; i < parseInt(nOfLevels); i++){


        const questionElement = document.querySelector(`.level${i+1}`);
        console.log(questionElement.innerHTML);

        const levelTitleElement = questionElement.querySelector('#levelTitle');
        const levelTitle = levelTitleElement.value;

        const minGradeElement = questionElement.querySelector('#minGrade');
        const minGrade = minGradeElement.value;

        const levelUrlElement = questionElement.querySelector('#levelUrl');
        const levelUrl = levelUrlElement.value;

        const levelDescriptionElement = questionElement.querySelector('#levelDescription');
        const levelDescription = levelDescriptionElement.value;

        if(levelTitle.length < 10){
            alert(`O título do nível ${i+1} deve ter no mínimo 10 caracteres!`);
            return;
        }

        if(minGrade < 0 || minGrade > 100){
            alert(`O "% de acerto mínima" do nível ${i+1} deve estar entre 0 e 100!`);
            return;
        }

        if(!validateUrl(levelUrl)){
            alert(`A URL do nível ${i+1} foi preenchido de maneira errada!`);
            return;
        }

        if(levelDescription.length < 30){
            alert(`A descrição do nível ${i+1} deve ter no mínimo 30 caracteres!`);
            return;
        }

        if(minGrade == 0)
            acertoZero = true;

        levelsTemp.push({
			title: levelTitle,
			image: levelUrl,
			text: levelDescription,
			minValue: minGrade
        });
        
    }

    if(!acertoZero){
        alert(`Deve haver ao menos um nível com "% de acerto mínima" igual a zero!`);
        return;
    }
    
    levels = levelsTemp;
    

    console.log("Cheguei Aqui!!!");
    alert("Cheguei Aqui!!!");

    postQuiz();
}

function postQuiz(){

    console.log(levels);
    console.log(questions);

    const postObject = {
        title: title,
        image: url,
        questions: questions,
        levels: levels
    };

    console.log(postObject);

    promiseCreateQuiz = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", postObject);

    promiseCreateQuiz.then(createQuizReady);
    promiseCreateQuiz.catch(createQuizError);

}

function createQuizError(error){
    alert("Erro na função postQuiz()");
}

function createQuizReady(response){

    console.log(levels);

    let quizId = response.data;

    console.log(quizId);
    alert(quizId);

    localStorage.setItem("id", JSON.stringify(quizId));

    let html = ``;
    html += `
        <div class="newQuiz">

            <div class="ready">
                <div class="title">Seu quizz está pronto!</div>
                <div class="readyImage">
                    <img src="`;
    html += url;
    html += `
        ">                
        <div class="quizTitle">
    `;
    html += title;

    html += `
                    </div>
                </div>
                <div class="buttons">
                    <button onclick="openQuiz(`+ quizId.toString() +`)">Acessar Quizz</button>
                    <button class="home" onclick="getQuizzes()">Voltar pra home</button>
                </div>
            </div>

        </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}