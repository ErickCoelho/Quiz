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
    console.log("TAMO DENTRO DO QUIZ");
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
                html += `<div class="option right">`;
            else
            html += `<div class="option">`;
            html += `
                    <img src="${answer.image}">
                    <div class="text">${answer.text}</div>
                </div>
            `;
        });
        html += `</div></div>`;
    });

    html += `
    </div></div>
    `;
    //console.log(response.data);
    console.log("TAMO FORA DO QUIZ");

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;
}