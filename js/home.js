document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  const helpMenu = document.getElementById("help-menu");
  const ghostMsg = document.getElementById("ghost-msg");
  
  let ghostTimeout;

  function showGhost(text) {
    ghostMsg.textContent = text;
    ghostMsg.classList.add("show");
    clearTimeout(ghostTimeout);
    ghostTimeout = setTimeout(() => {
      ghostMsg.classList.remove("show");
    }, 2000);
  }

  function navigate(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 400ms ease';
    setTimeout(() => {
      window.location.href = url;
    }, 420);
  }

  input.addEventListener("input", () => {
    if (input.value.trim().toLowerCase() === "/help") {
      helpMenu.classList.add("show");
    } else {
      helpMenu.classList.remove("show");
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      if (val === "yourwork" || val === "work") {
        navigate("work.html");
      } else if (val === "aboutyou" || val === "about") {
        navigate("about.html");
      } else if (val === "yourideas" || val === "ideas") {
        navigate("ideas.html");
      } else if (val === "downloadcv" || val === "cv") {
        const a = document.createElement("a");
        a.href = "CV.pdf";
        a.download = "Aarish_CV.pdf";
        a.click();
        showGhost("downloading CV.pdf...");
        input.value = "";
      } else if (val === "/help") {
        helpMenu.classList.add("show");
      } else {
        showGhost("command not found. type /help for options");
      }
    }
  });
});
