const mysql = require('mysql2')
const fs = require('fs')
const express = require('express')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tnl110',
    database: 'nodejs'
}
)

const writeJson = (path, results) => {

    results = JSON.stringify(results)
    fs.writeFile(__dirname + '/assets/' + path, results, 'utf-8', (error) => {
        if (error) throw error;
    });
}

connection.connect(function (error) {
    if (error) throw error
    else console.log("connected to the database successfully!")
})

exports.writeJson = (path, results) => {
    results = JSON.stringify(results)
    fs.writeFile(__dirname + '/assets/' + path, results, 'utf-8', (error) => {
        if (error) throw error;
    });
}


exports.getSubject = () => {
    connection.query("select * from subjects limit 5", function (error, results, fields) {
        if (error) throw error
        writeJson('subject.json', results)
    })
}

exports.getQuizs = () => {
    connection.query("select * from quizs limit 12", function (error, results, fields) {
        if (error) throw error
        writeJson('quizs.json', results)
    })

}

exports.getQuizByUserId = (id) => {
    connection.query("select * from quizs where user_id = ?", [id], function (error, results, fields) {
        if (error) throw error
        writeJson('quizs.json', results)
    })

}

exports.setSelectedAns = (ans)=>{
    writeJson('selectedAns.json', ans)
}

exports.getQuiz = (id)=>{
    connection.query("select * from quizs where quiz_id = ?", [id], function (error, results, fields) {
        if (error) throw error
        console.log(results)
        connection.query("select * from loginuser where user_id = ?", [results[0].user_id], function (error1, results1, fields1) {
            if (error1) throw error1
            console.log(results1)
            connection.query("select * from ques where quiz_id = ?", [id], function (error2, results2, fields2) {
                if (error2) throw error2
                console.log(results2)
                const json = {
                    quiz: results,
                    author: results1,
                    ques: results2
                }
                writeJson('quiz.json', json)
            })
        })
    })
}

const test = ()=>{
    const search = 'thi'
    var sqlSearch = '% '+search+' %'
    console.log(search)
    
    connection.query(`select * from quizs where quiz_name like ?`,[sqlSearch],(err, results, fields)=>{
        if(err) throw err
        console.log(results)
        const json = {
            textSearch: search,
            quizs: results
        }
        writeJson('quizs.json',json)
    })
}
test()


