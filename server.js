const express = require("express");
const cors = require("cors");
const conexao = require("./db.js");

// import express from "express";
// import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
// {
//     "nome": "Pedro",
//     "curso": "Desenvolvimento de sistema"
// }

let ALUNOS = [
{id: 1, nome: "Alice", curso: "Desenvolvimento de Sistemas"},
{id: 2, nome: "Brenda", curso: "Redes"},
{id: 3, nome: "Brenno", curso: "Administração"},
{id: 4, nome: "Carlos", curso: "Desenvolvimento de sistemas"},
];

app.get("/",(req, res)=>{
    res.json({
        mensagem:"API alunos funcionando!"
    })
});

app.get("/alunos", async (req,res)=>{
    
    
    try {
        const [resultado] = await conexao.query("SELECT * FROM alunos;")
        res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensagem:"Erro ao buscar alunos"
        })
    };
    }
);

app.get("/alunos/:id", async (req,res)=>{
    const id = Number(req.params.id);

    try {
        const[resultado] = await conexao.query("SELECT * FROM alunos WHERE id = ?;", [id]);

        if (resultado.length === 0){
            return res.status(404).json({mensagem: "Aluno não encontrado"});
        }

        res.status(200).json(resultado[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({mensagem:"Erro ao buscar aluno"});
    }

    // ALTERAÇÃO: Removida a busca antiga no array ALUNOS que ficava abaixo do bloco try/catch para evitar o erro de requisição duplicada (ERR_HTTP_HEADERS_SENT).
});

app.post("/alunos/cadastrar", async (req,res)=>{ // ALTERAÇÃO: Adicionado 'async' para permitir await na consulta do banco de dados
    const {nome, curso} = req.body;

   if(!nome || !curso){
        return res.status(400).json({mensagem: "Nome e curso são obrigatórios"});
    }

    // ALTERAÇÃO: Substituído o cadastro em memória (ALUNOS.push) pela inserção direta no banco de dados MySQL
    try {
        const [resultado] = await conexao.query(`INSERT INTO alunos (nome, curso) VALUES ('${nome}', '${curso}');`);

        res.status(201).json({
            mensagem: "Aluno cadastrado com sucesso",
            id: resultado.insertId
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({mensagem: "Erro ao cadastrar aluno"});
    }
});

app.put("/alunos/:id", async (req, res)=>{ // ALTERAÇÃO: Adicionado 'async' para permitir await na consulta do banco de dados
    const id = Number(req.params.id);
    const {nome, curso} = req.body;

    if(!nome || !curso){
        return res.status(400).json({
            mensagem: "Nome e curso são obrigatórios"
        });
    }

    // ALTERAÇÃO: Substituída a atualização em memória (ALUNOS[indice]) pelo UPDATE no banco de dados MySQL
    try {
        const [resultado] = await conexao.query("UPDATE alunos SET nome = ?, curso = ? WHERE id = ?;", [nome, curso, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Aluno atualizado com sucesso"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({mensagem: "Erro ao atualizar aluno"});
    }
});

const PORTA = 3000;

app.listen(PORTA,()=>{

    console.log(`Servidor iniciado com sucesso!`);
    console.log(`http://localhost:${`${PORTA}`}`);
});