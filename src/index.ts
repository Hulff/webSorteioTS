import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";

const app = express();
const PORT = process.env.port || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname, "../public")));

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://hugo:96762171@blogapp.m1mhh.mongodb.net/SorteioBookVillage?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conectado a database no mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

require("../models/registro");
const Insc = mongoose.model("Inscricao");

app.get("/", (req, res) => {
  res.redirect("/inscricao")
});
app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/error.html"));
});
app.get("/parabens", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/parabens.html"));
});
app.get("/inscricao", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/insPage.html"));
});
app.get("/inscricaoError", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/insPageError.html"));
});
app.get("/inscricaoError2", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/insPageError2.html"));
});
app.get("/getData",(req,res)=>{
  Insc.find()
  .sort({ nInscricao: -1 })
  .then((data) => {
    return  res.send(data)
  })
})
app.get("/dataList",(req,res)=>{
  res.sendFile(path.join(__dirname, "../public/pages/data.html"));
})

app.post("/inscricaoPost", (req, res) => {
  let instagram: string = req.body.instagram;
  let nome: string = req.body.nome;
  let n: number;
  console.log(req.body);
  console.log(nome);
  console.log(instagram);

  type InscObj = {
    instagram: string;
    nome: string;
    nInscricao: number;
  };

  if (instagram == "" || instagram == null || instagram == undefined) {
    return  res.redirect("/inscricaoError");
  }
  if (nome == "" || nome == null || nome == undefined) {
    return  res.redirect("/inscricaoError");
  }
   if(instagram.charAt(0) != "@") {
    instagram = "@"+instagram
  }
  Insc.findOne({ instagram: instagram }).then((data) => {
    if (data) {
        console.log("insta já utilizado")
        return  res.redirect("/inscricaoError2");
    } else {
      Insc.find()
        .sort({ nInscricao: -1 })
        .then((data) => {
          if (data.length != 0) {
            console.log(data);
            n = data[0].nInscricao;
            let insc: InscObj = {
              instagram: instagram,
              nome: nome,
              nInscricao: n + 1,
            };
            new Insc(insc)
              .save()
              .then(() => {
                return  res.redirect("parabens");
              })
              .catch(() => {
                return   res.redirect("/error");
              });
          } else {
            console.log("sem data");
            n = 1;
            let insc: InscObj = {
              instagram: instagram,
              nome: nome,
              nInscricao: n,
            };
            new Insc(insc)
              .save()
              .then(() => {
                return  res.redirect("parabens");
              })
              .catch(() => {
                res.redirect("/error");
              });
          }
        });
    }
  }).catch(()=>{
    return  res.redirect("/error");
  });
});

app.listen(PORT, () => {
  console.log(`aplicação on em ${PORT}`);
});
