from flask import Flask, request
from summarizer import Summarizer
from flask_cors import CORS
from keybert import KeyBERT
import json
import spacy

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

summarizer = Summarizer()
kw_model = KeyBERT(model='all-mpnet-base-v2')

@app.route('/paragraph' , methods = ['POST'])
def paragraph():
    data = json.loads(request.data)
    summary = summarizer(data['article'], min_length=data['min_length'])
    summary = ''.join(summary)
    return summary

@app.route('/key_words' , methods = ['POST'])
def key_words():
    data = json.loads(request.data)
    keywords = kw_model.extract_keywords(data['article'], keyphrase_ngram_range=(1, 3),  stop_words='english', highlight=False,top_n=data['min_words'])
    keywords_list= ', '.join(list(dict(keywords).keys()))
    return keywords_list

@app.route('/key_sentences' , methods = ['POST'])
def key_sentences():
    data = json.loads(request.data)
    doc = nlp(data['article'])
    word_dict = {}
    for word in doc:
        word = word.text.lower()
        if word in word_dict:
            word_dict[word] += 1
        else:
            word_dict[word] = 1
    sents = []
    sent_score = 0
    for index, sent in enumerate(doc.sents):
        for word in sent:
            word = word.text.lower()
            sent_score += word_dict[word]
        sents.append((sent.text.replace("\n", " "), sent_score/len(sent), index))
    sents = sorted(sents, key=lambda x: -x[1])
    sents = sorted(sents[:data['min_sentences']], key=lambda x: x[2])
    summary_text = ""
    for sent in sents:
        summary_text += sent[0] + " "
    return summary_text

if __name__ == "__main__":
    app.run(debug=True)

