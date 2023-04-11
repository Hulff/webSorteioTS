"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.port || 8080;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "../public")));
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect("mongodb+srv://hugo:96762171@blogapp.m1mhh.mongodb.net/SorteioBookVillage?retryWrites=true&w=majority")
    .then(() => {
    console.log("Conectado a database no mongodb");
})
    .catch((err) => {
    console.log(err);
});
require("../models/registro");
const Insc = mongoose_1.default.model("Inscricao");
app.get("/", (req, res) => {
    res.redirect("/inscricao");
});
app.get("/error", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/pages/error.html"));
});
app.get("/parabens", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/pages/parabens.html"));
});
app.get("/inscricao", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/pages/insPage.html"));
});
app.get("/inscricaoError", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/pages/insPageError.html"));
});
app.get("/inscricaoError2", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/pages/insPageError2.html"));
});
app.get("/getData", (req, res) => {
    Insc.find()
        .sort({ nInscricao: -1 })
        .then((data) => {
        return res.send(data);
    });
});
app.get("/dataList", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/pages/data.html"));
});
app.post("/inscricaoPost", (req, res) => {
    let instagram = req.body.instagram;
    let nome = req.body.nome;
    let n;
    console.log(req.body);
    console.log(nome);
    console.log(instagram);
    if (instagram == "" || instagram == null || instagram == undefined) {
        return res.redirect("/inscricaoError");
    }
    if (nome == "" || nome == null || nome == undefined) {
        return res.redirect("/inscricaoError");
    }
    if (instagram.charAt(0) != "@") {
        instagram = "@" + instagram;
    }
    Insc.findOne({ instagram: instagram }).then((data) => {
        if (data) {
            console.log("insta já utilizado");
            return res.redirect("/inscricaoError2");
        }
        else {
            Insc.find()
                .sort({ nInscricao: -1 })
                .then((data) => {
                if (data.length != 0) {
                    console.log(data);
                    n = data[0].nInscricao;
                    let insc = {
                        instagram: instagram,
                        nome: nome,
                        nInscricao: n + 1,
                    };
                    new Insc(insc)
                        .save()
                        .then(() => {
                        return res.redirect("parabens");
                    })
                        .catch(() => {
                        return res.redirect("/error");
                    });
                }
                else {
                    console.log("sem data");
                    n = 1;
                    let insc = {
                        instagram: instagram,
                        nome: nome,
                        nInscricao: n,
                    };
                    new Insc(insc)
                        .save()
                        .then(() => {
                        return res.redirect("parabens");
                    })
                        .catch(() => {
                        res.redirect("/error");
                    });
                }
            });
        }
    }).catch(() => {
        return res.redirect("/error");
    });
});
app.listen(PORT, () => {
    console.log(`aplicação on em ${PORT}`);
});
