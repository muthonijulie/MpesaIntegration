const express=require("express");
const app=express();
const http =require("http");
const bodyParser=require("body-parser");
const moment=require("moment");
const { timeStamp } = require("console");
const cors=require("cors");
//miss request module
const request=require("request");
const https =require("https");

const port=4000;
const hostname="localhost";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const server = http.createServer(app);

app.get("/",(req,res)=>{
    res.send("MPESA DARAJA API WITH NODE JS")
     const timestamp=moment().format("YYYYMMDDHHmmss");
     console.log(timestamp)
},timeStamp);
//access token route
app.get("/access_token",(req,res)=>{
    getAccessToken()
    .then((accessToken)=>{
        res.send("Access token is:"+accessToken);
    })
    .catch((error) => {
            console.error(error);
            res.status(500).send("Failed to fetch access token");
        });

})
//stk push route 
app.get("/stkpush",(req,res)=>{
    getAccessToken()
    .then((accessToken)=>{
        const url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        auth=`Bearer ${accessToken}`;
        const timestamp=moment().format("YYYYMMDDHHmmss");
        const password=Buffer.from(//removed new
            "174379"+
            "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
            +timestamp
        ).toString("base64");
        request({
            url:url,
            method:"POST",
            headers:{
                Authorization:auth,

            },
            json:{
                BusinessShortCode:"174379",
                Password:password,
                Timestamp:timestamp,
                TransactionType:"CustomerPayBillOnline",
                Amount:1,
                PartyA:"254797565461",
                PartyB:"174379",
                PhoneNumber:"254797565461",
                CallBackURL:"https://mydomain.com/path",
                AccountReference:"Soni Investements",
                TransactionDesc:"Mpesa Daraja API stk push test ",
            
    
        },
        },
    function(error,response,body){
        if(error){
            console.log(error);

        }else{
            console.log("Request is successful.Please enter MPESA pin");
            res.status(200).json(body);
        }
    }
        );
    })
    .catch((error) => {//ensured that error is more descriptive
            console.error(error);
            res.status(500).send("Failed to fetch access token");
        });
});
app.get("/registerurl",(req,res)=>{
    getAccessToken()
    .then((accessToken)=>{
        let url="https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
        let auth=`Bearer ${accessToken}`;
        request({
            url:url,
            method:"POST",
            headers:{
                Authorization:auth,
            },
            json:{
                ShortCode:"174379",
                ResponseType:"Completed",
                ConfirmationURL:"https://mydomain.com/confirmation",
                ValidationURL:"https://mydomain.com/validation",
            },
        },
    function(error,response,body){
        if(error){
            console.log(error);
            res.status(500).send("Error registering URL");//proper error handling

        }
        res.status(200).json(body)
    
}
);
    })
   
});
function getAccessToken(){
    const consumer_key="GTCVhX9SoFaNcZHjQV7FvTLXTkhkTd9WNi2GYGD0LNinCJrZ";
    const consumer_secret="w5IKb0IyGlOGdPdguG6Q8eLpzz3gHJxMCkSY5SxYWsBKtJAmTCjmz8snZ8h1oVBC";
    //const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";removed url because it is taken care of in path
    const auth=
    new Buffer.from(consumer_key+":"+consumer_secret).toString("base64");
     
    const options = {
        hostname: 'sandbox.safaricom.co.ke',
        path: '/oauth/v1/generate?grant_type=client_credentials',
        method: 'GET',
        headers: {
            Authorization: `Basic ${auth}`//spacing
        }
    };
    return new Promise((resolve,reject)=>{

    const req = https.request(options, function(res) {//used https.request instead of http.request since its giving an error on the server
        let data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            const response = JSON.parse(data);
            if(response.access_token){
             resolve(response.access_token);
    }else{
        reject(new Error('Failed to fetch access token'));
    }
});
    });

    req.on('error',(error)=>{
        reject(error);
    });

    req.end();
});
}

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});