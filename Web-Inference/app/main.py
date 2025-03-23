from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import summarize, translate

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
  text: str

@api.post("/summarize/")
def callSummarize(input_data : InputText):
  text = input_data.text
  result = summarize(text)
  return {"result": result}

@api.post("/translate/")
def callTranslate(input_data : InputText):
  text = input_data.text
  result = translate(text)
  return {"result": result}