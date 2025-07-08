/* ---------- Constants & Helpers ---------- */
const qs = (sel) => document.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const STORAGE_KEYS = {
  RESUME_DATA: "resumeData",
  PHOTO: "resumePhoto",
  THEME: "resumeTheme",
  TEMPLATE: "resumeTemplate",
  COLOR_SCHEME: "resumeColorScheme",
};

/* ---------- State Management ---------- */
let appState = {
  currentTemplate: "classic",
  currentColorScheme: "blue",
  isDarkMode: false,
  isPreviewVisible: true,
  completionPercentage: 0,
};

/* ---------- Initialization ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  bindFormEvents();
  bindControls();
  loadSavedData();
  updateProgress();
  updateLastSavedTime();

  // Debug: Check if buttons are properly set up
  console.log("Add buttons found:", qsa(".addBtn").length);
  console.log("Remove buttons found:", qsa(".removeBtn").length);

  // On load, check auth
  if (isLoggedIn()) {
    hideAuthModal();
    showApp();
  } else {
    showAuthModal();
    hideApp();
  }
});

function initializeApp() {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    showNotification(
      "Local storage is not available. Your data will not be saved.",
      "error"
    );
    return;
  }

  // Set initial theme
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme === "true") {
    document.body.classList.add("dark");
    appState.isDarkMode = true;
  }

  // Set initial template
  const savedTemplate =
    localStorage.getItem(STORAGE_KEYS.TEMPLATE) || "classic";
  applyTemplate(savedTemplate);
  appState.currentTemplate = savedTemplate;

  // Set initial color scheme
  const savedColorScheme =
    localStorage.getItem(STORAGE_KEYS.COLOR_SCHEME) || "blue";
  applyColorScheme(savedColorScheme);
  appState.currentColorScheme = savedColorScheme;

  // Load saved photo
  const savedPhoto = localStorage.getItem(STORAGE_KEYS.PHOTO);
  if (savedPhoto) {
    setPhoto(savedPhoto);
  }
}

function isLocalStorageAvailable() {
  try {
    const test = "test";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------- Form Event Binding ---------- */
function bindFormEvents() {
  const form = qs("#resumeForm");

  // Real-time preview updates
  form.addEventListener("input", updatePreviewDebounced);

  // Single event listener for all button clicks using event delegation
  form.addEventListener("click", (e) => {
    console.log(
      "Form clicked, target:",
      e.target,
      "classes:",
      e.target.className
    );

    // Add button functionality
    if (e.target.classList.contains("addBtn") || e.target.closest(".addBtn")) {
      e.preventDefault();
      const button = e.target.classList.contains("addBtn")
        ? e.target
        : e.target.closest(".addBtn");
      console.log("Add button clicked:", button.dataset.section, button);
      addBlock(button.dataset.section);
    }

    // Remove button functionality
    if (
      e.target.classList.contains("removeBtn") ||
      e.target.closest(".removeBtn")
    ) {
      e.preventDefault();
      const button = e.target.classList.contains("removeBtn")
        ? e.target
        : e.target.closest(".removeBtn");
      const block = button.closest(
        ".edu-block, .exp-block, .proj-block, .cert-block"
      );
      console.log("Remove button clicked, button:", button, "block:", block);

      if (block && !block.classList.contains("template")) {
        block.remove();
        updatePreview();
        updateProgress();
        showSaveIndicator();
        console.log("Block removed successfully");
      } else {
        console.log("Could not remove block - template or not found");
      }
    }
  });

  // Auto-focus next input on Enter
  form.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const inputs = qsa("input,textarea", form);
      const i = inputs.indexOf(e.target);
      if (i > -1 && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    }
  });

  // Photo upload handling
  qs("#profilePicInput").addEventListener("change", handlePhotoUpload);
}

/* ---------- Debounced Preview Updates ---------- */
let debounceTimer;
function updatePreviewDebounced() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updatePreview();
    updateProgress();
    showSaveIndicator();
  }, 300);
}

function showSaveIndicator() {
  const saveIndicator = qs("#saveIndicator");
  const lastSavedText = qs("#lastSavedText");

  // Show saving indicator
  saveIndicator.style.display = "flex";
  lastSavedText.style.display = "none";

  // Save the data
  const success = saveToLocalStorage();

  // Hide indicator and show last saved time
  setTimeout(() => {
    saveIndicator.style.display = "none";
    lastSavedText.style.display = "block";

    if (success) {
      updateLastSavedTime();
    }
  }, 1000);
}

function updateLastSavedTime() {
  const lastSaved = localStorage.getItem("resumeLastSaved");
  const lastSavedText = qs("#lastSavedText");

  if (lastSaved) {
    const date = new Date(lastSaved);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      lastSavedText.textContent = "Just saved";
    } else if (diffInMinutes < 60) {
      lastSavedText.textContent = `Saved ${diffInMinutes} minute${
        diffInMinutes > 1 ? "s" : ""
      } ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      lastSavedText.textContent = `Saved ${diffInHours} hour${
        diffInHours > 1 ? "s" : ""
      } ago`;
    }
  } else {
    lastSavedText.textContent = "Not saved yet";
  }
}

/* ---------- Preview Generation ---------- */
function updatePreview() {
  updatePersonalInfo();
  updateSocialLinks();
  updateEducation();
  updateExperience();
  updateProjects();
  updateSkills();
  updateCertifications();
  saveToLocalStorage();
}

function updatePersonalInfo() {
  qs("#previewName").textContent = qs("#fullName").value || "Jane Doe";
  qs("#previewTitle").textContent =
    qs("#jobTitle").value || "Frontend Developer";
  qs("#previewEmail").innerHTML = `<i class="fas fa-envelope"></i> ${
    qs("#email").value || "jane@example.com"
  }`;
  qs("#previewPhone").innerHTML = `<i class="fas fa-phone"></i> ${
    qs("#phone").value || "+233 555 123 456"
  }`;
  qs("#previewLocation").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${
    qs("#location").value || "Accra, Ghana"
  }`;
  qs("#previewSummaryText").textContent =
    qs("#summary").value ||
    "Passionate developer with a knack for clean UI and robust code.";
}

function updateSocialLinks() {
  const socialContainer = qs("#previewSocial");
  socialContainer.innerHTML = "";

  const socialLinks = [
    { id: "linkedin", icon: "fab fa-linkedin", label: "LinkedIn" },
    { id: "github", icon: "fab fa-github", label: "GitHub" },
    { id: "portfolio", icon: "fas fa-globe", label: "Portfolio" },
    { id: "twitter", icon: "fab fa-twitter", label: "Twitter" },
  ];

  socialLinks.forEach((link) => {
    const url = qs(`#${link.id}`).value;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.innerHTML = `<i class="${link.icon}"></i> ${link.label}`;
      socialContainer.appendChild(a);
    }
  });
}

function updateEducation() {
  const eduUl = qs("#previewEducation ul");
  eduUl.innerHTML = "";

  qsa(".edu-block").forEach((block) => {
    const school = block.querySelector(".edu-school").value;
    const degree = block.querySelector(".edu-degree").value;
    const field = block.querySelector(".edu-field").value;
    const years = block.querySelector(".edu-years").value;
    const gpa = block.querySelector(".edu-gpa").value;
    const achievements = block.querySelector(".edu-achievements").value;

    if (school || degree) {
      const li = document.createElement("li");
      let content = `<strong>${degree || "Degree"}`;
      if (field) content += ` in ${field}`;
      content += `</strong><br>${school || "School"}`;
      if (years) content += ` • ${years}`;
      if (gpa) content += ` • GPA: ${gpa}`;
      if (achievements) content += `<br><small>${achievements}</small>`;
      li.innerHTML = content;
      eduUl.appendChild(li);
    }
  });
}

function updateExperience() {
  const expUl = qs("#previewExperience ul");
  expUl.innerHTML = "";

  qsa(".exp-block").forEach((block) => {
    const company = block.querySelector(".exp-company").value;
    const role = block.querySelector(".exp-role").value;
    const years = block.querySelector(".exp-years").value;
    const location = block.querySelector(".exp-location").value;
    const desc = block.querySelector(".exp-desc").value;

    if (company || role) {
      const li = document.createElement("li");
      let content = `<strong>${role || "Position"}</strong><br>${
        company || "Company"
      }`;
      if (years) content += ` • ${years}`;
      if (location) content += ` • ${location}`;
      if (desc) content += `<br>${desc}`;
      li.innerHTML = content;
      expUl.appendChild(li);
    }
  });
}

function updateProjects() {
  const projUl = qs("#previewProjects ul");
  projUl.innerHTML = "";

  qsa(".proj-block").forEach((block) => {
    const name = block.querySelector(".proj-name").value;
    const tech = block.querySelector(".proj-tech").value;
    const url = block.querySelector(".proj-url").value;
    const github = block.querySelector(".proj-github").value;
    const desc = block.querySelector(".proj-desc").value;

    if (name) {
      const li = document.createElement("li");
      let content = `<strong>${name}</strong>`;
      if (tech) content += ` • ${tech}`;
      if (url || github) {
        content += "<br>";
        if (url) content += `<a href="${url}" target="_blank">Live Demo</a>`;
        if (url && github) content += " • ";
        if (github) content += `<a href="${github}" target="_blank">GitHub</a>`;
      }
      if (desc) content += `<br>${desc}`;
      li.innerHTML = content;
      projUl.appendChild(li);
    }
  });
}

function updateSkills() {
  const technicalSkills = qs("#technicalSkills").value;
  const softSkills = qs("#softSkills").value;
  const languages = qs("#languages").value;

  qs("#previewTechnicalSkills").textContent =
    technicalSkills || "HTML · CSS · JavaScript";
  qs("#previewSoftSkills").textContent =
    softSkills || "Communication · Leadership · Problem Solving";
  qs("#previewLanguages").textContent =
    languages || "English (Native) · French (Fluent)";
}

function updateCertifications() {
  const certUl = qs("#previewCertifications ul");
  certUl.innerHTML = "";

  qsa(".cert-block").forEach((block) => {
    const name = block.querySelector(".cert-name").value;
    const org = block.querySelector(".cert-org").value;
    const date = block.querySelector(".cert-date").value;
    const id = block.querySelector(".cert-id").value;

    if (name) {
      const li = document.createElement("li");
      let content = `<strong>${name}</strong>`;
      if (org) content += ` • ${org}`;
      if (date) content += ` • ${date}`;
      if (id) content += ` • ID: ${id}`;
      li.innerHTML = content;
      certUl.appendChild(li);
    }
  });
}

/* ---------- Block Management ---------- */
function addBlock(section) {
  const wrapper = qs(`#${section}Wrapper`);

  // Fix the template selector for different sections
  let templateSelector;
  switch (section) {
    case "education":
      templateSelector = ".edu-block.template";
      break;
    case "experience":
      templateSelector = ".exp-block.template";
      break;
    case "projects":
      templateSelector = ".proj-block.template";
      break;
    case "certifications":
      templateSelector = ".cert-block.template";
      break;
    default:
      templateSelector = `.${section.slice(0, 3)}-block.template`;
  }

  const template = wrapper.querySelector(templateSelector);

  if (!template) {
    console.error(
      `Template not found for section: ${section} with selector: ${templateSelector}`
    );
    console.log("Available elements in wrapper:", wrapper.innerHTML);
    return;
  }

  const clone = template.cloneNode(true);

  // Clear all inputs in the clone
  clone.querySelectorAll("input,textarea").forEach((el) => {
    el.value = "";
  });

  // Remove template class
  clone.classList.remove("template");

  // Add event listeners to inputs for real-time updates
  clone.querySelectorAll("input,textarea").forEach((el) => {
    el.addEventListener("input", updatePreviewDebounced);
  });

  wrapper.appendChild(clone);

  // Focus on the first input in the new block
  const firstInput = clone.querySelector("input,textarea");
  if (firstInput) {
    firstInput.focus();
  }

  updatePreview();
  updateProgress();
  showSaveIndicator();

  console.log(`Added new ${section} block with selector: ${templateSelector}`);
}

/* ---------- Photo Upload ---------- */
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type and size
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    alert("Image size should be less than 5MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (evt) {
    const dataUrl = evt.target.result;
    setPhoto(dataUrl);
    localStorage.setItem(STORAGE_KEYS.PHOTO, dataUrl);
  };
  reader.readAsDataURL(file);
}

function setPhoto(dataUrl) {
  const img = qs("#previewPhoto");
  if (dataUrl) {
    img.src = dataUrl;
    img.hidden = false;
  } else {
    img.hidden = true;
    img.src = "";
  }
}

/* ---------- Control Binding ---------- */
function bindControls() {
  // Theme toggle
  qs("#themeToggle").addEventListener("click", toggleTheme);

  // Preview toggle
  qs("#previewToggle").addEventListener("click", togglePreview);

  // Template selection
  qs("#templateSelect").addEventListener("change", (e) => {
    applyTemplate(e.target.value);
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, e.target.value);
  });

  // Color scheme selection
  qs("#colorScheme").addEventListener("change", (e) => {
    applyColorScheme(e.target.value);
    localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, e.target.value);
  });

  // Reset button
  qs("#resetBtn").addEventListener("click", resetResume);

  // Download PDF
  qs("#downloadBtn").addEventListener("click", downloadPDF);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  appState.isDarkMode = document.body.classList.contains("dark");
  localStorage.setItem(STORAGE_KEYS.THEME, appState.isDarkMode);

  // Update theme toggle icon
  const icon = qs("#themeToggle i");
  icon.className = appState.isDarkMode ? "fas fa-sun" : "fas fa-moon";
}

function togglePreview() {
  const previewSection = qs("#previewSection");
  appState.isPreviewVisible = !appState.isPreviewVisible;

  if (appState.isPreviewVisible) {
    previewSection.style.display = "block";
    qs("#previewToggle i").className = "fas fa-eye";
  } else {
    previewSection.style.display = "none";
    qs("#previewToggle i").className = "fas fa-eye-slash";
  }
}

function applyTemplate(name) {
  const preview = qs("#resumePreview");
  preview.classList.remove("classic", "modern", "minimal", "creative");
  preview.classList.add(name);
  appState.currentTemplate = name;
}

function applyColorScheme(scheme) {
  const preview = qs("#resumePreview");
  preview.classList.remove("blue", "green", "purple", "orange", "red");
  preview.classList.add(scheme);
  appState.currentColorScheme = scheme;
}

function resetResume() {
  if (confirm("Are you sure you want to clear all data and start over?")) {
    localStorage.clear();
    location.reload();
  }
}

async function downloadPDF() {
  const downloadBtn = qs("#downloadBtn");
  const originalText = downloadBtn.innerHTML;

  // Show loading state
  downloadBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
  downloadBtn.disabled = true;

  try {
    // Temporarily add print class to force light mode styling
    const preview = qs("#resumePreview");
    const wasDark = document.body.classList.contains("dark");

    if (wasDark) {
      preview.classList.add("print-mode");
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${qs("#fullName").value || "resume"}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(preview).save();

    // Remove print mode class
    if (wasDark) {
      preview.classList.remove("print-mode");
    }

    // Show success message
    showNotification("PDF downloaded successfully!", "success");
  } catch (error) {
    console.error("PDF generation failed:", error);
    showNotification("PDF generation failed. Please try again.", "error");
  } finally {
    // Restore button state
    downloadBtn.innerHTML = originalText;
    downloadBtn.disabled = false;
  }
}

/* ---------- Progress Tracking ---------- */
function updateProgress() {
  const fields = [
    "#fullName",
    "#jobTitle",
    "#email",
    "#phone",
    "#location",
    "#summary",
    "#linkedin",
    "#github",
    "#portfolio",
    "#twitter",
    "#technicalSkills",
    "#softSkills",
    "#languages",
  ];

  let completedFields = 0;
  let totalFields = fields.length;

  // Check personal info and social links
  fields.forEach((field) => {
    const element = qs(field);
    if (element && element.value.trim()) {
      completedFields++;
    }
  });

  // Check education blocks
  const eduBlocks = qsa(".edu-block:not(.template)");
  if (eduBlocks.length > 0) {
    totalFields += 3; // School, degree, years
    eduBlocks.forEach((block) => {
      const school = block.querySelector(".edu-school").value;
      const degree = block.querySelector(".edu-degree").value;
      const years = block.querySelector(".edu-years").value;
      if (school || degree || years) completedFields += 1;
    });
  }

  // Check experience blocks
  const expBlocks = qsa(".exp-block:not(.template)");
  if (expBlocks.length > 0) {
    totalFields += 3; // Company, role, years
    expBlocks.forEach((block) => {
      const company = block.querySelector(".exp-company").value;
      const role = block.querySelector(".exp-role").value;
      const years = block.querySelector(".exp-years").value;
      if (company || role || years) completedFields += 1;
    });
  }

  // Check project blocks
  const projBlocks = qsa(".proj-block:not(.template)");
  if (projBlocks.length > 0) {
    totalFields += 2; // Name, description
    projBlocks.forEach((block) => {
      const name = block.querySelector(".proj-name").value;
      const desc = block.querySelector(".proj-desc").value;
      if (name || desc) completedFields += 1;
    });
  }

  // Check certification blocks
  const certBlocks = qsa(".cert-block:not(.template)");
  if (certBlocks.length > 0) {
    totalFields += 2; // Name, organization
    certBlocks.forEach((block) => {
      const name = block.querySelector(".cert-name").value;
      const org = block.querySelector(".cert-org").value;
      if (name || org) completedFields += 1;
    });
  }

  const percentage = Math.round((completedFields / totalFields) * 100);
  appState.completionPercentage = percentage;

  // Update progress indicator
  const progressFill = qs(".progress-fill");
  const progressText = qs(".progress-text");

  if (progressFill && progressText) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Resume Completion: ${percentage}%`;
  }
}

/* ---------- Data Persistence ---------- */
function saveToLocalStorage() {
  try {
    const data = {
      personal: {
        fullName: qs("#fullName")?.value || "",
        jobTitle: qs("#jobTitle")?.value || "",
        email: qs("#email")?.value || "",
        phone: qs("#phone")?.value || "",
        location: qs("#location")?.value || "",
        summary: qs("#summary")?.value || "",
      },
      social: {
        linkedin: qs("#linkedin")?.value || "",
        github: qs("#github")?.value || "",
        portfolio: qs("#portfolio")?.value || "",
        twitter: qs("#twitter")?.value || "",
      },
      education: qsa(".edu-block:not(.template)").map((b) => ({
        school: b.querySelector(".edu-school")?.value || "",
        degree: b.querySelector(".edu-degree")?.value || "",
        field: b.querySelector(".edu-field")?.value || "",
        years: b.querySelector(".edu-years")?.value || "",
        gpa: b.querySelector(".edu-gpa")?.value || "",
        achievements: b.querySelector(".edu-achievements")?.value || "",
      })),
      experience: qsa(".exp-block:not(.template)").map((b) => ({
        company: b.querySelector(".exp-company")?.value || "",
        role: b.querySelector(".exp-role")?.value || "",
        years: b.querySelector(".exp-years")?.value || "",
        location: b.querySelector(".exp-location")?.value || "",
        desc: b.querySelector(".exp-desc")?.value || "",
      })),
      projects: qsa(".proj-block:not(.template)").map((b) => ({
        name: b.querySelector(".proj-name")?.value || "",
        tech: b.querySelector(".proj-tech")?.value || "",
        url: b.querySelector(".proj-url")?.value || "",
        github: b.querySelector(".proj-github")?.value || "",
        desc: b.querySelector(".proj-desc")?.value || "",
      })),
      skills: {
        technical: qs("#technicalSkills")?.value || "",
        soft: qs("#softSkills")?.value || "",
        languages: qs("#languages")?.value || "",
      },
      certifications: qsa(".cert-block:not(.template)").map((b) => ({
        name: b.querySelector(".cert-name")?.value || "",
        org: b.querySelector(".cert-org")?.value || "",
        date: b.querySelector(".cert-date")?.value || "",
        id: b.querySelector(".cert-id")?.value || "",
      })),
    };

    localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(data));

    // Add timestamp for when data was last saved
    localStorage.setItem("resumeLastSaved", new Date().toISOString());

    console.log("Data saved successfully:", data);
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    showNotification("Error saving data. Please try again.", "error");
    return false;
  }
}

function loadSavedData() {
  const savedData = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
  if (!savedData) {
    console.log("No saved data found");
    return;
  }

  try {
    const data = JSON.parse(savedData);
    console.log("Loading saved data:", data);

    // Load personal info
    if (data.personal) {
      Object.keys(data.personal).forEach((key) => {
        const element = qs(`#${key}`);
        if (element) {
          element.value = data.personal[key] || "";
          console.log(`Loaded ${key}:`, data.personal[key]);
        }
      });
    }

    // Load social links
    if (data.social) {
      Object.keys(data.social).forEach((key) => {
        const element = qs(`#${key}`);
        if (element) {
          element.value = data.social[key] || "";
          console.log(`Loaded social ${key}:`, data.social[key]);
        }
      });
    }

    // Load skills
    if (data.skills) {
      if (data.skills.technical) {
        qs("#technicalSkills").value = data.skills.technical;
        console.log("Loaded technical skills:", data.skills.technical);
      }
      if (data.skills.soft) {
        qs("#softSkills").value = data.skills.soft;
        console.log("Loaded soft skills:", data.skills.soft);
      }
      if (data.skills.languages) {
        qs("#languages").value = data.skills.languages;
        console.log("Loaded languages:", data.skills.languages);
      }
    }

    // Load education - Clear existing blocks first
    const eduWrapper = qs("#educationWrapper");
    const eduTemplate = eduWrapper.querySelector(".edu-block.template");
    eduWrapper.innerHTML = "";
    eduWrapper.appendChild(eduTemplate);

    if (data.education && data.education.length > 0) {
      data.education.forEach((edu, index) => {
        if (index > 0) addBlock("education");
        const blocks = qsa(".edu-block:not(.template)");
        const block = blocks[blocks.length - 1];
        if (block) {
          Object.keys(edu).forEach((key) => {
            const element = block.querySelector(`.edu-${key}`);
            if (element) {
              element.value = edu[key] || "";
              console.log(`Loaded education ${key}:`, edu[key]);
            }
          });
        }
      });
    }

    // Load experience - Clear existing blocks first
    const expWrapper = qs("#experienceWrapper");
    const expTemplate = expWrapper.querySelector(".exp-block.template");
    expWrapper.innerHTML = "";
    expWrapper.appendChild(expTemplate);

    if (data.experience && data.experience.length > 0) {
      data.experience.forEach((exp, index) => {
        if (index > 0) addBlock("experience");
        const blocks = qsa(".exp-block:not(.template)");
        const block = blocks[blocks.length - 1];
        if (block) {
          Object.keys(exp).forEach((key) => {
            const element = block.querySelector(`.exp-${key}`);
            if (element) {
              element.value = exp[key] || "";
              console.log(`Loaded experience ${key}:`, exp[key]);
            }
          });
        }
      });
    }

    // Load projects - Clear existing blocks first
    const projWrapper = qs("#projectsWrapper");
    const projTemplate = projWrapper.querySelector(".proj-block.template");
    projWrapper.innerHTML = "";
    projWrapper.appendChild(projTemplate);

    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((proj, index) => {
        if (index > 0) addBlock("projects");
        const blocks = qsa(".proj-block:not(.template)");
        const block = blocks[blocks.length - 1];
        if (block) {
          Object.keys(proj).forEach((key) => {
            const element = block.querySelector(`.proj-${key}`);
            if (element) {
              element.value = proj[key] || "";
              console.log(`Loaded project ${key}:`, proj[key]);
            }
          });
        }
      });
    }

    // Load certifications - Clear existing blocks first
    const certWrapper = qs("#certificationsWrapper");
    const certTemplate = certWrapper.querySelector(".cert-block.template");
    certWrapper.innerHTML = "";
    certWrapper.appendChild(certTemplate);

    if (data.certifications && data.certifications.length > 0) {
      data.certifications.forEach((cert, index) => {
        if (index > 0) addBlock("certifications");
        const blocks = qsa(".cert-block:not(.template)");
        const block = blocks[blocks.length - 1];
        if (block) {
          Object.keys(cert).forEach((key) => {
            const element = block.querySelector(`.cert-${key}`);
            if (element) {
              element.value = cert[key] || "";
              console.log(`Loaded certification ${key}:`, cert[key]);
            }
          });
        }
      });
    }

    // Update preview after loading
    updatePreview();
    updateProgress();

    // Show success notification
    setTimeout(() => {
      showNotification("Resume data restored successfully!", "success");
    }, 500);
  } catch (error) {
    console.error("Error loading saved data:", error);
    showNotification("Error loading saved data. Starting fresh.", "error");
  }
}

/* ---------- Utility Functions ---------- */
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-circle"
        : "info-circle"
    }"></i>
    <span>${message}</span>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"
    };
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/* ---------- Keyboard Shortcuts ---------- */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + S to save
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveToLocalStorage();
    showNotification("Resume saved!", "success");
  }

  // Ctrl/Cmd + P to download PDF
  if ((e.ctrlKey || e.metaKey) && e.key === "p") {
    e.preventDefault();
    downloadPDF();
  }

  // Escape to close any open modals or focus form
  if (e.key === "Escape") {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === "INPUT") {
      activeElement.blur();
    }
  }
});

/* ---------- Auto-save ---------- */
setInterval(() => {
  const success = saveToLocalStorage();
  if (success) {
    updateLastSavedTime();
  }
}, 30000); // Auto-save every 30 seconds
// --- Local Storage Auth ---
// Utility functions
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}
function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function setLoggedIn(email) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("loggedInUser", email);
}
function clearLoggedIn() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
}
function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}
