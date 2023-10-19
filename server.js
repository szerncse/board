const express = require('express');
const app = express();
const port = 5000
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const session = require('express-session');
const passport = require('passport');
const Localstrategy = require('passport-local');

app.use(passport.initialize());
app.use(session({
    secret: '암호화에쓸 비번', //세션 문서의 암호화
    resave: false, //유저가 서버로 요청할 떄마다 갱신할건지
    saveUninitialized: false // 로그인 안해도 세션 만들건지
}))
app.use(passport.session());





dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const methodOverride = require('method-override');
app.use(methodOverride('_method'))


app.set('view engine','ejs');



const {MongoClient, ObjectId} = require('mongodb');
app.use(express.static(__dirname + '/public'))

let db;
let sample;
const url = `mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PW}@cluster0.pcchu3g.mongodb.net/`

new MongoClient(url).connect().then((client)=>{
    db = client.db("board");
    sample = client.db("sample_training")
    console.log("db 연결 완료!!")
    

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`${process.env.SERVER_PORT}번호에서 서버 실행중`)
})
    


app.get('/bananalist',(req,res)=>{
    res.send('바나나페이지')
})


}).catch((error)=>{
    console.log()
})



app.get('/', (req,res)=>{
// res.send("Hello World");
res.sendFile(__dirname + '/page/index.html')
})


app.get('/about', (req,res)=>{
    res.send("어바웃 페이지");
    // db.collection("notice").insertOne({
    //     title: "첫번째 글",
    //     content: "두번쨰 글"
    // })
    })

app.get('/list', async (req,res)=>{

    const result = await db.collection("notice").find().limit(5).toArray()

    res.render("list.ejs", {
        data : result
    });
})

app.get('/list/:id', async (req,res)=>{

    const result = await db.collection("notice").find().skip((req.params.id - 1)* 5).limit(5).toArray()

    res.render("list.ejs", {
        data : result
    });
})

app.get('/notice',(req,res)=>{
    res.send('notice페이지')
})


app.get('/write',(req,res)=>{
        res.render('write.ejs')
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




app.post('/add',async (req,res)=>{
        try{
            await db.collection("notice").insertOne({
                title: req.body.title,
                content: req.body.content
            })
        }catch(error){
            console.log(error)
                }
    // res.send("성공!")
    res.redirect('/list')
} )

app.put('/edit', async (req,res)=>{
// updateOne({문서},{
// $set : {원하는키: 변경값}
// })

await db.collection("notice").updateOne({
    _id : new ObjectId(req.body._id)
},{
  $set :{
      title: req.body.title,
      content: req.body.content
    }
 })
    
    // res.send(result)
    res.redirect('/list')
})


app.get('/edit/:id', async(req,res)=>{
    const result = await db.collection("notice").findOne({
        _id : new ObjectId(req.params.id)
    })
    res.render("edit.ejs", {
        data : result
        });
    })


app.get('/delete/:id', async(req,res)=>{

    await db.collection("notice").deleteOne({
            _id : new ObjectId(req.params.id)
        })
        res.redirect('/list')
})


passport.use(new Localstrategy({
    usernameField : 'userid',
    passwordField : 'password'
},async (userid,password,cb)=>{
    let result = await db.collection("users").findOne({
        userid : userid
    })

    if(!result){
        return cb(null, false, {message: '아이디나 비밀번호가 일치 하지 않음'})
    }
    if(result.password === password){
        return cb(null, result);
    }else{
        return cb(null, false, {message: '아이디나 비밀번호가 일치 하지 않음'})
    }
}))

app.get('/login', (req,res)=>{
    res.render('login.ejs')
})
app.post('/login', async(req,res, next)=>{
//   console.log(req.body);
    passport.authenticate('local',(error, user, info)=>{
        console.log(error, user, info)
        if(error) return res.status(500).json(error);
        if(!user) return res.status(401).json(info.message)
        req.logIn(user, (error)=>{
         if(error) return next(error);
          res.redirect('/')
        })
    })(req,res,next)
})







app.get('/register',(req,res)=>{
    res.render("register.ejs")
})
app.post('/register', async(req,res)=>{

    let hashpass = await bcrypt.hash(req.body.password, 10);

    // console.log(hashpass)
    try{
        await db.collection("users").insertOne({
            userid: req.body.userid,
            password: hashpass
        })
    }catch(error){
        // console.log(error)
            }
res.redirect('/list')
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
