document.addEventListener('DOMContentLoaded', function () {
    const dropdownOptions = document.querySelectorAll('#dropdown li button');
    
    // Load saved preferences on DOM load
    const savedFontSize = localStorage.getItem('fontSize');
    const savedDyslexicMode = localStorage.getItem('dyslexicMode') === 'true';

    if (savedFontSize) {
        document.documentElement.style.fontSize = savedFontSize;
        const sizeMapping = {
            "12px" : "Small",
            "16px": "Medium",
            "20px": "Large",
            "24px": "XLarge"
        };
        updateDropdownButtonText(sizeMapping[savedFontSize]);
    }

    if (savedDyslexicMode) {
        document.documentElement.classList.add("open-dyslexic");
        document.getElementById("dyslexicSwitch").checked = true;
        document.getElementById('switchKnob').style.transform = 'translateX(40px)';
    }

    dropdownOptions.forEach(option => {
        option.addEventListener('click', function () {
            const selected = option.textContent.trim();
            const sizeMapping = {
                "Small": "12px",
                "Medium": "16px",
                "Large": "20px",
                "XLarge": "24px"
            };
            
            const newSize = sizeMapping[selected] || "16px";
            document.documentElement.style.fontSize = newSize;
            localStorage.setItem('fontSize', newSize); // save to localStorage

            updateDropdownButtonText(selected);
            document.getElementById("dropdown").classList.add("hidden");
        });
    });
});

function updateDropdownButtonText(selectedText) {
    const dropdownButton = document.querySelector('div.relative > button[onclick="toggleDropdown()"]');
    if (dropdownButton) {
        dropdownButton.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
                node.nodeValue = selectedText;
            }
        });
    }
}

window.toggleDropdown = function () {
    const dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("hidden");
};

window.toggleSwitch = function () {
    const knob = document.getElementById('switchKnob');
    const dyslexicSwitch = document.getElementById("dyslexicSwitch");
    const isChecked = dyslexicSwitch.checked;

    knob.style.transform = isChecked ? 'translateX(40px)' : 'translateX(0px)';
    
    if (isChecked) {
        document.documentElement.classList.add("open-dyslexic");
    } else {
        document.documentElement.classList.remove("open-dyslexic");
    }

    localStorage.setItem('dyslexicMode', isChecked); // save to localStorage
};
