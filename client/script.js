// Theme toggle — persisted in localStorage
const toggle = document.getElementById("themeToggle");

// Restore saved theme on every page load
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Contact form
document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const messageEl = document.getElementById("message");
    const statusEl = document.getElementById("status");
    const submitBtn = document.getElementById("submitBtn");

    const data = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        message: messageEl.value.trim(),
    };

    // Basic client-side guard
    if (!data.name || !data.email || !data.message) {
        statusEl.textContent = "Please fill in all fields.";
        statusEl.style.color = "red";
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    statusEl.textContent = "";

    try {
        const res = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
            statusEl.textContent = result.message;
            statusEl.style.color = "green";
            e.target.reset();
        } else {
            statusEl.textContent = result.message || "Something went wrong.";
            statusEl.style.color = "red";
        }
    } catch (err) {
        statusEl.textContent = "Network error — please try again.";
        statusEl.style.color = "red";
        console.error("Fetch error:", err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    }
});