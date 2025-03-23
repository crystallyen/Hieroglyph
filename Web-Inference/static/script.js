const API_URL = "http://127.0.0.1:8000/"

async function model_summarize() {
  const text = document.getElementById("textInput").value;
  const resultBox = document.getElementById("result")
  resultBox.innerText = "Processing..."
  const response = await fetch(
    API_URL + 'summarize/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text })
    }
  )

  const data = await response.json();
  resultBox.innerText = data.result;
}

async function model_translate() {
  const text = document.getElementById("textInput").value;
  const resultBox = document.getElementById("result")
  resultBox.innerText = "Processing..."
  const response = await fetch(
    API_URL + 'translate/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text })
    }
  )

  const data = await response.json();
  resultBox.innerText = data.result;
}