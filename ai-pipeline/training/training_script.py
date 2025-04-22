import torch
from transformers import AutoTokenizer, Trainer, TrainingArguments, AutoModelForSeq2SeqLM, GenerationConfig, BitsAndBytesConfig
from datasets import DatasetDict, Dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training, PeftModel
import os

device = "cuda" if torch.cuda.is_available() else "cpu"

# Preprocess Dataset

grammar_dataset = torch.load(os.path.join(".", "Tokenized_Datasets", "jfleg_tokenized.pt"), weights_only=False)
grammar_dataset = Dataset.from_dict(grammar_dataset)

print(f"length: {len(grammar_dataset)}")

def split_dataset(dataset, train_ratio=0.9, val_ratio=0.05, test_ratio=0.05, seed=39):
  if (train_ratio + val_ratio + test_ratio != 1):
    print("Ratio does not add up to 1")
    return None
  split1 = dataset.train_test_split(test_size=(1 - train_ratio), seed=seed)
  train_set = split1["train"]
  split2 = split1['test'].train_test_split(test_size=(test_ratio / (val_ratio + test_ratio)), seed=seed)
  val_set = split2["train"]
  test_set = split2["test"]
  return DatasetDict({
    'train': train_set,
    'val': val_set,
    'test': test_set
  })

grammar_dataset = split_dataset(grammar_dataset)

# Define configs

lora_config = LoraConfig(
  r=8,
  lora_alpha=16,
  target_modules=["q", "k", "v", "o"],
  lora_dropout=0.1,
  bias="none",
  task_type="SEQ_2_SEQ_LM"
)

bnb_config = BitsAndBytesConfig(
    load_in_8bit=True
)

# Train

def train_and_save(adaptor_name, dataset):
  model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base", quantization_config=bnb_config, device_map="auto")
  model = prepare_model_for_kbit_training(model)
  model = get_peft_model(model, lora_config)
  model.to(device)
  model.generation_config = GenerationConfig.from_pretrained("google/flan-t5-base")

  training_args = TrainingArguments(
    output_dir=f"./results/{adaptor_name}-traininfo",
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=10,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=10,
    label_names=['labels']
  )

  trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["val"],
  )

  trainer.train()
  trainer.save_model(f"./results/{adaptor_name}-model")
  model.save_pretrained(f"./results/{adaptor_name}-adaptor")
  test_results = trainer.evaluate(dataset["test"])
  print(f"Test Loss: {test_results['eval_loss']:.4f}")

train_and_save(adaptor_name='grammar', dataset=grammar_dataset)