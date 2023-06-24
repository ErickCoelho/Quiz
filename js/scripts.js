function getQuizzes(){
    promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promiseQuizzes.then(loadQuizzes);
    promiseQuizzes.catch(errorGetQuizzes);
}

function errorGetQuizzes(error){
    alert("Erro na função getQuizzes()");
}

function loadQuizzes(response){
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
        console.log(element);
        console.log("________________");
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

function openQuiz(htmlElement){
    const html = `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${htmlElement.dataset.id}`;
    console.log(html);
    const promiseOpenQuiz = axios.get(html);

    promiseOpenQuiz.then(showQuiz);
    promiseOpenQuiz.catch(errorOpenQuiz);
}

function errorOpenQuiz(error){
    alert("Erro na função openQuiz()");
}

function showQuiz(response){
    const html = "";
    console.log("TAMO DENTRO DO QUIZ");
    console.log(response.data);
    console.log("TAMO FORA DO QUIZ");

    const pageBodyTag = document.querySelector(".pageBody");
    pageBodyTag.innerHTML = html;
}