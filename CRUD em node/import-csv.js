import { parse } from 'csv-parse'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.resolve(__dirname, 'tasks.csv')

async function importCSV() {
    const parser = fs.createReadStream(csvPath).pipe(
        parse({
            delimiter: ',',
            skipEmptyLines: true,
            fromLine: 2, // pula o header (linha 1)
            columns: ['title', 'description'], // nomeia as colunas automaticamente
        })
    )

    for await (const record of parser) {
        const { title, description } = record

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        })
            .then(res => {
                if (res.ok) {
                    console.log(`✅ Tarefa criada: "${title}"`)
                } else {
                    console.error(`❌ Erro ao criar "${title}" — status ${res.status}`)
                }
            })
            .catch(err => {
                console.error(`❌ Falha na requisição para "${title}":`, err.message)
            })
    }

    console.log('\n🎉 Importação concluída!')
}

importCSV()
