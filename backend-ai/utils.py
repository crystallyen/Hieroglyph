import re

def segment(text: str) -> list[str]:
  normalized_text = re.sub(r'\s+', ' ', text.strip())
  sentences = re.split(r'(?<=[.!?])(?:\s+|(?=[A-Z]))', normalized_text)
  processed_sentences = []
  for s in sentences:
    if re.search(r'\b\w+\.\s*\w+\.', s):
      sub_sentences = re.split(r'(?<=\.)\s*(?=\w)', s)
      processed_sentences.extend([sub.strip() for sub in sub_sentences if sub.strip()])
    else:
      processed_sentences.append(s.strip())
  
  return [s for s in processed_sentences if s]

def stitch(text: list[str]) -> str:
  return " ".join(text)

def strip(text: str) -> str:
  cleaned = re.sub(r'[\n\t]+', ' ', text)
  cleaned = re.sub(r'\s{2,}', ' ', cleaned)
  return cleaned.strip()

def fix_bullets(text: str) -> str:
  out_text = text.replace("- ", "\n- ")
  return out_text

def long_segment(paragraph: str) -> list[str]:
  paragraph = paragraph.strip()
  paragraph = re.sub(r'\s+', ' ', paragraph)
  
  if len(paragraph.split()) <= 300:
    return [paragraph]

  segments = segment(paragraph)
  chunks = []
  current_chunk = []
  current_length = 0

  for sentence in segments:
    sentence_len = len(sentence.split())
    
    if sentence_len > 300:
      if current_chunk:
        chunks.append(stitch(current_chunk))
        current_chunk = []
        current_length = 0
      
      words = sentence.split()
      part = []
      part_length = 0
      
      for word in words:
        if part_length + 1 > 300:
          chunk_text = " ".join(part) + "."
          chunks.append(chunk_text)
          part = [word]
          part_length = 1
        else:
          part.append(word)
          part_length += 1
      
      if part:
        last_part = " ".join(part)
        if not last_part[-1] in ".!?":
          last_part += "."
        chunks.append(last_part)
      
      continue
        
    if current_length + sentence_len > 300 and current_chunk:
      chunks.append(stitch(current_chunk))
      current_chunk = [sentence]
      current_length = sentence_len
    else:
      current_chunk.append(sentence)
      current_length += sentence_len

  if current_chunk:
    chunks.append(stitch(current_chunk))

  return chunks