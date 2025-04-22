import os
import pandas as pd
import torch
from transformers import T5Tokenizer

def tokenize_and_save(csv_file, output_pt, prefix, tokenizer_name='google/flan-t5-base', 
                        max_input_length=512, max_target_length=512):
    df = pd.read_csv(csv_file)
    # Load the tokenizer (using AutoTokenizer is also an option)
    tokenizer = T5Tokenizer.from_pretrained(tokenizer_name)
    
    # Prepend the prefix to each input_text value
    df['input_text'] = prefix + df['input_text'].astype(str)
    
    # Convert both input_text and output_text columns to string to avoid tokenization errors
    inputs = df['input_text'].astype(str).tolist()
    targets = df['output_text'].astype(str).tolist()
    
    # Tokenize inputs and targets
    model_inputs = tokenizer(inputs, max_length=max_input_length, 
                             truncation=True, padding='max_length', return_tensors='pt')
    labels = tokenizer(targets, max_length=max_target_length, 
                       truncation=True, padding='max_length', return_tensors='pt')
    
    # Set pad tokens to -100
    labels["input_ids"][labels["input_ids"] == tokenizer.pad_token_id] = -100

    # Add tokenized targets as labels
    model_inputs["labels"] = labels["input_ids"]
    
    # Save the tokenized data as a .pt file
    torch.save(model_inputs, output_pt)
    print(f"Tokenized data saved to {output_pt}")

def main():
    # Define paths for processed CSVs (make sure these exist)
    summarization_csv = "/Users/adithyasarma/Desktop/Processed_Datasets/summarization_processed.csv"
    paws_wiki_csv = "/Users/adithyasarma/Desktop/Processed_Datasets/paws_wiki_processed.csv"
    bullet_points_csv = "/Users/adithyasarma/Desktop/Processed_Datasets/bullet_points_processed.csv"
    jfleg_csv = "/Users/adithyasarma/Desktop/Processed_Datasets/jfleg_processed.csv"
    
    # Define output paths for tokenized data
    tokenized_dir = "./"
    os.makedirs(tokenized_dir, exist_ok=True)
    summarization_pt = os.path.join(tokenized_dir, "summarization_tokenized.pt")
    paws_wiki_pt = os.path.join(tokenized_dir, "paws_wiki_tokenized.pt")
    bullet_points_pt = os.path.join(tokenized_dir, "bullet_points_tokenized.pt")
    jfleg_pt = os.path.join(tokenized_dir, "jfleg_tokenized.pt")
    
    # Process each dataset with its respective prefix:
    # For CNN summarization, prefix with "summarize: "
    tokenize_and_save(summarization_csv, "./summarization_tokenized.pt", prefix="summarize: ")
    tokenize_and_save(paws_wiki_csv, paws_wiki_pt, prefix="paraphrase: ")
    tokenize_and_save(jfleg_csv, jfleg_pt, prefix="fix grammar: ")
    tokenize_and_save(bullet_points_csv, bullet_points_pt, prefix="bulletify: ")
    
if __name__ == "__main__":
    main()
