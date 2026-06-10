const rawCode = `import hashlib, math, time, json
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass, field

@dataclass
class InferencePacket:
    request_id: str
    prompt: str
    context: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    temperature: float = 0.18
    top_k: int = 5
    max_tokens: int = 1024

class NeuralOrchestrator:
    def __init__(self, model_name: str = "llm-neo-3.2", namespace: str = "knowledge-core") -> None:
        self.model_name = model_name
        self.namespace = namespace
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _embed(self, text: str) -> List[float]:
        seed = hashlib.md5(text.encode("utf-8")).hexdigest()
        return [(int(seed[i:i+2], 16) / 255.0) for i in range(0, 32, 2)]

    def _semantic_retrieve(self, query: str, top_k: int) -> List[Tuple[str, float]]:
        corpus = [
            "retrieval augmented generation with sparse-dense fusion",
            "latent attention routing for reasoning over long context",
            "token-aware memory compression in transformer systems",
        ]
        q_vec = self._embed(query)
        scored = []
        for doc in corpus:
            d_vec = self._embed(doc)
            score = sum(a * b for a, b in zip(q_vec, d_vec))
            scored.append((doc, score))
        return sorted(scored, key=lambda x: x[1], reverse=True)[:top_k]

    def _build_prompt(self, packet: InferencePacket, retrieved) -> str:
        evidence = "\\n".join([f"- {doc}" for doc, _ in retrieved])
        return f"[SYSTEM]\\nYou are a precise reasoning engine.\\n\\n[CONTEXT]\\n{evidence}\\n\\n[USER]\\n{packet.prompt}"

    def _generate(self, prompt: str, packet: InferencePacket) -> Dict[str, Any]:
        signature = hashlib.sha1((prompt + self.model_name).encode()).hexdigest()[:12]
        return {
            "model": self.model_name,
            "signature": signature,
            "confidence": round(0.91 - (packet.temperature * 0.1), 3),
        }

    def infer(self, packet: InferencePacket) -> Dict[str, Any]:
        retrieved = self._semantic_retrieve(packet.prompt, packet.top_k)
        prompt = self._build_prompt(packet, retrieved)
        return self._generate(prompt, packet)

def bootstrap():
    packet = InferencePacket(
        request_id="req_7f3a91",
        prompt="Who built this?",
        context=["portfolio_intro", "ai-systems"],
        temperature=0.18,
        top_k=3,
        max_tokens=384,
    )
    engine = NeuralOrchestrator(model_name="llm-neo-3.2", namespace="knowledge-core")
    return engine.infer(packet)
`;

const finalLines = `
if user.press == 'enter':
    website.open()
`;

const keywords = new Set(["from", "import", "class", "def", "return", "if", "in", "for", "else", "True", "False", "None", "not", "and", "or", "with", "as", "pass", "while", "lambda", "yield", "raise", "try", "except", "finally", "bootstrap", "infer", "_generate", "_build_prompt", "_semantic_retrieve", "_embed", "_fingerprint", "_cache", "__init__", "dataclass", "field", "sorted", "round", "zip", "sum", "@dataclass", "@staticmethod", "@property", "website.open()"]);
const tealWords = new Set(["model_name", "namespace", "packet", "retrieved", "evidence", "corpus", "scored", "score", "q_vec", "d_vec", "seed", "engine", "prompt", "signature", "str", "int", "float", "bool", "List", "Dict", "Any", "Tuple", "'enter'"]);

function getColorForToken(token) {
  if (keywords.has(token)) return "var(--keyword)";
  if (tealWords.has(token)) return "var(--teal)";
  if (/^\\d+(\\.\\d+)?$/.test(token)) return "var(--teal)"; // numbers
  if (/^["'].*["']$/.test(token)) return "var(--teal)"; // strings
  if (token.startsWith("#")) return "#444444"; // comments
  return "#cccccc"; // default
}

function tokenizeCode(code) {
  const tokens = [];
  let currentWord = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < code.length; i++) {
    const char = code[i];

    if (inString) {
      currentWord += char;
      if (char === stringChar && code[i - 1] !== "\\\\") {
        tokens.push({ text: currentWord, color: getColorForToken(currentWord) });
        currentWord = "";
        inString = false;
      }
    } else {
      if (char === '"' || char === "'") {
        if (currentWord) {
          tokens.push({ text: currentWord, color: getColorForToken(currentWord) });
          currentWord = "";
        }
        inString = true;
        stringChar = char;
        currentWord = char;
      } else if (/[a-zA-Z0-9_@]/.test(char) || (char === '.' && currentWord === "website")) {
        // 'website.open()' is a keyword
        currentWord += char;
      } else if (char === '(' && currentWord === "website.open") {
         currentWord += char;
      } else if (char === ')' && currentWord === "website.open(") {
         currentWord += char;
      } else {
        if (currentWord) {
          tokens.push({ text: currentWord, color: getColorForToken(currentWord) });
          currentWord = "";
        }
        tokens.push({ text: char, color: "#cccccc" });
      }
    }
  }
  if (currentWord) {
    tokens.push({ text: currentWord, color: getColorForToken(currentWord) });
  }

  // Convert string tokens to individual characters
  const charArray = [];
  for (const t of tokens) {
    for (let i = 0; i < t.text.length; i++) {
      charArray.push({ char: t.text[i], color: t.color });
    }
  }
  return charArray;
}

document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("code-display");
  const chars = tokenizeCode(rawCode);
  const finalChars = tokenizeCode(finalLines);
  
  let typingComplete = false;
  
  let prebuiltHTML = "";
  for(let i=0; i<chars.length; i++){
    if (chars[i].char === '\\n') {
      prebuiltHTML += "<br>";
    } else {
      prebuiltHTML += `<span style="color:${chars[i].color}; display:none" id="char-${i}">${chars[i].char}</span>`;
    }
  }
  
  // final lines
  const offset = chars.length;
  for(let i=0; i<finalChars.length; i++){
    if (finalChars[i].char === '\\n') {
      prebuiltHTML += "<br>";
    } else {
      prebuiltHTML += `<span style="color:${finalChars[i].color}; display:none" id="char-${offset+i}">${finalChars[i].char}</span>`;
    }
  }

  prebuiltHTML += `<span id="cursor">▌</span>`;
  prebuiltHTML += `<div id="ghost-prompt">press enter to continue_</div>`;

  display.innerHTML = prebuiltHTML;

  let currentIndex = 0;
  const totalChars = chars.length;
  const totalFinalChars = finalChars.length;

  function typeChar() {
    if (currentIndex < totalChars) {
      if (chars[currentIndex].char !== '\\n') {
         document.getElementById(`char-${currentIndex}`).style.display = "inline";
      }
      currentIndex++;
      setTimeout(typeChar, 18);
    } else {
      // Pause then type final lines
      setTimeout(typeFinalLines, 500);
    }
  }

  let finalIndex = 0;
  function typeFinalLines() {
    if (finalIndex < totalFinalChars) {
      if (finalChars[finalIndex].char !== '\\n') {
         document.getElementById(`char-${offset+finalIndex}`).style.display = "inline";
      }
      finalIndex++;
      setTimeout(typeFinalLines, 18);
    } else {
      document.getElementById('ghost-prompt').classList.add('show');
      typingComplete = true;
      document.getElementById('cursor').style.display = 'none';
    }
  }

  // Start typing
  setTimeout(typeChar, 500);

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && typingComplete) {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 400ms ease';
      setTimeout(() => { window.location.href = 'home.html'; }, 420);
    }
  });
});
