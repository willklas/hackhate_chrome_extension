from fastai.vision.all import *
import fastbook
fastbook.setup_book()
from fastbook import *
from fastai.text.all import *

from typing import Optional

from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

learn_clf = load_learner('/app/models/hate_speech_classifier.pkl', cpu=True)

class Item(BaseModel):
    text: str

def prediction(text):
    
    test_string = tokenize1(text, SpacyTokenizer())
    preds = learn_clf.predict(test_string)

    return list(preds[0]), preds[1].detach().numpy().tolist(), preds[2].detach().numpy().tolist()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/prediction/")
def read_item(item: Item):
    labels, predictions, scores = prediction(item.text)
    return {"text": item.text, 
            "labels": labels,
            "predictions": predictions,
            "scores": scores
    }





