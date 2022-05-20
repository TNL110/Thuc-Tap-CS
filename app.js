const mysql = require('mysql2')
const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const bodyParser = require('body-parser')
const encoder = bodyParser.urlencoded();

const data = require('./data')

const app = express();

const oneDay = 1000 * 60 * 60 * 24

var session

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));
app.use(cookieParser());

app.use("/assets", express.static("assets"))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tnl110',
    database: 'nodejs'
}
)

// connect to the database
connection.connect(function (error) {
    if (error) throw error
    else console.log("connected to the database successfully!")
})

app.post("/", encoder, function (req, res) {
    var action = req.body.action
    var username = req.body.username
    var password = req.body.password
    console.log(username, password)
    if (action === 'login') {
        connection.query("select * from loginuser where user_name = ? and user_pass = ?", [username, password], function (error, results, fields) {
            if (results.length > 0) {
                var idUser = 0
                session = req.session
                session.userid = results[0].user_id
                session.userName = username
                console.log(req.session)
                res.redirect("/home")
            } else {

                res.redirect("/?mess=fail")
            }
            res.end();
        })
    } else {
        var email = req.body.email
        connection.query("insert into loginuser(email,user_name,user_pass) value(? ,? ,?)", [email, username, password], function (error, results, fields) {
            session = req.session
            session.userid = results[0].user_id
            session.userName = username
            console.log(req.session)
            res.redirect("/home")
        })
    }
})

app.post('/ques', (req, res) => {
    // var time = req.body.time
    var quizName = req.body.quizTitle
    var subject = req.body.subject
    var ques = req.body.ques
    var a = req.body.a
    var b = req.body.b
    var c = req.body.c
    var d = req.body.d
    var rightAns = req.body.ans
    var idSubject = 0
    // console.log(time, quizName, subject)
    connection.query("select * from subjects where subject_name=?", [subject], (error, results, fields) => {
        if (results.length > 0) {
            idSubject = results[0].subject_id

            console.log(idSubject, session.userid, quizName, rightAns.length)
            var idQuiz = 0
            connection.query("insert into quizs (subject_id,user_id,quiz_name,count_ques) values (?,?,?,?,?)", [idSubject, session.userid, quizName, rightAns.length], (error, results0, fields0) => {
                if (error) throw error
                console.log("complete insert quiz")
                connection.query("select * from quizs where quiz_name=?", [quizName], (error, results1, fields1) => {
                    if (results1.length > 0) idQuiz = results1[0].quiz_id
                    if(rightAns<=1){
                        connection.query("insert into ques (quiz_id,ques,ans1,ans2,ans3,ans4,right_ans) values (?,?,?,?,?,?,?)", [idQuiz, ques, a, b, c, d, rightAns], (error, results2, fields2) => {
                            if (error) throw error
                            console.log("complete insert ques")
                        })
                    }
                    for (let i = 0; i < rightAns.length; i += 1) {
                        connection.query("insert into ques (quiz_id,ques,ans1,ans2,ans3,ans4,right_ans) values (?,?,?,?,?,?,?)", [idQuiz, ques[i], a[i], b[i], c[i], d[i], rightAns[i]], (error, results2, fields2) => {
                            if (error) throw error
                            console.log("complete insert ques")
                        })
                    }
                })
            })
        } else {
            connection.query("insert into subjects (subject_name) values (?)", [subject], (error, results, fields) => {
                if (error) throw error
                console.log("complete insert subject")
            })
            connection.query("select * from subjects where subject_name=?", [subject], (error, results, fields) => {
                console.log(results[0])
                idSubject = results[0].subject_id

                console.log(idSubject, session.userid, quizName, rightAns.length)
                var idQuiz = 0
                connection.query("insert into quizs (subject_id,user_id,quiz_name,count_ques) values (?,?,?,?)", [idSubject, session.userid, quizName, rightAns.length], (error, results0, fields0) => {
                    if (error) throw error
                    console.log("complete insert quiz")
                    connection.query("select * from quizs where quiz_name=?", [quizName], (error, results1, fields1) => {
                        if (results1.length > 0) idQuiz = results1[0].quiz_id
                        if(rightAns<=1){
                            connection.query("insert into ques (quiz_id,ques,ans1,ans2,ans3,ans4,right_ans) values (?,?,?,?,?,?,?)", [idQuiz, ques, a, b, c, d, rightAns], (error, results2, fields2) => {
                                if (error) throw error
                                console.log("complete insert ques")
                            })
                        }
                        for (let i = 0; i < rightAns.length; i += 1) {
                            connection.query("insert into ques (quiz_id,ques,ans1,ans2,ans3,ans4,right_ans) values (?,?,?,?,?,?,?)", [idQuiz, ques[i], a[i], b[i], c[i], d[i], rightAns[i]], (error, results2, fields2) => {
                                if (error) throw error
                                console.log("complete insert ques")
                            })
                        }
                    })
                })
            })
        }

        res.redirect("/profile")
    })

})

app.post('/quiz/result', (req,res)=>{
    var ans = req.body.selectedAns
    console.log(ans)
    data.setSelectedAns(ans)
    res.redirect("/quiz/result")
})

const getIdSubject = (subject) => {
    let idSubject = 0

    console.log(obj)
    console.log(idSubject)
    return idSubject
}




app.post('/home/query', (req, res) => {
    const search = req.body.search
    var sqlSearch = '% '+search+' %'
    console.log(search)
    
    connection.query(`select * from quizs where quiz_name like ?`,[sqlSearch],(err, results, fields)=>{
        if(err) throw err
        console.log(results)
        const json = {
            textSearch: search,
            quizs: results
        }
        data.writeJson('quizs.json',json)
    })
    res.redirect("/home/query")
})

app.get('/quiz/result', (req,res)=>{
    res.sendFile(__dirname + "/result.html")
})

app.get('/home/query', (req,res)=>{
    res.sendFile(__dirname + "/home.html")
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

app.get("/home", function (req, res) {
    data.getQuizs()
    data.getSubject()
    res.sendFile(__dirname + "/home.html")
})

app.get("/createQuiz", function (req, res) {
    res.sendFile(__dirname + "/createQuiz.html")
})

app.get("/", function (req, res) {
    data.getSubject()
    data.getQuizs()
    session = req.session;
    if (session.userid) {
        res.sendFile(__dirname + '/home.html')
    } else
        res.sendFile(__dirname + '/login&register.html')
})

app.get("/profile", function (req, res) {
    data.getSubject()
    data.getQuizByUserId(session.userid)
    res.sendFile(__dirname + "/profileUser.html")
})

app.get("/quiz", (req,res)=>{
    var quizID = req.query.quiz_id
    // data.getAuthorByIdQuiz(quizID)
    // data.getQuesByQuizId(quizID)
    data.getQuiz(quizID)
    res.sendFile(__dirname + '/quiz.html')
})

// set app port
app.listen(4500);