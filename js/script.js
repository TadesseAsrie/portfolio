document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  const navLinkItems = document.querySelectorAll(".nav-link");

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeToggle.style.transform = "rotate(360deg)";
    setTimeout(() => {
      themeToggle.style.transform = "rotate(0deg)";
    }, 300);
  });

  mobileMenuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active")
      ? "hidden"
      : "";
  });

  navLinkItems.forEach((link) => {
    link.addEventListener("click", (e) => {
      navLinkItems.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      if (window.innerWidth <= 968) {
        navLinks.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "-100px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinkItems.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  const animateOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  };

  const scrollObserver = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  const animatedElements = document.querySelectorAll(
    ".skill-card, .project-card, .contact-item"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    scrollObserver.observe(el);
  });

  const progressBars = document.querySelectorAll(".progress-bar");
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progress = entry.target.getAttribute("data-progress");
          entry.target.style.width = `${progress}%`;
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));

  const statNumbers = document.querySelectorAll(".stat-number");

  const animateCount = (element) => {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCount = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target;
      }
    };

    updateCount();
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => statsObserver.observe(stat));

  // const contactForm = document.getElementById("contactForm");
  // contactForm.addEventListener("submit", (e) => {
  //   e.preventDefault();

  //   const formData = {
  //     name: document.getElementById("name").value,
  //     email: document.getElementById("email").value,
  //     subject: document.getElementById("subject").value,
  //     message: document.getElementById("message").value,
  //   };
  //     const serviceID = "service_orpnigx";
  //     const templateID = "template_chkbwaj";
  //     emailjs
  //       .send(serviceID, templateID, formData)
  //       .then((res) => {
  //         document.getElementById("name").value = "";
  //         document.getElementById("email").value = "";
  //         document.getElementById("subject").value = "";
  //         document.getElementById("message").value = "";

  //       })
  //       .catch((err) => console.log(err));

  //   const button = contactForm.querySelector('button[type="submit"]');
  //   const originalText = button.textContent;
  //   button.textContent = "Sending...";
  //   button.disabled = true;

  //   setTimeout(() => {
  //     button.textContent = "Message Sent!";
  //     button.style.background =
  //       "linear-gradient(135deg, #10b981 0%, #059669 100%)";

  //     setTimeout(() => {
  //       contactForm.reset();
  //       button.textContent = originalText;
  //       button.disabled = false;
  //       button.style.background = "";
  //     }, 2000);
  //   }, 1500);

  //   // console.log("Form submitted:", formData);
  // });

 


const contactForm = document.getElementById("contactForm");
const LOCAL_STORAGE_KEY = "offlineEmails";
const MAX_OFFLINE_EMAILS = 50; // Prevent unlimited storage

// Function to validate form data
function validateFormData(data) {
  return (
    data.name &&
    data.email &&
    data.message &&
    data.name.trim() &&
    data.email.trim() &&
    data.message.trim()
  );
}

// Function to check if email is duplicate
function isDuplicateEmail(newEmail, existingEmails) {
  return existingEmails.some(
    (email) =>
      email.name === newEmail.name &&
      email.email === newEmail.email &&
      email.message === newEmail.message
  );
}

// Function to save email data to local storage with error handling
function saveOfflineEmail(data) {
  try {
    if (!validateFormData(data)) {
      throw new Error("Invalid form data");
    }

    const emails = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");

    // Check for duplicates
    if (isDuplicateEmail(data, emails)) {
      console.warn("Duplicate email detected, not saving");
      return false;
    }

    // Prevent storage from growing indefinitely
    if (emails.length >= MAX_OFFLINE_EMAILS) {
      emails.shift(); // Remove oldest email
    }

    emails.push({
      ...data,
      timestamp: new Date().toISOString(), // Add timestamp for tracking
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emails));
    console.log("Email saved offline:", data);
    return true;
  } catch (error) {
    console.error("Failed to save offline email:", error);
    return false;
  }
}

// Function to send a single email and remove it if successful
async function sendSingleEmail(emailData) {
  const serviceID = "service_orpnigx";
  const templateID = "template_chkbwaj";

  try {
    const res = await emailjs.send(serviceID, templateID, emailData);
    console.log("SUCCESSFULLY SENT OFFLINE EMAIL:", emailData);
    return true;
  } catch (err) {
    console.error("FAILED to send offline email:", err);
    return false;
  }
}

// Function to resend all stored emails
async function resendOfflineEmails() {
  try {
    const emails = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    if (emails.length === 0) return;

    console.log(`Attempting to resend ${emails.length} stored email(s)...`);
    const successfulSends = [];

    // Process emails sequentially to avoid rate limiting
    for (let i = 0; i < emails.length; i++) {
      const success = await sendSingleEmail(emails[i]);
      if (success) {
        successfulSends.push(i);
      }
    }

    // Remove successfully sent emails from the stored list
    if (successfulSends.length > 0) {
      const newEmails = emails.filter(
        (_, index) => !successfulSends.includes(index)
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEmails));
      console.log(`Successfully resent ${successfulSends.length} email(s)`);

      // Only show alert if user is likely interacting with the page
      if (document.visibilityState === "visible") {
        alert(`${successfulSends.length} message(s) resent successfully.`);
      }
    }
  } catch (error) {
    console.error("Error during offline email resend:", error);
  }
}

// Update button state with better feedback
function updateButtonState(button, text, background = "", isDisabled = false) {
  button.textContent = text;
  button.disabled = isDisabled;
  if (background) {
    button.style.background = background;
  } else {
    button.style.background = "";
  }
}

// Reset form and button after operation
function resetFormAndButton(contactForm, button, originalText) {
  contactForm.reset();
  updateButtonState(button, originalText, "", false);
}

// ===================================
// 2. GLOBAL EVENT LISTENERS
// ===================================
window.addEventListener("online", resendOfflineEmails);
document.addEventListener("DOMContentLoaded", resendOfflineEmails);

// ===================================
// 3. MAIN FORM SUBMIT LISTENER
// ===================================
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  // Validate required fields
  if (!formData.name || !formData.email || !formData.message) {
    alert("Please fill in all required fields: Name, Email, and Message");
    return;
  }

  const button = contactForm.querySelector('button[type="submit"]');
  const originalText = button.textContent;

  // 1. Initial State: Indicate sending is in progress
  updateButtonState(
    button,
    "Sending...",
    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    true
  );

  try {
    if (!navigator.onLine) {
      // OFFLINE PATH
      const saveSuccess = saveOfflineEmail(formData);

      if (saveSuccess) {
        updateButtonState(
          button,
          "Saved for offline send! 💾",
          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          true
        );

        setTimeout(() => {
          resetFormAndButton(contactForm, button, originalText);
        }, 2000);
      } else {
        throw new Error("Failed to save offline email");
      }
    } else {
      // ONLINE PATH
      const serviceID = "service_orpnigx";
      const templateID = "template_chkbwaj";

      await emailjs.send(serviceID, templateID, formData);

      // SUCCESS LOGIC
      updateButtonState(
        button,
        "Message Sent! 🎉",
        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        true
      );

      setTimeout(() => {
        resetFormAndButton(contactForm, button, originalText);
      }, 2000);
    }
  } catch (err) {
    // ERROR LOGIC
    console.error("Email operation failed:", err);

    updateButtonState(
      button,
      "Failed to Send 😟",
      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      true
    );

    setTimeout(() => {
      updateButtonState(button, originalText, "", false);

      if (navigator.onLine) {
        alert("The message could not be sent. Please try again.");
      }
    }, 2000);
  }
});


  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
  //create custom cursor

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0;
  `;

  if (window.innerWidth > 968) {
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX - 10 + "px";
      cursor.style.top = e.clientY - 10 + "px";
      cursor.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    const interactiveElements = document.querySelectorAll(
      "a, button, .project-card, .skill-card"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(1.5)";
        cursor.style.borderColor = "var(--accent)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
        cursor.style.borderColor = "var(--primary)";
      });
    });
  }

  const parallaxElements = document.querySelectorAll(
    ".hero-image, .floating-shapes"
  );
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach((el) => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Attach the function to the 'scroll' event
  window.addEventListener("scroll", handleScroll);

  // Optional: Run on load in case the page loads scrolled
  handleScroll();
});
