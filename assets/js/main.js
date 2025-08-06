document.addEventListener('DOMContentLoaded', () => {

  // A safer way to sanitize input by creating a div and using textContent
  const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  /**
   * Mobile Menu Functionality
   */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!mobileMenuToggle.contains(event.target) && !mobileNav.contains(event.target)) {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    });
  }

  /**
   * Form Security and Submission
   */
  const handleFormSubmission = (form, successMessage) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      let formData = {};

      inputs.forEach(input => {
        // Sanitize and trim the value immediately
        const value = sanitizeInput(input.value).trim();
        input.value = value; // Store the sanitized value back

        // Remove any previous error states
        input.style.borderColor = '#d1d5db';

        // Check for empty fields
        if (!value) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        }

        // Email validation
        if (input.type === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            isValid = false;
            input.style.borderColor = '#ef4444';
          }
        }

        // Phone validation (basic)
        if (input.type === 'tel') {
          const phonePattern = /^[0-9+\-\s()]{6,20}$/;
          if (!phonePattern.test(value)) {
            isValid = false;
            input.style.borderColor = '#ef4444';
          }
        }

        // Length limits (prevents abuse)
        if (value.length > 500) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        }

        // Add sanitized data to object for potential AJAX submission
        formData[input.name] = value;
      });

      if (isValid) {
        // Disable button & show loading state
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        // Simulate async form submission (replace with a real AJAX call to a secure server-side endpoint)
        setTimeout(() => {
          alert(successMessage);
          form.reset();
          button.textContent = originalText;
          button.disabled = false;
        }, 1500); // Increased timeout to simulate a more realistic network delay
      } else {
        alert('Please fill in all fields correctly.');
      }
    });
  };

  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    handleFormSubmission(contactForm, 'Thank you! Your inquiry has been sent. Our team will contact you shortly.');
  }

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    handleFormSubmission(newsletterForm, 'Thank you for subscribing to our newsletter!');
  }

  /**
   * Universal WhatsApp Link Generator
   */
  const createWhatsAppLink = (message) => {
    const phoneNumber = "6281992075689";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  document.querySelectorAll(".service-cta, .btn-primary, .cta-button").forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      let message = `Hello, I am interested in your services. Can you help me?`;

      // Check if the button is within a service card to get a specific message
      const serviceCard = this.closest('.service-card');
      if (serviceCard) {
        const serviceName = serviceCard.querySelector('.service-title')?.innerText || "your services";
        message = `Hello, I'm interested in the ${serviceName} service. Can you help me?`;
      }

      createWhatsAppLink(message);
    });
  });

  /**
   * Page Animations and Effects
   */
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effect
  let lastScrollTop = 0;
  const header = document.querySelector('.header');
  if (header) {
    header.style.transition = 'transform 0.3s ease-in-out';
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    });
  }

  // Enhanced scroll animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.transition = 'all 0.6s ease-out';
    scrollObserver.observe(el);
  });

  // Add the 'animate-on-scroll' class to your HTML elements to trigger the animation.

  /**
   * Image Loading and Fallback
   */
  const handleImageLoad = () => {
    const images = document.querySelectorAll('.loading');

    images.forEach(img => {
      const parent = img.parentNode;

      // Handle loading success
      const onLoad = () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.style.display = 'block';
        if (parent.querySelector('.fallback-icon')) {
          parent.querySelector('.fallback-icon').style.display = 'none';
        }
      };

      // Handle loading error
      const onError = () => {
        img.style.display = 'none';
        const fallbackIconClass = img.getAttribute('data-fallback-icon');

        if (fallbackIconClass) {
          let fallbackIcon = parent.querySelector('.fallback-icon');
          if (!fallbackIcon) {
            fallbackIcon = document.createElement('i');
            fallbackIcon.classList.add('fallback-icon');
            parent.appendChild(fallbackIcon);
          }
          fallbackIcon.className = `${fallbackIconClass} fallback-icon`;
          fallbackIcon.style.display = 'block';
        }
      };

      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);

      // Trigger load event for cached images
      if (img.complete) {
        img.dispatchEvent(new Event('load'));
      }
    });
  };
  handleImageLoad();

  // Lazy loading using Intersection Observer
  if ('IntersectionObserver' in window) {
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('loading');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      img.classList.add('loading');
      lazyLoadObserver.observe(img);
    });
  }

});