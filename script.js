/* --- GSAP & THREE.JS INITIALIZATION --- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// 1. Dynamic Typing Effect (Home Page)
const dynamicText = document.querySelector('.dynamic-text');
const words = ['Emerging AI Developer', 'Creative Developer', 'Problem Solver', 'Tech Innovator'];
let wordIndex = 0; let charIndex = 0; let isDeleting = false;
function typeEffect() {
    if (!dynamicText) return;
    const currentWord = words[wordIndex];
    if (isDeleting) {
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    let typeSpeed = isDeleting ? 100 : 150;
    if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; }
    setTimeout(typeEffect, typeSpeed);
}
document.addEventListener('DOMContentLoaded', typeEffect);

// 2. Navbar Scroll & Active Link Detection
const navbar = document.getElementById('navbar');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li a');
const mobileMenuBtn = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

document.addEventListener('DOMContentLoaded', () => {
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });
});

// Mobile Menu
mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinksContainer.classList.contains('active')) { icon.classList.replace('fa-bars', 'fa-times'); }
    else { icon.classList.replace('fa-times', 'fa-bars'); }
});
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// 3. Number Counter Animation (Achievements)
const counters = document.querySelectorAll('.counter');
const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 200;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (target === 100 ? '+' : '+');
            }
        };
        updateCount();
    });
};
const achievementsSection = document.getElementById('achievements');
if (achievementsSection) {
    // If GSAP is available, use ScrollTrigger; otherwise IntersectionObserver
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: achievementsSection,
            start: "top 80%",
            onEnter: () => animateCounters(),
            once: true
        });
    } else {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { animateCounters(); obs.disconnect(); }
            });
        });
        obs.observe(achievementsSection);
    }
}

// 4. Advanced GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;

    // Hero Section Reveal
    const heroElements = document.querySelectorAll('.hero-content > h3, .hero-content > h1, .hero-content > h2, .hero-content > p, .hero-content > .cta-buttons, .hero-content > .social-icons');
    if (heroElements.length > 0) {
        gsap.from(heroElements, {
            y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.6 // after page fade-in
        });
    }

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        gsap.from(heroImage, { x: 50, opacity: 0, duration: 1.2, ease: "power4.out", delay: 1 });
    }

    // Dynamic Card Reveal on Scroll
    const items = document.querySelectorAll('.skill-card, .project-card, .cert-item, .achievement-box, .timeline-content, .contact-container');
    items.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.5)"
        });
    });

    // Section Titles GSAP
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
});

// 5. Three.js Interactive 3D Galaxy Background
const canvas = document.getElementById('starfield');
if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const c1 = new THREE.Color('#ff007f'); // Neon Pink
    const c2 = new THREE.Color('#00f2fe'); // Bright Cyan
    const c3 = new THREE.Color('#bc13fe'); // Electric Purple
    const c4 = new THREE.Color('#ffffff'); // White stars

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Expand galaxy limits
        posArray[i] = (Math.random() - 0.5) * 400; // x
        posArray[i + 1] = (Math.random() - 0.5) * 400; // y
        posArray[i + 2] = (Math.random() - 0.5) * 400; // z

        const mix = Math.random();
        let targetColor = c4;
        if (mix > 0.8) targetColor = c1;
        else if (mix > 0.6) targetColor = c2;
        else if (mix > 0.4) targetColor = c3;

        colorsArray[i] = targetColor.r;
        colorsArray[i + 1] = targetColor.g;
        colorsArray[i + 2] = targetColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Dynamic glowing material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0; let mouseY = 0; let targetX = 0; let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animateThree() {
        requestAnimationFrame(animateThree);
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.03;

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Complex smooth camera bobbing
        camera.position.y += (-(mouseY * 0.03) - camera.position.y) * 0.05;
        camera.position.x += ((mouseX * 0.03) - camera.position.x) * 0.05;

        renderer.render(scene, camera);
    }
    animateThree();
} else if (canvas) {
    // Basic fallback to prevent total 2d loss if Threejs crashes
    // Note: The original 2D fallback could be appended but avoiding for simplicity, Three.js is extremely reliable via CDN.
}

// 6. Advanced UI Interactions (Page Fade, Custom Cursor, Scroll Progress, 3D Tilt)
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.6s cubic-bezier(0.5, 0, 0, 1)';
window.onload = () => { document.body.style.opacity = '1'; };

if (window.innerWidth > 768) {
    // Custom cursor only runs on desktop
    document.body.classList.add('custom-cursor');
    const cursorDot = document.createElement('div'); cursorDot.classList.add('cursor-dot');
    const cursorOutline = document.createElement('div'); cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorDot); document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 300, fill: "forwards", easing: "ease-out" });
    });

    const interactables = document.querySelectorAll('a, button, .menu-toggle, .skill-card, .project-card, .cert-item, .achievement-box, .timeline-content');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px'; cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(188, 19, 254, 0.15)'; cursorOutline.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '35px'; cursorOutline.style.height = '35px';
            cursorOutline.style.backgroundColor = 'transparent'; cursorOutline.style.borderColor = 'var(--secondary)';
        });
    });
}

// 3D Tilt Effect on Cards
const tiltElements = document.querySelectorAll('.skill-card, .project-card, .cert-item, .timeline-content');
tiltElements.forEach(el => {
    el.classList.add('card-3d');
    el.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        const rotateX = (((e.clientY - rect.top) - centerY) / centerY) * -10;
        const rotateY = (((e.clientX - rect.left) - centerX) / centerX) * 10;

        // GSAP animate the tilt for extreme smoothness if available, else standard CSS
        if (typeof gsap !== 'undefined') {
            gsap.to(el, { rotationX: rotateX, rotationY: rotateY, scale: 1.02, duration: 0.3, transformPerspective: 1000, zIndex: 10, ease: "power2.out" });
        } else {
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.zIndex = "10";
        }
    });

    el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, transformPerspective: 1000, zIndex: 1, ease: "bounce.out" });
        } else {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.zIndex = "1";
        }
    });
});

const progressBar = document.createElement('div');
progressBar.style.position = 'fixed'; progressBar.style.top = '0'; progressBar.style.left = '0';
progressBar.style.height = '4px'; progressBar.style.background = 'var(--gradient-glow)';
progressBar.style.zIndex = '9999999'; progressBar.style.transition = 'width 0.1s linear';
progressBar.style.boxShadow = '0 0 10px var(--primary)';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = windowHeight > 0 ? `${(totalScroll / windowHeight * 100)}%` : '0%';
});

// 7. Skill Modal Popup Logic
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length > 0) {
        // Create Modal Elements dynamically
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('skill-modal-overlay');

        const modalContainer = document.createElement('div');
        modalContainer.classList.add('skill-modal-container');

        const closeBtn = document.createElement('div');
        closeBtn.classList.add('skill-modal-close');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';

        const modalTitle = document.createElement('h3');
        const modalDesc = document.createElement('p');

        modalContainer.appendChild(closeBtn);
        modalContainer.appendChild(modalTitle);
        modalContainer.appendChild(modalDesc);
        modalOverlay.appendChild(modalContainer);
        document.body.appendChild(modalOverlay);

        // Open Modal
        skillCards.forEach(card => {
            if (card.getAttribute('data-title')) {
                // Ensure card indicates it is clickable
                card.style.cursor = 'pointer';

                card.addEventListener('click', () => {
                    const title = card.getAttribute('data-title');
                    const desc = card.getAttribute('data-desc');

                    if (title && desc) {
                        modalTitle.textContent = title;
                        modalDesc.textContent = desc;

                        modalOverlay.classList.add('active');
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(modalContainer, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
                        }
                    }
                });
            }
        });

        // Close Modal
        const closeModal = () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(modalContainer, { scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in" });
                setTimeout(() => modalOverlay.classList.remove('active'), 300);
            } else {
                modalOverlay.classList.remove('active');
            }
        };

        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
});

// 8. Project Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        const pModalOverlay = document.createElement('div');
        pModalOverlay.classList.add('project-modal-overlay');

        const pModalContainer = document.createElement('div');
        pModalContainer.classList.add('project-modal-container');

        const closeBtn = document.createElement('div');
        closeBtn.classList.add('project-modal-close');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';

        const pModalBody = document.createElement('div');
        pModalBody.classList.add('project-modal-body');

        pModalContainer.appendChild(closeBtn);
        pModalContainer.appendChild(pModalBody);
        pModalOverlay.appendChild(pModalContainer);
        document.body.appendChild(pModalOverlay);

        projectCards.forEach(card => {
            if (card.getAttribute('data-project')) {
                const detailsBtn = card.querySelector('.project-btn');
                if (detailsBtn) {
                    detailsBtn.addEventListener('click', (e) => {
                        e.preventDefault();

                        const title = card.querySelector('h3').textContent;
                        const desc = card.getAttribute('data-fulldesc') || "";
                        const img = card.getAttribute('data-img') || "";
                        const github = card.getAttribute('data-github') || "#";
                        const live = card.getAttribute('data-live') || "#";

                        pModalBody.innerHTML = `
                            <h3 class="pm-title">${title}</h3>
                            <div class="pm-image"><img src="${img}" alt="${title} Screenshot"></div>
                            <div class="pm-desc">${desc}</div>
                            <div class="pm-links" style="display:flex; gap: 15px;">
                                <a href="${github}" target="_blank" class="btn secondary-btn" style="margin:0; padding: 8px 20px; font-size:0.9rem;"><i class="fab fa-github"></i> GitHub</a>
                                <a href="${live}" target="_blank" class="btn primary-btn" style="padding: 8px 20px; font-size:0.9rem;"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                            </div>
                        `;

                        pModalOverlay.classList.add('active');
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(pModalContainer, { scale: 0.8, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" });
                        }
                    });
                }
            }
        });

        const closePModal = () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(pModalContainer, { scale: 0.8, opacity: 0, y: 50, duration: 0.3, ease: "power2.in" });
                setTimeout(() => pModalOverlay.classList.remove('active'), 300);
            } else {
                pModalOverlay.classList.remove('active');
            }
        };

        closeBtn.addEventListener('click', closePModal);
        pModalOverlay.addEventListener('click', (e) => {
            if (e.target === pModalOverlay) closePModal();
        });
    }
});

// 9. Certificate Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const certCards = document.querySelectorAll('.cert-card');
    if (certCards.length > 0) {
        const cModalOverlay = document.createElement('div');
        cModalOverlay.classList.add('project-modal-overlay');

        const cModalContainer = document.createElement('div');
        cModalContainer.classList.add('project-modal-container');

        const closeBtn = document.createElement('div');
        closeBtn.classList.add('project-modal-close');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';

        const cModalBody = document.createElement('div');
        cModalBody.classList.add('project-modal-body');

        cModalContainer.appendChild(closeBtn);
        cModalContainer.appendChild(cModalBody);
        cModalOverlay.appendChild(cModalContainer);
        document.body.appendChild(cModalOverlay);

        certCards.forEach(card => {
            const detailsBtn = card.querySelector('.cert-btn');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.preventDefault();

                    const title = card.getAttribute('data-title') || card.querySelector('h3').textContent;
                    const desc = card.getAttribute('data-desc') || "";
                    const img = card.getAttribute('data-img') || "";
                    const link = card.getAttribute('data-link') || "#";

                    let downloadLink = img ? img : link;
                    if (link.includes('drive.google.com/file/d/')) {
                        const fileId = link.split('/file/d/')[1].split('/')[0];
                        downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
                    }

                    const imgHTML = img ? `<div class="pm-image"><img src="${img}" alt="${title}"></div>` : `<div class="pm-image" style="background:var(--bg-darker); display:flex; justify-content:center; align-items:center; height:300px;"><i class="fas fa-award" style="font-size: 5rem; color: var(--tertiary);"></i></div>`;

                    cModalBody.innerHTML = `
                        <h3 class="pm-title" style="color: var(--tertiary);">${title}</h3>
                        ${imgHTML}
                        <div class="pm-desc" style="color: var(--text-main); font-weight: normal; font-size: 1.1rem; line-height: 1.6;">${desc}</div>
                        <div class="pm-links" style="display:flex; justify-content:center; gap: 15px; margin-top: 20px;">
                            <a href="${link}" target="_blank" class="btn primary-btn" style="padding: 10px 25px;"><i class="fas fa-file-pdf"></i> View as PDF</a>
                            <a href="${downloadLink}" download target="_blank" class="btn secondary-btn" style="padding: 10px 25px;"><i class="fas fa-download"></i> Download</a>
                        </div>
                    `;

                    cModalOverlay.classList.add('active');
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(cModalContainer, { scale: 0.8, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" });
                    }
                });
            }
        });

        const closeCModal = () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(cModalContainer, { scale: 0.8, opacity: 0, y: 50, duration: 0.3, ease: "power2.in" });
                setTimeout(() => cModalOverlay.classList.remove('active'), 300);
            } else {
                cModalOverlay.classList.remove('active');
            }
        };

        closeBtn.addEventListener('click', closeCModal);
        cModalOverlay.addEventListener('click', (e) => {
            if (e.target === cModalOverlay) closeCModal();
        });
    }
});

// 10. Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    const icon = themeToggleBtn.querySelector('i');
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.body.classList.add('light-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        document.body.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        
        if (isLight) {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });
});
