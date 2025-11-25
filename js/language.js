// Language Management System
(function() {
    'use strict';

    // Get saved language or default to Ukrainian
    let currentLang = localStorage.getItem('selectedLanguage') || 'ua';

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        initLanguage();
        setupLanguageSwitcher();
    });

    function initLanguage() {
        // Set initial language
        setLanguage(currentLang);
        updateActiveButton(currentLang);
    }

    function setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                setLanguage(lang);
                updateActiveButton(lang);
                // Save preference
                localStorage.setItem('selectedLanguage', lang);
            });
        });
    }

    function setLanguage(lang) {
        currentLang = lang;

        // Update all elements with data-ua and data-pl attributes
        const elements = document.querySelectorAll('[data-ua][data-pl]');

        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // For elements with only text content or simple structure
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
                    // Only one text node child
                    element.textContent = text;
                } else if (element.children.length === 0) {
                    // No child elements, only text
                    element.textContent = text;
                } else {
                    // Has child elements, replace only first text node
                    const textNode = Array.from(element.childNodes).find(node => node.nodeType === 3 && node.textContent.trim());
                    if (textNode) {
                        textNode.textContent = text;
                    } else {
                        element.textContent = text;
                    }
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'ua' ? 'uk' : 'pl';
    }

    function updateActiveButton(lang) {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            if (button.getAttribute('data-lang') === lang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Expose setLanguage globally if needed
    window.setLanguage = setLanguage;
})();
