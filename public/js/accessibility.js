document.addEventListener('DOMContentLoaded', function () {
    const dropdownOptions = document.querySelectorAll('#dropdown li button');
    dropdownOptions.forEach(option => {
      option.addEventListener('click', function () {
        const selected = option.textContent.trim();
        const sizeMapping = {
          "Small": "14px",
          "Medium": "16px",
          "Large": "18px",
          "XLarge": "20px"
        };
        
        // Update the root font size
        document.documentElement.style.fontSize = sizeMapping[selected] || "16px";
        
        const dropdownButton = document.querySelector('div.relative > button[onclick="toggleDropdown()"]');
        if (dropdownButton) {
          dropdownButton.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
              node.nodeValue = selected;
            }
          });
        }
        
        document.getElementById("dropdown").classList.add("hidden");
      });
    });
});
    
window.toggleDropdown = function () {
    const dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("hidden");
};

window.toggleSwitch = function () {
    const knob = document.getElementById('switchKnob');
    const dyslexicSwitch = document.getElementById("dyslexicSwitch");
    const isChecked = document.getElementById('dyslexicSwitch').checked;
    knob.style.transform = isChecked ? 'translateX(40px)' : 'translateX(0px)';

    if (dyslexicSwitch.checked) {
        document.documentElement.classList.add("open-dyslexic");
      } else {
        document.documentElement.classList.remove("open-dyslexic");
      }
};
  