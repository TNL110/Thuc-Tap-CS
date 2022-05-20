const body = document.querySelector(".body")

async function setData() {
    const path = '/assets/quiz.json'
    const request = new Request(path)
    const response = await fetch(request)
    data = await response.json()

    console.log(data)
    const quiz = document.querySelector('.info-quiz')

    // console.log(ques[0].quiz_id)
    quizInfo = data.quiz[0]
    author = data.author[0]
    ques = data.ques
    console.log(ques)

    body.innerHTML += `
    <div class="start item" data-check="true">
        <h1>${quizInfo.quiz_name}</h1>
        <h2>by: ${author.user_name}</h2>
    </div>
    `

    const length = ques.length
    for (let i = 0; i < length; i++) {
        body.innerHTML += `
        <div class="boxQues item" data-check="true" data-res="${ques[i].right_ans}">
            <div class="ques">
                <p>${ques[i].ques}</p>
            </div>
            <div class="boxAns">
                <p class="ans ansA" data-ques="${i}" data-ans="A">A. ${ques[i].ans1}</p>
                <p class="ans ansB" data-ques="${i}" data-ans="B">B. ${ques[i].ans2}</p>
                <p class="ans ansC" data-ques="${i}" data-ans="C">C. ${ques[i].ans3}</p>
                <p class="ans ansD" data-ques="${i}" data-ans="D">D. ${ques[i].ans4}</p>
            </div>
            <input type="hidden" name="selectedAns" value="noAns" class="yourAns">
        </div>
        `
    }
    const boxQues = document.querySelectorAll('.boxQues')
    for(let i = 1; i < length; i++){
        boxQues.item(i).dataset.check = "false"
    }

    const count = document.querySelector('.count')
    const items = document.querySelectorAll(".item")
    const btnNext = document.querySelector('.btnNext')
    const btnBack = document.querySelector('.btnBack')
    const ans = document.querySelectorAll('.ans')
    const cover = document.querySelector('.cover')
    const submit = document.querySelector('.submit')
    const yourAns = document.querySelectorAll('.yourAns')

    const progress = document.querySelector(".progress")
    // console.log(progress.value)
    var i = items.length
    var check = true

    count.innerHTML = `0/${length}`

    const startTime = (check) => {
        var s = progress.value
        console.log(s)
        const timeout = setTimeout(() => {
            progress.value = s - 1
            s -= 1
            if(check){
                startTime(check);
            }
        }, 1000);
        timeout
        if (s == "0") {
            clearTimeout(timeout)
        }
    }

    // startTime()
    items.forEach((e) => {
        e.style.zIndex = i
        i -= 1
    })

    ans.forEach((e, index) => {
        e.addEventListener('click', (e1) => {
            cover.classList.remove('hidden')
            var q = Number(e.dataset.ques)
            yourAns.item(q).value = e.dataset.ans
            if (boxQues.item(q).dataset.res === e.dataset.ans) {
                e.classList.add('rightAns')
                // e.removeEventListener('click');
                for (var j = 0; j < ans.length; j += 1) {
                    if (Number(ans.item(j).dataset.ques) === q && j != index) {
                        ans.item(j).classList.add('otherAns')
                    }
                }
            } else {
                e.classList.add('selectedAns')
                for (var j = 0; j < ans.length; j += 1) {
                    if (Number(ans.item(j).dataset.ques) === q && j != index) {
                        if (ans.item(j).dataset.ans === boxQues.item(q).dataset.res) {
                            ans.item(j).classList.add('rightAns')
                        } else {
                            ans.item(j).classList.add('otherAns')
                        }
                    }
                }
            }
            body.dataset.pointer = q + 1
            items.item(q + 2).dataset.check = "true"
            // check = false
            setTimeout(()=>{
                btnNext.click()
            }, 3000)
           
        })
    })

    btnNext.addEventListener('click', (e) => {
        cover.classList.add('hidden')
        var t = Number(body.dataset.pointer)
        if(t+1>length){
            submit.click()
        }
        if (items.item(t + 1).dataset.check === "true") {
            
            items.item(t).classList.add('hidden')
            body.dataset.pointer = t + 1
            count.innerText = `${t+1}/${length}`
            // if(t==0){
            //     startTime(check)
            // }
            
        }
    })

    btnBack.addEventListener('click', (e) => {
        var t = Number(body.dataset.pointer)
        console.log(t)
        if (t - 1 >= 0) {
            items.item(t - 1).classList.remove('hidden')
            body.dataset.pointer = t - 1
            count.innerText = `${t-1}/${length}`
            cover.classList.remove('hidden')
        }
    })
}

setData()



