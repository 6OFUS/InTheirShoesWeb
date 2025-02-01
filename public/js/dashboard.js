document.addEventListener("DOMContentLoaded", function () {
    const sections = {
        "DASHBOARD": "dashboard-content",
        "PROFILE": "profile-content",
        "SHOP / SKINS": "shop-content",
        "PHOTO GALLERY": "gallery-content",
        "STATISTICS": "statistics-content",
        "SETTINGS": "settings-content"
    };

    const navLinks = document.querySelectorAll("nav ul li a");
    const buttons = document.querySelectorAll("main button");

    function switchSection(sectionId) {
        Object.values(sections).forEach(id => {
            document.getElementById(id).classList.add("hidden");
        });
        document.getElementById(sectionId).classList.remove("hidden");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const sectionId = sections[this.textContent.trim()];
            if (sectionId) switchSection(sectionId);
        });
    });

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const sectionId = sections[this.textContent.trim()];
            if (sectionId) switchSection(sectionId);
        });
    });

    // Show dashboard by default
    switchSection("dashboard-content");
});

