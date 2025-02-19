$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            $('#scroll-top').addClass('active');
        } else {
            $('#scroll-top').removeClass('active');
        }

        // Scroll Spy Fix
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // Smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear');
    });

});

// Page Visibility Change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | Pushkar Patil";
        $("#favicon").attr("href", "assets/images/profile2.jpg");
    } else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href", "assets/images/profile2.jpg");
    }
});

// Typed.js Effect
new Typed(".typing-text", {
    strings: ["Data Engineering","Database Admistration","Python Development","Machine Learning Engineering","Data Analysis"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

// Fetch Skills & Projects
async function fetchData(type = "skills") {
    let response = await fetch(type === "skills" ? "skills.json" : "projects/projects.json");
    return response.json();
}

// Show Skills
function showSkills(skills) {
    let skillsContainer = $("#skillsContainer");
    let skillHTML = skills.map(skill => `
        <div class="bar">
            <div class="info">
                <img src="${skill.icon.trim()}" alt="${skill.name}" />
                <span>${skill.name}</span>
            </div>
        </div>`).join('');
    skillsContainer.html(skillHTML);
}

function showProjects(projects) {
    let projectsContainer = $("#work .box-container");
    let projectHTML = projects.slice(0, 10)
        .filter(project => project.category !== "android")
        .map(project => `
        <div class="box tilt">
            <img draggable="false" src="${project.image}" alt="project" />
            <div class="content">
                <div class="tag">
                    <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        ${project.links.view ? `<a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>` : ""}
                        <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                    </div>
                </div>
            </div>
        </div>`).join('');
    
    projectsContainer.html(projectHTML);

    // Tilt.js Effect
    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });

    // Scroll Reveal Animation
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });
    srtop.reveal('.work .box', { interval: 200 });
}

// Fetch Data & Populate UI
fetchData().then(showSkills);
fetchData("projects").then(showProjects);


// Disable Developer Mode
document.onkeydown = function (e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(String.fromCharCode(e.keyCode))) || (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
        return false;
    }
};

// Tawk.to Live Chat Integration
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

// Scroll Reveal Animations
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content h3, .home .content p, .home .content .btn, .home .image', { delay: 200 });
srtop.reveal('.home .linkedin, .home .github, .home .twitter, .home .telegram, .home .instagram, .home .dev', { interval: 600 });
srtop.reveal('.about .content h3, .about .content .tag, .about .content p, .about .content .box-container, .about .content .resumebtn', { delay: 200 });
srtop.reveal('.skills .container, .skills .container .bar, .education .box, .work .box', { interval: 200 });
srtop.reveal('.experience .timeline, .experience .timeline .container, .contact .container, .contact .container .form-group', { delay: 400 });
srtop.reveal('.certifications .box', { interval: 200, delay: 200, origin: 'bottom', distance: '50px', duration: 800, easing: 'ease-in-out' });
