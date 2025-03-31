// Initialize AOS (Animate on Scroll)
document.addEventListener("DOMContentLoaded", () => {
  // Declare AOS to avoid undefined error. Assuming it's loaded externally.
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    })
  } else {
    console.warn("AOS is not defined. Ensure it is properly loaded.")
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // Add scroll down indicator to hero sections
  const heroSection = document.querySelector("header")
  if (heroSection) {
    const scrollDownContainer = document.createElement("div")
    scrollDownContainer.className = "scroll-down-container"
    scrollDownContainer.innerHTML = `
          <span class="scroll-down-text">Scroll Down</span>
          <div class="scroll-down-arrow"></div>
      `
    heroSection.appendChild(scrollDownContainer)

    // Add click event to scroll down indicator
    scrollDownContainer.addEventListener("click", () => {
      const nextSection = heroSection.nextElementSibling
      if (nextSection) {
        smoothScrollTo(nextSection)
      }
    })
  }

  // Add scroll progress indicator
  const body = document.body
  const scrollProgressContainer = document.createElement("div")
  scrollProgressContainer.className = "scroll-progress-container"
  const scrollProgressBar = document.createElement("div")
  scrollProgressBar.className = "scroll-progress-bar"
  scrollProgressContainer.appendChild(scrollProgressBar)
  body.appendChild(scrollProgressContainer)

  // Update scroll progress bar on scroll
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100
    scrollProgressBar.style.width = scrollPercentage + "%"
  })

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden")
      }

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        smoothScrollTo(targetElement)
      }
    })
  })

  // Smooth scroll function
  function smoothScrollTo(element) {
    const headerOffset = 80 // Adjust for header height
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }

  // Change navbar background on scroll
  const navbar = document.getElementById("main-nav")

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("nav-scrolled")
      } else {
        navbar.classList.remove("nav-scrolled")
      }
    })
  }

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll("section[id], header[id]")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("nav-active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("nav-active")
      }
    })
  })

  // Reveal sections on scroll
  const revealSections = document.querySelectorAll(".reveal-section")

  function revealOnScroll() {
    revealSections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      // Make sure sections are always visible when they enter the viewport
      if (sectionTop < windowHeight * 0.9) {
        section.classList.add("active")
      }

      // Important: Don't remove the active class once it's added
      // This prevents content from disappearing when scrolling back up
    })
  }

  // Update the initial check for visible sections to make sure all visible content is shown
  function initialRevealCheck() {
    revealSections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      // Mark sections as active if they're already in the viewport on page load
      if (sectionTop < windowHeight) {
        section.classList.add("active")
      }
    })
  }

  // Add reveal-section class to all sections
  document.querySelectorAll("section").forEach((section) => {
    if (!section.classList.contains("reveal-section")) {
      section.classList.add("reveal-section")
    }
  })

  // Initial check for visible sections
  initialRevealCheck()

  // Check for sections on scroll
  window.addEventListener("scroll", revealOnScroll)

  // Contact form submission with EmailJS
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== "undefined") {
      emailjs.init("joTdg06P9ZSwtB2qt")
      console.log("EmailJS initialized")

      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log("Form submitted")

        // Get form status element or create it if it doesn't exist
        let formStatus = document.getElementById("form-status")
        if (!formStatus) {
          formStatus = document.createElement("div")
          formStatus.id = "form-status"
          formStatus.className = "hidden mt-4 p-4 rounded-md"
          contactForm.appendChild(formStatus)
        }

        // Show loading message in form status
        formStatus.className = "mt-4 p-4 rounded-md"
        formStatus.innerHTML = '<p class="text-blue-600">Sending your message...</p>'
        formStatus.classList.remove("hidden")

        // Get form data for debugging
        const formData = {
          from_name: contactForm.querySelector('#from_name').value,
          email: contactForm.querySelector('#email').value,
          phone: contactForm.querySelector('#phone').value || "",
          subject: contactForm.querySelector('#subject').value,
          message: contactForm.querySelector('#message').value
        }
        console.log("Form data:", formData)

        // EmailJS service and template IDs
        const serviceID = 'service_qe7ee23'
        const templateID = 'template_74mv3ap'
        
        console.log("Sending email with EmailJS...")
        console.log("Service ID:", serviceID)
        console.log("Template ID:", templateID)

        // Send email using EmailJS
        emailjs.sendForm(serviceID, templateID, contactForm)
          .then((response) => {
            console.log("Email sent successfully:", response)
            formStatus.className = 'mt-4 p-4 bg-green-100 text-green-700 rounded-md'
            formStatus.innerHTML = '<p>Your message has been sent successfully!</p>'
            contactForm.reset()

            // Hide the success message after 5 seconds
            setTimeout(function () {
              formStatus.classList.add("hidden")
            }, 5000)
          })
          .catch((error) => {
            console.error("EmailJS error:", error)
            formStatus.className = 'mt-4 p-4 bg-red-100 text-red-700 rounded-md'
            formStatus.innerHTML = '<p>Sorry, there was an error sending your message. Please try again later. Error: ' + (error.text || error.message) + '</p>'
          })
      })
    } else {
      console.warn("EmailJS is not defined. Ensure it is properly loaded.")
    }
  }
})