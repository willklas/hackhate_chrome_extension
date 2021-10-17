from fastai.vision.all import *
import fastbook
fastbook.setup_book()
from fastbook import *
from fastai.text.all import *

from typing import Optional

from fastapi import Request, FastAPI, File, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

learn_clf = load_learner('/app/models/hate_speech_classifier.pkl', cpu=True)

class Item(BaseModel):
    text: str

def prediction(text):
    
    # print("text: ",text)
    test_string = tokenize1(text, BaseTokenizer(), rules=[replace_all_caps])
    preds = learn_clf.predict(test_string)

    return list(preds[0]), preds[1].detach().numpy().tolist(), preds[2].detach().numpy().tolist()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/prediction/")
async def read_item(resq: Request):
    
    req = await resq.json()
    # print("item: ", req['text'])
    # prediction(req['text'])
    labels, predictions, scores = prediction(req['text'])
    return {"text": req['text'], 
            "labels": labels,
            "predictions": predictions,
            "scores": scores
    }