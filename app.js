const express = require("express");
const bodyParser = require("body-parser");
const Date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/CustomersDb", {useNewUrlParser: true, useUnifiedTopology: true });

const customerSchema = {
    id: Number,
    name: String,
    email: String,
    balance: Number
};

const customer = mongoose.model("customer", customerSchema);

// const c2 = new customer({
//     id:2,
//     name: "Arindam",
//     email: "arindamsingha@gmail.com",
//     balance: 15000
// });
// const c3 = new customer({
//     id:3,
//     name: "Ayushaman",
//     email: "ayushman@gmail.com",
//     balance: 35000
// });
// const c4 = new customer({
//     id:4,
//     name: "Mrigank",
//     email: "mrigank@gmail.com",
//     balance: 25000
// });
// const c5 = new customer({
//     id:5,
//     name: "Samarth",
//     email: "samarth@gmail.com",
//     balance: 75000
// });
// const c6 = new customer({
//     id:6,
//     name: "Krrish",
//     email: "krrish@gmail.com",
//     balance: 55600
// });
// const c7 = new customer({
//     id:7,
//     name: "Anmol",
//     email: "anmol@gmail.com",
//     balance: 49500
// });
// const c8 = new customer({
//     id:8,
//     name: "Vinay",
//     email: "vinay@gmail.com",
//     balance: 22000
// });
// const c9 = new customer({
//     id:9,
//     name: "Agneya",
//     email: "agneya@gmail.com",
//     balance: 69000
// });
// const c10 = new customer({
//     id:10,
//     name: "Ayush",
//     email: "ayush@gmail.com",
//     balance: 99500
// });
// allCustomers = [c2,c3,c4,c5,c6,c7,c8,c9,c10]
// customer.insertMany(allCustomers, function(err){
//     if(err)
//         console.log(err);
//     else
//         console.log("successfully updated");
// });
const today = Date.getDate();
app.get("/", function(req,res){
    res.render('home',{date: today});
})

app.get("/home", function(req,res){
    res.redirect("/")
})

app.get("/customers", function(req,res){
    customer.find({},function(err,result){
        if(err)
            console.log(err);
        else
            // allCustomers=result;
            res.render("customers",{all: result, date: today});
    })
    
})

app.get("/transfer", function(req,res){
    customer.find({},function(err,result){
        if(err)
            console.log(err);
        else
            // allCustomers=result;
            res.render("transfer",{all: result, date: today});
    })
    
})

let msg = "";
app.post("/send_money", function(req,res){

    const c_id = req.body.custom_id;
    // console.log(c_id);
    customer.find({},function(err,result){
        if(err)
            console.log(err);
        else
            res.render("send_money",{all: result, date: today, c_id: c_id, msg: msg});
    })
})

app.post("/changes", function(req,res){

    const s_id = req.body.sender;
    const r = req.body.reciever;
    const amt = req.body.amt;
    console.log(amt);
    customer.findOne({id: {$eq: s_id}}, function(err,result){
        if(!err){
            if(result.balance >= amt){
                // console.log(result.balance);
                let b = result.balance - amt;
                customer.updateOne({id: {$eq: s_id}}, {$set : {balance: b}}, function(err){
                    if(err)
                        console.log(err);
                });
                // console.log(b);
                customer.updateOne({name:{$eq: r}}, { $inc: { balance: amt }}, function(err){
                    if(err)
                        console.log(err);
                });
                // console.log(r);
                res.redirect("/customers");
            }
            else{
                customer.find({},function(err,result1){
                    msg = "Transaction Failed! Insufficient Balance.."
                    res.render("send_money",{all: result1, date: today, c_id: s_id, msg: msg});
                })    
            }
        }
        else{
            console.log(err);
        }
    })
})

app.listen(3000,function(){
    console.log("server started on port 3000");
})