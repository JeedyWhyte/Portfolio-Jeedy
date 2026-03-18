/* ─── Custom Cursor ──────────────── */
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX - 5 + 'px';
      cursor.style.top = mouseY - 5 + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX - 18) * 0.12;
      ringY += (mouseY - ringY - 18) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    /* ─── Theme Toggle ───────────────── */
    const themeToggle = document.getElementById('themeToggle');
    const toggleSwitch = document.getElementById('toggleSwitch');
    const themeLabel = document.getElementById('themeLabel');
    let isLight = false;

    themeToggle.addEventListener('click', () => {
      isLight = !isLight;
      document.body.classList.toggle('light', isLight);
      toggleSwitch.classList.toggle('on', isLight);
      themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
    });

    /* ─── Active nav on scroll ───────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));

    /* ─── Contact Form ───────────────── */
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const status = document.getElementById('status');
      const btn = document.getElementById('submitBtn');

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all fields.';
        status.className = 'error';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending...';
      status.textContent = '';
      status.className = '';

      try {
        const res = await fetch('https://portfolio-jeedy.onrender.com/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();

        if (res.ok) {
          status.textContent = '✓ Message sent successfully.';
          status.className = 'success';
          e.target.reset();
        } else {
          status.textContent = data.message || 'Something went wrong.';
          status.className = 'error';
        }
      } catch {
        status.textContent = 'Network error — please try again.';
        status.className = 'error';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });