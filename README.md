# 📋 Tasks API

API REST em Node.js puro para gerenciamento de tarefas (CRUD completo).

## 🚀 Tecnologias
- Node.js (sem frameworks)
- csv-parse

## 📌 Rotas

| Método | Rota                    | Descrição                        |
|--------|-------------------------|----------------------------------|
| GET    | /tasks                  | Lista todas as tarefas           |
| POST   | /tasks                  | Cria uma nova tarefa             |
| PUT    | /tasks/:id              | Atualiza uma tarefa              |
| DELETE | /tasks/:id              | Remove uma tarefa                |
| PATCH  | /tasks/:id/complete     | Marca/desmarca como concluída    |

## ▶️ Como rodar

```bash
npm install
npm run dev
```

## 📥 Importar CSV

Com o servidor rodando:

```bash
node import-csv.js
```
