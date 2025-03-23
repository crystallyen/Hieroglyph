from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

model_name = "google/flan-t5-base"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to("cuda" if torch.cuda.is_available() else "cpu")

def summarize(prompt: str) -> str:
  prompt = "summarize: " + prompt
  return generate(prompt)

def translate(prompt: str) -> str:
  prompt = "translate English to French: " + prompt
  return generate(prompt)

def generate(prompt):
    input_tokens = tokenizer(prompt, return_tensors="pt").input_ids.to(model.device)
    output_tokens = model.generate(input_tokens, max_length=5000, num_beams=5, early_stopping=True)
    output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)
    return output_text