from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, BitsAndBytesConfig
from peft import PeftModel
import torch

model_name = "google/flan-t5-base"

bnb_config = BitsAndBytesConfig(
    load_in_8bit=True
)

tokenizer = AutoTokenizer.from_pretrained(model_name)
device = "cuda" if torch.cuda.is_available() else "cpu"
base_model = AutoModelForSeq2SeqLM.from_pretrained(model_name, quantization_config=bnb_config, device_map="auto").to(device)
base_model = PeftModel.from_pretrained(base_model, "./adaptors/summarize-adaptor", adapter_name="summarize")
base_model.load_adapter("./adaptors/bulletify-adaptor", adapter_name="bulletify")
base_model.load_adapter("./adaptors/paraphrase-adaptor", adapter_name="paraphrase")
base_model.load_adapter("./adaptors/grammar-adaptor", adapter_name="proofread")
base_model.eval()

def summarize(prompt: str) -> str:
  base_model.set_adapter("summarize")
  formatted_prompt = "summarize: " + prompt
  input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
  output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
  output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)

  return output_text

def bulletify(prompt: str) -> str:
  base_model.set_adapter("bulletify")
  formatted_prompt = "bulletify: " + prompt
  input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
  output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
  output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)

  return output_text

def paraphrase(prompt: str) -> str:
  base_model.set_adapter("paraphrase")
  formatted_prompt = "paraphrase: " + prompt
  input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
  output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
  output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)

  return output_text

def proofread(prompt: str) -> str:
  base_model.set_adapter("proofread")
  formatted_prompt = "fix grammar: " + prompt
  input_tokens = tokenizer(formatted_prompt, return_tensors="pt").input_ids.to(base_model.device)
  output_tokens = base_model.generate(input_ids=input_tokens, max_length=5000, num_beams=1)
  output_text = tokenizer.decode(output_tokens[0], skip_special_tokens=True)

  return output_text