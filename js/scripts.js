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
                        <ion-icon name="add-circle"></ion-icon>
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
                    <button>Criar Quizzy</button>
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

function openQuiz(htmlElement){
    const geturl = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${htmlElement.dataset.id}`;
    //console.log(geturl);
    const promiseOpenQuiz = axios.get(geturl);

    promiseOpenQuiz.then(showQuiz);
    promiseOpenQuiz.catch(errorOpenQuiz);
}

function errorOpenQuiz(error){
    alert("Erro na função openQuiz()");
}

function showQuiz(response){
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

    if(totalAnswers == totalQuestions)
        showLevel();
}

function showLevel(){
    const grade = (rightAnswers/totalAnswers)*100;
    let i = 0;
    let count = 0;
    levelsList.forEach(level => {
        if(level.minValue > levelsList[i].minValue && grade > level.minValue)
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
            <button class="restart">Reiniciar Quiz</button>
            <button class="home">Voltar pra home</button>
        </div>
    `;

    totalAnswers = 0;
    rightAnswers = 0;
    totalQuestions = 0;

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML += html;
}