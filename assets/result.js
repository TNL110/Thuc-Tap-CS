
async function setData(){
    const request = new Request('/assets/quiz.json')
    const response = await fetch(request)
    data = await response.json()
    ques = data.ques
    console.log(data)

    const request1 = new Request('/assets/selectedAns.json')
    const response1 = await fetch(request1)
    selectedAns = await response1.json()

    console.log(selectedAns )

    var quesWrong = []

    const reviewQues = document.querySelector(".reviewQuestions")

    for(let i = 0; i < ques.length; i+=1){
        if(ques[i].right_ans!==selectedAns[i]){
            quesWrong.push({
                count : i+1,
                question: ques[i],
                selected:  selectedAns[i]
            })
        }
    }

    const correct = document.querySelector('.correct')
    correct.innerText = ques.length - quesWrong.length
    const incorrect = document.querySelector('.incorrect')
    incorrect.innerText = ques.length

    const progress = document.querySelector(".progress")
    progress.max = ques.length
    progress.value = ques.length - quesWrong.length
    console.log(progress.max, progress.value)

    for(let i = 0; i < quesWrong.length; i+=1){
        reviewQues.innerHTML += `
        <div class="ques">
            <h2 class="ques-text">${quesWrong[i].count}. ${quesWrong[i].question.ques}</h2>
            <div class="box-ans">
                <h4 class="ans${i}A">> ${quesWrong[i].question.ans1}</h4>
                <h4 class="ans${i}B">> ${quesWrong[i].question.ans2}</h4>
                <h4 class="ans${i}C">> ${quesWrong[i].question.ans3}</h4>
                <h4 class="ans${i}D">> ${quesWrong[i].question.ans4}</h4>
            </div>
        </div>
        `
        const right = document.querySelector(".ans"+i+quesWrong[i].question.right_ans)
        const select = document.querySelector(".ans"+i+quesWrong[i].selected)

        right.classList.add('right-Ans')
        select.classList.add('wrong-Ans')
    }


    const request2 = new Request('/assets/author.json')
    const response2 = await fetch(request2)
    const author = await response2.json()

    const request3 = new Request('/assets/quiz.json')
    const response3 = await fetch(request3)
    const infoQuiz = await response3.json()

    console.log(author)
    const quiz = document.querySelector('.info-quiz')

    console.log(ques[0].quiz_id)
    quizInfo = infoQuiz.find((element) => {
        // console.log(element)
        return element.quiz_id == ques[0].quiz_id
    })
    console.log(quizInfo)
    quiz.innerHTML = `
        <img src="https://media.istockphoto.com/vectors/quiz-game-icon-vector-outline-illustration-vector-id1214244508" alt="">
        <div class="left-quiz">
            <h1>${quizInfo.quiz_name}</h1>
            <h2>ques: ${ques.length}</h2>
            <h2>by: ${author[0].user_name}</h2>
        </div>
    `

    const playAgain = document.querySelector('.playAgain')
    playAgain.href = `/quiz?quiz_id=${ques[0].quiz_id}`
}

setData()