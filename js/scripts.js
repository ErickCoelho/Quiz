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
            <li data-id="${element.id}" onclick="openQuiz(this)">
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

function openQuiz(htmlElement){
    quizId = htmlElement.dataset.id;
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

function createQuizStart(){

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

    /*console.log(title.length);
    console.log(validateUrl(url));
    console.log(parseInt(nOfQuestions));
    console.log(parseInt(nOfLevels));*/

    if(title.length < 20)
        alert("Title");
    if(!validateUrl(url))
        alert("url");
    if(parseInt(nOfQuestions) < 2)
        alert("nOfQuestions");
    if(parseInt(nOfLevels) < 2)
        alert("nOfLevels");

    createQuizQuestions();

}

function validateUrl(urlValidation){
    const urlRegex = new RegExp('^((http|https)://)[-a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$');

    if(urlRegex.test(urlValidation))
        return true;
    else
        return false;
}

function createQuizQuestions(){


    let html = ``;
    html += `
        <div class="newQuiz">

            <div class="createQuestions">
                <div class="title">Crie suas perguntas</div>
                <div class="inputGroup">
                    <div class="title">Pergunta 1</div>
                    <input 
                        type="text"
                        placeholder="Texto da pergunta"
                    >
                    <input 
                        type="text"
                        placeholder="Cor de fundo da pergunta"
                    >
                    <div class="title">Resposta correta</div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta correta"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem"
                        >
                    </div>
                    <div class="title">Respostas incorretas</div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta incorreta 1"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem 1"
                        >
                    </div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta incorreta 2"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem 2"
                        >
                    </div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta incorreta 3"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem 3"
                        >
                    </div>
                </div>
                <div class="inputGroup">
                    <div class="title">Pergunta 2</div>
                    <input 
                        type="text"
                        placeholder="Texto da pergunta"
                    >
                    <input 
                        type="text"
                        placeholder="Cor de fundo da pergunta"
                    >
                    <div class="title">Resposta correta</div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta correta"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem"
                        >
                    </div>
                    <div class="title">Respostas incorretas</div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta incorreta 1"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem 1"
                        >
                    </div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta incorreta 2"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem 2"
                        >
                    </div>
                    <div class="resposta">
                        <input 
                            type="text"
                            placeholder="Resposta incorreta 3"
                        >
                        <input 
                            type="text"
                            placeholder="URL da imagem 3"
                        >
                    </div>
                </div>
                <button onclick="createQuizLevels()">Prosseguir pra criar níveis</button>
            </div>

        </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}

function createQuizLevels(){

    let html = ``;
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
                <button onclick="createQuizReady()">Finalizar Quizz</button>
            </div>

        </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}

function createQuizReady(){

    let html = ``;
    html += `
        <div class="newQuiz">

            <div class="ready">
                <div class="title">Seu quizz está pronto!</div>
                <div class="readyImage">
                    <img src="https://s2.glbimg.com/oEHVlonqI0BlBphzUs_rJpTL7kE=/e.glbimg.com/og/ed/f/original/2020/01/23/mit-campus.jpg">                
                    <div class="quizTitle">O quão Potterhead é você?</div>
                </div>
                <div class="buttons">
                    <button>Acessar Quizz</button>
                    <button class="home" onclick="getQuizzes()">Voltar pra home</button>
                </div>
            </div>

        </div>
    `;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;

}