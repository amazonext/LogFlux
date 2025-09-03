from flask import Flask, request, render_template
import os
from collections import defaultdict

app = Flask(__name__)

# Palavras que queremos monitorar
palavras_desejadas = {"INFO", "WARN", "ERROR", "DEBUG", "SEC"}
linhas_por_tag = defaultdict(list)  # Armazena as linhas onde cada tag aparece

# ---------------- MAP ----------------
def mapear_arquivo(nome_arquivo, tags_filtradas):
    linhas_por_tag.clear()  
    pares = []
    if not os.path.exists(nome_arquivo):
        raise FileNotFoundError(f"Arquivo {nome_arquivo} não encontrado")

    with open(nome_arquivo, 'r', encoding='utf-8') as f:
        for linha in f:
            palavras = linha.strip().split()
            for palavra in palavras:
                palavra_limpa = palavra.strip('.,;:!?()[]{}').upper()
                if palavra_limpa in tags_filtradas:
                    # Guarda a linha completa para futura busca
                    linhas_por_tag[palavra_limpa].append(linha.strip())
                    # Gera um par (TAG, 1) para o MapReduce
                    pares.append((palavra_limpa, 1))
    return pares

# ---------------- SHUFFLE ----------------
def embaralhar(pares):
    agrupado = defaultdict(list)
    for chave, valor in pares:
        agrupado[chave].append(valor)
    return agrupado

# ---------------- REDUCE ----------------
def reduzir(agrupado):
    resultado = {}
    for chave, valores in agrupado.items():
        resultado[chave] = sum(valores)  # conta quantas vezes apareceu
    return resultado

# ---------------- ROTA PRINCIPAL ----------------
@app.route("/", methods=["GET", "POST"])
def index():
    resultado = {}
    if request.method == "POST":
        arquivo = request.files["arquivo"]
        if arquivo:
            arquivo.save("temp.txt")
            tags_selecionadas = request.form.getlist("tags")
            if not tags_selecionadas:
                tags_selecionadas = list(palavras_desejadas)

            pares = mapear_arquivo("temp.txt", set(tags_selecionadas))
            agrupado = embaralhar(pares)
            resultado = reduzir(agrupado)
            os.remove("temp.txt")
    return render_template("index.html", resultado=resultado, tags=palavras_desejadas)

# ---------------- BUSCA DENTRO DE UMA TAG ----------------
@app.route("/buscar/<tag>")
def buscar(tag):
    termo = request.args.get("q", "").lower()
    resultados = []

    tag = tag.upper()

    if tag in linhas_por_tag:
        for i, linha in enumerate(linhas_por_tag[tag], start=1):
            if termo in linha.lower():
                resultados.append(f"Linha {i}: {linha.strip()}")
    return {"resultados": resultados}

if __name__ == "__main__":
    app.run(debug=True)
