import requests
import time
import csv
import pandas as pd



API_KEY = "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"
MODEL = "mistral/ministral-8b"  
INPUT_CSV = "cnn_0_100.csv" #first file, has to be done for more
OUTPUT_CSV = "summ1.csv"

def clean_text(text):
    return text.replace("(CNN) —", "").replace("(cnn) —", "").strip()

def summarize_mistral(prompt, max_retries=3):
    system_prompt = (
        "You are a helpful AI assistant that provides concise summaries. Please summarize the following article to approximately 30% of its original length."

    )

    for attempt in range(max_retries):
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",  
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ]
                }
            )
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and data['choices']:
                    return clean_text(data['choices'][0]['message']['content'])
                else:
                    print(f"Attempt {attempt+1}: 'choices' missing in response: {data}")
            else:
                print(f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Attempt {attempt+1} failed: {e}")
        time.sleep(12)  
    return ""




df = pd.read_csv(INPUT_CSV)

results = []

for i, row in df.iterrows():
    article = row['article']
    print(f"Processing row {i+1}/{len(df)}...")
    summary = summarize_mistral(article)
    results.append({
        "article": article,
        "summary": summary
    })
    if (i + 1) % 10 == 0:
        pd.DataFrame(results).to_csv(OUTPUT_CSV, index=False)

pd.DataFrame(results).to_csv(OUTPUT_CSV, index=False)
print(f"Saved to {OUTPUT_CSV}")




