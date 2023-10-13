const express = require('express');
const app = express();
const port = 5000

app.set('view engine', 'ejs');
// mongodb+srv://admin:<qwe1234>@cluster0.pcchu3g.mongodb.net/


const {MongoClient, ObjectId} = require('mongodb');
app.use(express.static(__dirname + '/public'))

let db;
let sample;
const url = 'mongodb+srv://admin:qwe1234@cluster0.pcchu3g.mongodb.net/'

new MongoClient(url).connect().then((client)=>{
    db = client.db("board");
    sample = client.db("sample_training")
    console.log("db 연결 완료!!")

    app.listen(5000, ()=>{
        console.log(`${port}번호에서 서버 실행중`)
        })

}).catch((error)=>{
    console.log()
})



app.get('/', (req,res)=>{
// res.send("Hello World");
res.sendFile(__dirname + '/page/index.html')
})


app.get('/about', (req,res)=>{
    // res.send("어바웃 페이지");
    // db.collection("notice").insertOne({
    //     title: "첫번째 글",
    //     content: "두번쨰 글"
    // })
    })

app.get('/list', async (req,res)=>{

    const result = await db.collection("notice").find().toArray()
    console.log(result[0])

    res.render("list.ejs", {
        data : result
        });
    })

app.get('/view/:id', async (req,res)=>{
    const result = await db.collection("notice").findOne({
        _id : new ObjectId(req.params.id)
    })
    
    res.render("view.ejs", {
        data : result
        });

    })

app.get('/portfolio', (req,res)=>{
    res.send("포폴 페이지2");
    })

    // 1. uniform Interface
    // 여러 URL 과 METHOD 는 일관성이 있어야 하며, 하나의 URL 에서는 하나의 데이터만 가져오게 디자인 하며, 간결하고 예측 가능한 URL 과 METHOD 를 만들어야 한다.
    // 동사보다는 명사 위주로 쓰면 좋다.
    // 띄어쓰기는 언더바 대신 대시 기호
    // 파일 확장자는 사용금지
    // 하위 문서를 뜻 할땐  / 기호를 사용

    // 2. 클라이언트와 서버역할 구분해준다. 유저에게 서버역할을 맡기거나 직접 입출력을 시키면 안된다.
    //  stateless 요청들은 서로 의종성이 있으면 안되고 , 각각 독립적으로 처리되어야 한다.
    //  Cacheable 서버가 보내는 자료는 캐싱이 가능해야 한다. - 대부분 컴퓨터가 동작한다.
    //  Layered System 서버 기능을 만들 때 레이어를 걸쳐서 코드가 실행되어야 한다.(몰라도됨)
    //  Code on Demeand 서버는 실행 가능한 코드를 보낼 수 있다.(몰라도됨)