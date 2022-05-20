const subjectItems = document.querySelector(".subjectItems")
const quizItems = document.querySelector(".quizItems")

async function getData(){
    const path = '/assets/subject.json'
    const request = new Request(path)
    const response = await fetch(request)
    data = await response.json()
    for(let i = 0; i < data.length; i++){
        console.log(data[i].subject_name)
    }
    console.log(data)
    let text = ``
    for(let i = 0; i < data.length; i++){
        
        subjectItems.innerHTML += `<a class="subjectItem" href="/">${data[i].subject_name}</a>`
    }

    // subjectItems.innerHTML = text
}

getData()

async function setData() {
    const path = '/assets/quizs.json'
    const request = new Request(path)
    const response = await fetch(request)
    data = await response.json()
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].quiz_name)
    }
    console.log(data)
    let text = ``
    for (let i = 0; i < data.length; i++) {

        quizItems.innerHTML += `<div class="quizItem">
        <div class="left-quiz">
            <h3>${data[i].quiz_name}</h3>
            <h4>ques: ${data[i].count_ques}</h4>
        </div>
        <img src="https://media.istockphoto.com/vectors/quiz-game-icon-vector-outline-illustration-vector-id1214244508"
            alt="">
        <div class="form-quiz hidden">
            <div class="info-quiz">
                <div class="info-quiz-footer">
                    <div class="info-quiz-footer-top">
                    <h3>${data[i].quiz_name}</h3>
                    <h4>ques: ${data[i].count_ques}</h4>
                    </div>
                    <a href="/quiz?quiz_id=${data[i].quiz_id}">Start quiz</a>
                </div>
            </div>
        </div>
    </div>`
    }

    const quizItem = document.querySelectorAll(".quizItem")
    const formQuiz = document.querySelectorAll(".form-quiz")

    console.log(quizItem.length)

    quizItem.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            console.log(index)
            formQuiz.item(index).classList.toggle("hidden")
        })
    })

}

setData()