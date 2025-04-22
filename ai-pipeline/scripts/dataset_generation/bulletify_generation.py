import requests
import time
import csv
import pandas as pd



API_KEY = "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"
MODEL = "mistral/ministral-8b"  
INPUT_CSV = "cnn_0_100.csv"
OUTPUT_CSV = "bullet1.csv"

def clean_text(text):
    return text.replace("(CNN) —", "").replace("(cnn) —", "").strip()



def bulletify_mistral(prompt, max_retries=3):
    length = len(prompt.split())
    bullet_range = ''
    if length < 150:
        bullet_rang = "3 to 4"
    elif length < 300:
        bullet_range = "4 to 6"
    else:
        bullet_range = "6 to 8"
    system_prompt = (
        f"You are a helpful assistant. Summarize the following text into concise bullet points. " \
        f"Use {bullet_range} bullets, with each bullet point being no longer than 1-2 sentences. " \
        f"Start each bullet with '- ' and place each bullet on a new line (<br>). " \
        f"Avoid repeating ideas."

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
            print(f" Attempt {attempt+1} failed: {e}")
        time.sleep(12)  
    return ""




df = pd.read_csv(INPUT_CSV)

results = []

for i, row in df.iterrows():
    article = row['article']
    print(f"Processing row {i+1}/{len(df)}...")
    bullet = bulletify_mistral(article)
    results.append({
        "article": article,
        "bullet": bullet
    })
    if (i + 1) % 10 == 0:
        pd.DataFrame(results).to_csv(OUTPUT_CSV, index=False)

pd.DataFrame(results).to_csv(OUTPUT_CSV, index=False)
print(f"Saved to {OUTPUT_CSV}")




