import pandas as pd
import ast
import random

def preprocess_jfleg(jfleg_input, jfleg_output):
    # Load the dataset
    jfleg_df = pd.read_csv(jfleg_input)
    
    # Function to select a random correction among the first four elements
    def select_random_correction(correction):
        try:
            parsed = ast.literal_eval(correction) 
            if isinstance(parsed, list) and len(parsed) >= 4:
                return random.choice(parsed[:4])
            elif isinstance(parsed, list) and len(parsed) > 0:
                return parsed[0]
            return correction 
        except Exception:
            return correction  

    jfleg_df["corrections"] = jfleg_df["corrections"].apply(select_random_correction)
    
    # Rename columns
    jfleg_df.rename(columns={"sentence": "input_text", "corrections": "output_text"}, inplace=True)
    
    # Save processed dataset
    jfleg_df.to_csv(jfleg_output, index=False)

def preprocess_summarization(summarization_input, summarization_output, sample_size=15000):
    # Loading the dataset (assumes 2 columns)
    df = pd.read_csv(summarization_input)
    
    # Rename columns
    df.columns = ['input_text', 'output_text']
    
    # Compute summarization factor
    df['input_len'] = df['input_text'].str.len()
    df['output_len'] = df['output_text'].str.len()
    df['summarization_factor'] = df['output_len'] / df['input_len']
    
    # Filter rows where summarization factor <= 0.4
    df = df[df['summarization_factor'] <= 0.4]

    # Drop intermediate columns
    df = df.drop(columns=['input_len', 'output_len', 'summarization_factor'])

    # Sample if too many rows
    if len(df) > sample_size:
        df = df.sample(n=sample_size, random_state=42).reset_index(drop=True)

    # Save processed dataset
    df.to_csv(summarization_output, index=False)

import pandas as pd
import random

def preprocess_paws_wiki(paws_input, paws_output, sample_size=15000):
    # Load the dataset and filter for label == 0 only
    df = pd.read_csv(paws_input)
    df = df[df["label"] == 1].copy()
    df.rename(columns={"sentence1": "input_text", "sentence2": "output_text"}, inplace=True)

    # Compute input lengths
    df["input_length"] = df["input_text"].str.len()

    # Define bins
    bin0 = df[(df["input_length"] >   0) & (df["input_length"] <= 100)]
    bin1 = df[(df["input_length"] > 100) & (df["input_length"] <= 200)]
    per_bin = sample_size // 3  # 5000 for each bin

    # Sample from bins directly
    sampled_0_100 = bin0.sample(n=per_bin, random_state=42)
    sampled_100_200 = bin1.sample(n=per_bin, random_state=42)

    # Remove used rows to form pools
    pool0 = bin0.drop(sampled_0_100.index).copy()
    pool1 = bin1.drop(sampled_100_200.index).copy()

    # Create third bin (200–300) by concatenating remaining rows
    concat_rows = []
    random.seed(42)
    attempts = 0

    while len(concat_rows) < per_bin and attempts < per_bin * 20:
        if len(pool0) < 1 or len(pool1) < 1:
            print("Ran out of rows in pool0 or pool1.")
            break

        r1 = pool0.sample(n=1, random_state=random.randint(0, 1_000_000))
        r2 = pool1.sample(n=1, random_state=random.randint(0, 1_000_000))

        r1_idx = r1.index[0]
        r2_idx = r2.index[0]

        new_input = r1.iloc[0]["input_text"] + " " + r2.iloc[0]["input_text"]
        new_output = r1.iloc[0]["output_text"] + " " + r2.iloc[0]["output_text"]
        L = len(new_input)

        if 200 <= L <= 300:
            concat_rows.append({"input_text": new_input, "output_text": new_output})
            pool0 = pool0.drop(index=r1_idx)
            pool1 = pool1.drop(index=r2_idx)

        attempts += 1

    df_concat = pd.DataFrame(concat_rows)

    print(f"Sampled: {len(sampled_0_100)} (0–100), {len(sampled_100_200)} (100–200), {len(df_concat)} (200–300)")

    # Final assembly and save
    final_df = pd.concat([
        sampled_0_100[["input_text", "output_text"]],
        sampled_100_200[["input_text", "output_text"]],
        df_concat
    ], ignore_index=True)

    final_df.to_csv(paws_output, index=False)

def preprocess_bullet_points(bullet_input, bullet_output):
    df = pd.read_csv(bullet_input)

    # Rename columns: 'input'→'input_text', 'bullet'→'output_text'
    df.rename(columns={
        'input': 'input_text',
        'bullet': 'output_text'
    }, inplace=True)

    df.to_csv(bullet_output, index=False)


if __name__ == "__main__":
    # Define file paths (update these paths to your actual file locations)
    jfleg_input = "/Users/adithyasarma/Desktop/Dataset/jfleg.csv"
    jfleg_output = "/Users/adithyasarma/Desktop/Processed_Datasets/jfleg_processed.csv"

    summarization_input = "/Users/adithyasarma/Desktop/Dataset/summarization.csv"  # Raw CNN CSV file
    summarization_output = "/Users/adithyasarma/Desktop/Processed_Datasets/summarization_processed.csv"
    
    paws_input = "/Users/adithyasarma/Desktop/Dataset/paws_wiki.csv"     # Raw PAWS-Wiki CSV file
    paws_output = "/Users/adithyasarma/Desktop/Processed_Datasets/paws_wiki_processed.csv"

    bullet_input = "/Users/adithyasarma/Desktop/Dataset/bullet_points.csv"
    bullet_output = "/Users/adithyasarma/Desktop/Processed_Datasets/bullet_points_processed.csv"
    
    # Preprocess each dataset
    preprocess_jfleg(jfleg_input,jfleg_output)
    preprocess_summarization(summarization_input, summarization_output, sample_size=15000)
    preprocess_paws_wiki(paws_input, paws_output, sample_size=15000)
    preprocess_bullet_points(bullet_input,bullet_output)