(function() {
    'use strict';

    function setLanguagePreference(lang) {
        try {
            // Special handling for localhost
            if (window.location.hostname === 'localhost') {
                // Use a simple localStorage key for localhost
                localStorage.setItem('selectedLanguage', lang);

                // Set a cookie that works across localhost
                document.cookie = `selectedLanguage=${lang}; path=/; SameSite=Strict; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            } else {
                // For actual domains
                const domain = window.location.hostname
                    .split('.')
                    .slice(-2)
                    .join('.');

                // Store in localStorage with domain-specific key
                localStorage.setItem(`selectedLanguage_${domain}`, lang);

                // Set a domain-wide cookie
                document.cookie = `selectedLanguage=${lang}; path=/; domain=.${domain}; SameSite=Strict; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            }
        } catch (error) {
            console.error('Failed to save language preference:', error);
        }
    }

    function getLanguagePreference() {
        try {
            let lang;

            // Special handling for localhost
            if (window.location.hostname === 'localhost') {
                // Check localStorage first
                lang = localStorage.getItem('selectedLanguage');

                // If not in localStorage, check cookies
                if (!lang) {
                    const cookieMatch = document.cookie.match(`(^|;)\\s*selectedLanguage\\s*=\\s*([^;]*)`);
                    lang = cookieMatch ? cookieMatch[2] : null;
                }
            } else {
                // For actual domains
                const domain = window.location.hostname
                    .split('.')
                    .slice(-2)
                    .join('.');

                // First, check localStorage with domain-specific key
                lang = localStorage.getItem(`selectedLanguage_${domain}`);

                // If not found in localStorage, check cookies
                if (!lang) {
                    const cookieMatch = document.cookie.match(`(^|;)\\s*selectedLanguage\\s*=\\s*([^;]*)`);
                    lang = cookieMatch ? cookieMatch[2] : null;
                }
            }

            // Fallback to browser language or default
            return lang ||
                   (navigator.language.startsWith('uk') ? 'ua' :
                    navigator.language.startsWith('pl') ? 'pl' :
                    'ua');
        } catch (error) {
            console.error('Failed to retrieve language preference:', error);
            return 'ua';
        }
    }

    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-ua][data-pl]');

        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Comprehensive text replacement logic
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
                    element.textContent = text;
                } else if (element.children.length === 0) {
                    element.textContent = text;
                } else {
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
            button.classList.toggle('active', button.getAttribute('data-lang') === lang);
        });
    }

    function setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');

                // Set language on current page
                setLanguage(lang);

                // Update active button state
                updateActiveButton(lang);

                // Save language preference across domain
                setLanguagePreference(lang);
            });
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Retrieve saved language
        const savedLanguage = getLanguagePreference();

        // Set language
        setLanguage(savedLanguage);

        // Update active button
        updateActiveButton(savedLanguage);

        // Setup language switcher
        setupLanguageSwitcher();
    });

    // Expose functions globally if needed
     window.setLanguage = setLanguage;
    window.setLanguagePreference = setLanguagePreference;
})();
