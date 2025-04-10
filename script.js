document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("resumeFile");
  const customLabel = document.getElementById("customFileLabel");

  fileInput.addEventListener("change", () => {
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "📄 Choose PDF Resume";
    customLabel.textContent = `📎 ${fileName}`;
  });
  const form = document.getElementById("uploadForm");
  form?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const spinner = document.getElementById("loadingSpinner");
     const resultsDiv = document.getElementById("internshipResults");
    const file = document.getElementById("resumeFile").files[0];
    if (!file) {
      alert("Please upload a file");
      return;
    }
    
    const formData = new FormData();
    formData.append("resume", file);

    spinner.style.display = "block";
    resultsDiv.innerHTML = "";

    try {
      const res = await fetch(`https://repomate-backend.onrender.com/api/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      spinner.style.display = "none";
      const output = data.raw_output || "";

      const resultsDiv = document.getElementById("internshipResults");
      resultsDiv.innerHTML = "<h3 style='margin-bottom: 20px;'>Internship Matches</h3>";

      const blocks = output.split(/\n(?=\d+\.)/); // split on lines like '1. ...', '2. ...'

      blocks.forEach(block => {
        const lines = block.trim().split("\n");
        if (lines.length < 5) return;

        const [title, location, stipend, link, apply] = lines;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h4>${title}</h4>
          <p><strong>📍 Location:</strong> ${location.split(": ")[1]}</p>
          <p><strong>💰 Stipend:</strong> ${stipend.split(": ")[1]}</p>
          <p><strong>🔗 <a href="${link.split(": ")[1]}" target="_blank">View Internship</a></strong></p>
          <p><strong>🚀 <a href="${apply.split(":")[1]}" target="_blank">Apply Now</a></strong></p>
        `;
        resultsDiv.appendChild(card);
      });

    } catch (err) {
      spinner.style.display = "none";
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Check console.");
    }
  });
});

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("https://repomate-backend.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
  
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed!");
    }
  });
  
  document.getElementById("signupForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("https://repomate-backend.onrender.com/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
  
    const data = await res.json();
  
    if (res.ok) {
      alert("Signup successful! Redirecting to login...");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Signup failed!");
    }
  });
