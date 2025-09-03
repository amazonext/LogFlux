from flask import Flask, request, render_template, jsonify
import os
from collections import defaultdict

app = Flask(__name__)

# Palavras que queremos monitorar
palavras_desejadas = {"INFO", "WARN", "ERROR", "DEBUG", "SEC"}
linhas_por_tag = defaultdict(list)

def mapear_arquivo(conteudo_arquivo, tags_filtradas):
    # Limpamos os dados da análise anterior
    linhas_por_tag.clear()
    pares = []
    
    # Processamos o conteúdo do arquivo que veio da requisição
    for linha in conteudo_arquivo.splitlines():
        palavras = linha.strip().split()
        for palavra in palavras:
            palavra_limpa = palavra.strip('.,;:!?()[]{}').upper()
            if palavra_limpa in tags_filtradas:
                # Guarda a linha completa para a funcionalidade de busca
                linhas_por_tag[palavra_limpa].append(linha.strip())
                # Gera um par (TAG, 1) para o MapReduce
                pares.append((palavra_limpa, 1))
    return pares

def embaralhar(pares):
    agrupado = defaultdict(list)
    for chave, valor in pares:
        agrupado[chave].append(valor)
    return agrupado

def reduzir(agrupado):
    resultado = {}
    for chave, valores in agrupado.items():
        resultado[chave] = sum(valores)
    return resultado

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/processar", methods=["POST"])
def processar_log():
    try:
        arquivo = request.files.get("arquivo")
        if not arquivo:
            return jsonify({"erro": "Nenhum arquivo enviado"}), 400

        tags_selecionadas = request.form.getlist("tags")
        if not tags_selecionadas:
            tags_selecionadas = list(palavras_desejadas)

        conteudo = arquivo.read().decode('utf-8', errors='ignore')

        pares = mapear_arquivo(conteudo, set(tags_selecionadas))
        agrupado = embaralhar(pares)
        resultado = reduzir(agrupado)
        
        return jsonify({"resultado": resultado})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/buscar/<tag>")
def buscar_na_tag(tag):
    termo = request.args.get("q", "").lower()
    resultados_filtrados = []
    tag_upper = tag.upper()

    if tag_upper in linhas_por_tag:
        for linha in linhas_por_tag[tag_upper]:
            if termo in linha.lower():
                resultados_filtrados.append(linha)
    
    return jsonify({"resultados": resultados_filtrados})

if __name__ == "__main__":
    app.run(debug=True)