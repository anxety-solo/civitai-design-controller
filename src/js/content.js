class DefaultSettings {
    static get() {
        return {
            hideAvatarAnimations: true,
            hideProfileBadges: true,
            hideProfileBanners: true,
            normalizeAuthorNames: true,
            hideCardGlow: true,
            cardAppearance: true,
            hideProBadges: true,
            hideUpdatesButton: false,
            hidePurchaseButtons: false,
            showControlButton: true,
            enableBlur: false,
            blurLevel: 8,
            layoutMode: 'grid',
            language: this.detectLanguage(),
            theme: 'auto', // 'auto', 'light', 'dark'
        };
    }

    static detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ru')) {
            return 'ru';
        }
        return 'en';
    }

    static detectTheme() {
        // Check for data-mantine-color-scheme attribute
        const htmlElement = document.documentElement;

        // Check HTML
        if (htmlElement.hasAttribute('data-mantine-color-scheme')) {
            const scheme = htmlElement.getAttribute('data-mantine-color-scheme');
            if (scheme === 'dark') return 'dark';
            if (scheme === 'light') return 'light';
        }

        // Fallback to system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }
}

class CivitAIController {
    constructor() {
        this.settings = DefaultSettings.get();
        this.tempSettings = { ...this.settings }; // Temporary settings for unsaved changes

        // Helper method to create setting items
        this.createSettingItem = (id, title, description, isUnimplemented = false) => {
            const unimplementedClass = isUnimplemented ? ' unimplemented' : '';
            return `
                <div class="civitai-setting-item${unimplementedClass}">
                    <label class="civitai-custom-checkbox">
                        <input type="checkbox" id="${id}" ${this.tempSettings[id] ? 'checked' : ''}>
                        <span class="civitai-checkbox-slider"></span>
                    </label>
                    <div class="civitai-setting-info">
                        <h4>${title}</h4>
                        <p>${description}</p>
                    </div>
                </div>
            `;
        };

        // Helper method to get layout toggle icon
        this.getLayoutToggleIcon = (layout) => {
            return layout === 'grid'
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>';
        };

        // Helper method to get actual theme for display
        this.getDisplayTheme = (theme) => {
            return theme === 'auto' ? DefaultSettings.detectTheme() : theme;
        };

        // Helper method to manage control button
        this.manageControlButton = () => {
            const controlBtn = document.querySelector('.civitai-design-controller');
            if (controlBtn) controlBtn.remove();

            if (this.settings.showControlButton) {
                setTimeout(() => this.createControlButton(), 100);
            }
        };

        this.translations = {
            en: {
                // Popup
                title: 'CivitAI Appearance Settings',
                avatarAnimations: 'Hide Avatar Decorations',
                profileBadges: 'Hide Profile Badges',
                profileBanners: 'Hide Banner Animations',
                normalizeAuthorNames: 'Uniform Author Name Style',
                cardGlow: 'Hide Card Outline Glow',
                cardAppearance: 'Improve Card Appearance',
                ProBadges: 'Hide Pro Badge',
                UpdatesButton: 'Hide Updates Button',
                PurchaseButtons: 'Hide Purchase Button',
                showControlButton: 'Show Control Button',
                enableBlur: 'Enable Blur Effect',
                blurLevel: 'Blur Intensity',
                reset: 'Reset',
                save: 'Save',
                language: 'Interface Language',
                theme: 'Extension Theme',
                // Description
                descriptionAvatar: 'Removes sparkles and animations from avatars. Pretty? Sure. Necessary? Not always.',
                descriptionProfileBadges: 'Hides profile badges. Because we don’t care about what you got.',
                descriptionBanners: 'Hides those endlessly flashing banners. Your eyes will thank you.',
                descriptionNames: 'Makes all author names follow the same style. No more rainbow circus.',
                descriptionGlow: 'Turns off the glowing card borders. A card without a “halo” is still a card.',
                descriptionCardAppearance: 'Improves the appearance of cards for better text readability (<i>May slightly impact performance</i>)',
                descriptionProBadges: 'Hides Pro badges. Because modesty is classy.',
                descriptionUpdatesButton: 'Hides the “Updates” button. Seriously, who even clicks that?',
                descriptionPurchaseButtons: 'Hides purchase buttons. If you’re not spending money — why keep them around?',
                descriptionControlButton: 'Show/hide the settings button on the page.',
                descriptionBlur: 'Enables/disables stylish background blur. Purely for aesthetics.',
                descriptionBlurLevel: 'Adjusts blur strength. From “barely” to “can’t see a thing”.',
                descriptionLanguage: 'Choose the language your extension will speak to you in.',
                descriptionTheme: 'Switch between light, dark, or auto theme mode.',
                // Section Names
                sectionPreferences: 'Preferences',
                sectionAppearance: 'Appearance',
                sectionGeneral: 'General Settings',
            },
            ru: {
                // Popup
                title: 'Настройки оформления CivitAI',
                avatarAnimations: 'Скрыть украшения аватаров',
                profileBadges: 'Скрыть профильные бейджи',
                profileBanners: 'Скрыть анимацию баннеров',
                normalizeAuthorNames: 'Единый стиль имен авторов',
                cardGlow: 'Скрыть обводку карточек',
                cardAppearance: 'Улучшить внешний вид карточек',
                ProBadges: 'Скрыть Pro бэйджик',
                UpdatesButton: 'Скрыть кнопку Обновлений',
                PurchaseButtons: 'Скрыть кнопку Покупок',
                showControlButton: 'Показать кнопку управления',
                enableBlur: 'Включить эффект размытия',
                blurLevel: 'Интенсивность размытия',
                reset: 'Сбросить',
                save: 'Сохранить',
                language: 'Язык интерфейса',
                theme: 'Тема расширения',
                // Description
                descriptionAvatar: 'Убирает всякие блестяшки и анимации с аватаров. Красиво? Да. Нужно? Не всегда.',
                descriptionProfileBadges: 'Скрывает профильные бейджи. Потому что нам не интересно, что ты получил.',
                descriptionBanners: 'Скрывает эти бесконечно мигающие баннеры. Глазам — спасибо.',
                descriptionNames: 'Делает ники авторов одинаковыми по стилю. Чтобы без цветного цирка.',
                descriptionGlow: 'Вырубает светящуюся рамку у карточек. Карточка без “ореола” — тоже карточка.',
                descriptionCardAppearance: 'Улучшает внешний вид карточек для лучшего восприятия текста (<i>Может немного повлиять на производительность</i>)',
                descriptionProBadges: 'Скрывает значки Pro. Потому что скромность украшает.',
                descriptionUpdatesButton: 'Прячет кнопку “Updates”. Серьёзно, кто вообще туда жмёт?',
                descriptionPurchaseButtons: 'Прячет кнопки покупок. Если не планируешь тратить деньги — зачем они тебе?',
                descriptionControlButton: 'Показывать/скрывать кнопку настроек на странице.',
                descriptionBlur: 'Включает/отключает модное размытие фона. Чисто для эстетики.',
                descriptionBlurLevel: 'Настраивает уровень размытия. От “чуть-чуть” до “ничего не видно”.',
                descriptionLanguage: 'Выбирай язык, на котором будет с тобой общаться расширение.',
                descriptionTheme: 'Переключение между светлой, тёмной или автоматической темой расширения.',
                // Section Names
                sectionPreferences: 'Предпочтения',
                sectionAppearance: 'Внешний вид',
                sectionGeneral: 'Общие настройки',
            },
        };
        this.observer = null;
        this.messageListener = null;
        this.initialized = false;
        this.init();
    }

    async init() {
        if (this.initialized) return;

        try {
            await this.loadSettings();
            this.tempSettings = { ...this.settings };

            this.setupMessageListener();
            this.createControlButton();
            this.applySettings();
            this.observeChanges();
            this.initialized = true;
        } catch (error) {
            console.error('CivitAI Controller initialization failed:', error);
        }
    }

    setupMessageListener() {
        if (!chrome.runtime?.onMessage) return;

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'togglePopup') {
                this.togglePopup();
            }
        });
    }

    async loadSettings() {
        const fallback = () => this.loadFromLocalStorage();

        try {
            if (!chrome.runtime?.id) return fallback();

            const result = await chrome.storage.sync.get(['civitai_settings']);
            if (chrome.runtime.lastError) return fallback();

            if (result.civitai_settings) {
                this.settings = { ...this.settings, ...result.civitai_settings };
            }
        } catch {
            fallback();
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('civitai_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('LocalStorage load error:', error);
        }
    }

    async saveSettings() {
        try {
            if (chrome.runtime && chrome.runtime.id) {
                await chrome.storage.sync.set({ civitai_settings: this.settings });
            }
        } catch (error) {
            console.warn('Settings save error:', error);
            // Fallback to localStorage
            try {
                localStorage.setItem('civitai_settings', JSON.stringify(this.settings));
            } catch (localError) {
                console.warn('LocalStorage save error:', localError);
            }
        }
    }

    createControlButton() {
        if (!this.settings.showControlButton) return;
        if (document.querySelector('.civitai-design-controller')) return;

        const logo = document.querySelector('header [class*="Logo_logo_"]');
        if (!logo) return;

        const controlBtn = document.createElement('div');
        controlBtn.className = 'civitai-design-controller';

        // Add data-theme attribute with current theme
        const theme = this.getDisplayTheme(this.tempSettings?.theme || this.settings?.theme || 'auto');
        controlBtn.setAttribute('data-theme', theme);

        controlBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="gear-center" d="M12 15.5C13.93 15.5 15.5 13.93 15.5 12C15.5 10.07 13.93 8.5 12 8.5C10.07 8.5 8.5 10.07 8.5 12C8.5 13.93 10.07 15.5 12 15.5Z"/>
                <path class="gear-outer" d="M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.62C2.27 14.77 2.21 15.04 2.34 15.26L4.34 18.72C4.46 18.94 4.73 19.03 4.95 18.95L7.44 17.94C7.96 18.34 8.52 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.94L19.05 18.95C19.27 19.03 19.54 18.94 19.66 18.72L21.66 15.26C21.78 15.04 21.73 14.77 21.54 14.62L19.43 12.97Z"/>
            </svg>
        `;

        controlBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopup();
        });

        // Insert the button immediately after the logo
        logo.insertAdjacentElement('afterend', controlBtn);
    }

    togglePopup() {
        const existingPopup = document.querySelector('.civitai-settings-popup');
        if (existingPopup) {
            this.closePopup(existingPopup);
            return;
        }

        this.createPopup();
    }

    createPopup() {
        const popup = document.createElement('div');
        popup.className = 'civitai-settings-popup';
        const t = this.translations[this.tempSettings.language];

        // Determine initial theme for popup
        const initialTheme = this.getDisplayTheme(this.tempSettings.theme);

        popup.innerHTML = `
            <div class="civitai-popup-content" data-layout="${this.tempSettings.layoutMode}" data-theme="${initialTheme}">
                <div class="civitai-popup-header">
                    <h3>${t.title}</h3>
                    <button class="civitai-layout-toggle" data-layout="${this.tempSettings.layoutMode}">
                        ${this.getLayoutToggleIcon(this.tempSettings.layoutMode)}
                    </button>
                    <button class="civitai-close-btn" aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <div class="civitai-popup-body">
                    <!-- Section: Preferences -->
                    <div class="civitai-section-title">${t.sectionPreferences}</div>
                    <div class="civitai-settings-layout ${this.tempSettings.layoutMode}">
                        <div class="civitai-setting-item preferences-column">
                            <div class="civitai-preferences-row">
                                <div class="civitai-preference-group language-group">
                                    <div class="civitai-setting-info">
                                        <h4>${t.language}</h4>
                                        <p>${t.descriptionLanguage}</p>
                                    </div>
                                    <div class="civitai-language-selector">
                                        <div class="civitai-language-btn">
                                            <span>${this.tempSettings.language === 'en' ? 'English' : 'Русский'}</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 10l5 5 5-5z"/>
                                            </svg>
                                        </div>
                                        <div class="civitai-language-dropdown">
                                            <div class="civitai-language-option ${this.tempSettings.language === 'en' ? 'active' : ''}" data-lang="en">
                                                <div class="civitai-language-flag" style="background: #1a3b6d; color: white;">EN</div>
                                                English
                                            </div>
                                            <div class="civitai-language-option ${this.tempSettings.language === 'ru' ? 'active' : ''}" data-lang="ru">
                                                <div class="civitai-language-flag" style="background: #d52b1e; color: white;">RU</div>
                                                Русский
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="civitai-preference-group theme-group">
                                    <div class="civitai-setting-info">
                                        <h4>${t.theme}</h4>
                                        <p>${t.descriptionTheme}</p>
                                    </div>
                                    <div class="civitai-theme-selector">
                                        <div class="civitai-theme-option ${this.tempSettings.theme === 'auto' ? 'active' : ''}" data-theme-value="auto">
                                            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                            Auto
                                        </div>
                                        <div class="civitai-theme-option ${this.tempSettings.theme === 'light' ? 'active' : ''}" data-theme-value="light">
                                            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 7 A5 5 0 1 1 12 17 A5 5 0 1 1 12 7 M12 1 L12 4 M12 20 L12 23 M4.22 4.22 L6.34 6.34 M17.66 17.66 L19.78 19.78 M1 12 L4 12 M20 12 L23 12 M4.22 19.78 L6.34 17.66 M17.66 6.34 L19.78 4.22"/>
                                            </svg>
                                            Light
                                        </div>
                                        <div class="civitai-theme-option ${this.tempSettings.theme === 'dark' ? 'active' : ''}" data-theme-value="dark">
                                            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                                            </svg>
                                            Dark
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section: Appearance Settings -->
                    <div class="civitai-section-title">${t.sectionAppearance}</div>
                    <div class="civitai-settings-layout ${this.tempSettings.layoutMode}">
                        ${this.createSettingItem('hideAvatarAnimations', t.avatarAnimations, t.descriptionAvatar)}
                        ${this.createSettingItem('hideProfileBadges', t.profileBadges, t.descriptionProfileBadges)}
                        ${this.createSettingItem('hideProfileBanners', t.profileBanners, t.descriptionBanners)}
                        ${this.createSettingItem('normalizeAuthorNames', t.normalizeAuthorNames, t.descriptionNames)}
                        ${this.createSettingItem('hideCardGlow', t.cardGlow, t.descriptionGlow)}
                        ${this.createSettingItem('cardAppearance', t.cardAppearance, t.descriptionCardAppearance)}
                        ${this.createSettingItem('hideProBadges', t.ProBadges, t.descriptionProBadges)}
                        ${this.createSettingItem('hideUpdatesButton', t.UpdatesButton, t.descriptionUpdatesButton)}
                        ${this.createSettingItem('hidePurchaseButtons', t.PurchaseButtons, t.descriptionPurchaseButtons)}
                    </div>

                    <!-- Section: General Settings -->
                    <div class="civitai-section-title">${t.sectionGeneral}</div>
                    <div class="civitai-settings-layout ${this.tempSettings.layoutMode}">
                        ${this.createSettingItem('showControlButton', t.showControlButton, t.descriptionControlButton)}
                        ${this.createSettingItem('enableBlur', t.enableBlur, t.descriptionBlur)}

                        <div class="civitai-setting-item blur-slider-item ${this.tempSettings.enableBlur ? '' : 'disabled'}">
                            <div class="civitai-setting-info">
                                <div class="civitai-setting-blur-header">
                                    <h4>${t.blurLevel}</h4>
                                    <div class="civitai-blur-value">${this.tempSettings.blurLevel}px</div>
                                </div>
                                <p>${t.descriptionBlurLevel}</p>
                            </div>
                            <div class="civitai-custom-slider">
                                <input type="range" id="blurLevel" min="4" max="40" step="2" value="${this.tempSettings.blurLevel}" ${this.tempSettings.enableBlur ? '' : 'disabled'}>
                                <div class="civitai-slider-track"></div>
                                <div class="civitai-slider-thumb" style="left: ${((this.tempSettings.blurLevel - 4) / 36) * 100}%"></div>
                                <div class="civitai-slider-labels">
                                    <span class="civitai-slider-min">4px</span>
                                    <span class="civitai-slider-max">40px</span>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>

                <div class="civitai-popup-footer">
                    <div class="civitai-watermark">
                        <img src="https://avatars.githubusercontent.com/u/93578501?v=4" alt="ANXETY" class="civitai-author-avatar">
                        <a href="https://github.com/anxety-solo" target="_blank" class="civitai-author-link">by ANXETY</a>
                    </div>
                    <div class="civitai-footer-buttons">
                        <button class="civitai-reset-btn">${t.reset}</button>
                        <button class="civitai-save-btn">${t.save}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Apply blur immediately when creating a pop-up based on current settings
        this.updateBlurEffect();

        // Add appearance animation
        requestAnimationFrame(() => {
            popup.classList.add('show');
        });

        this.setupPopupEventListeners(popup);
    }

    setupPopupEventListeners(popup) {
        // Layout toggle
        const layoutToggle = popup.querySelector('.civitai-layout-toggle');
        layoutToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const newLayout = this.tempSettings.layoutMode === 'grid' ? 'list' : 'grid';
            this.tempSettings.layoutMode = newLayout;

            // Update layout toggle icon
            layoutToggle.dataset.layout = newLayout;
            layoutToggle.innerHTML = this.getLayoutToggleIcon(newLayout);

            // Animate layout change
            const popupContent = popup.querySelector('.civitai-popup-content');
            const settingsLayouts = popup.querySelectorAll('.civitai-settings-layout');
            popupContent.dataset.layout = newLayout;

            settingsLayouts.forEach((layout) => {
                layout.className = `civitai-settings-layout ${newLayout}`;
            });
        });

        // Language selector
        const langBtn = popup.querySelector('.civitai-language-btn');
        const langDropdown = popup.querySelector('.civitai-language-dropdown');

        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        popup.querySelectorAll('.civitai-language-option').forEach((option) => {
            option.addEventListener('click', () => {
                const newLanguage = option.dataset.lang;
                if (newLanguage !== this.settings.language) {
                    this.settings.language = newLanguage;
                    this.closePopup(popup);
                    // Create a new popup with updated language
                    setTimeout(() => {
                        this.createPopup();
                    }, 300);
                }
            });
        });

        // Theme selector
        popup.querySelectorAll('.civitai-theme-option').forEach((option) => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                popup.querySelectorAll('.civitai-theme-option').forEach((opt) => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');

                const selectedTheme = option.dataset.themeValue;
                this.tempSettings.theme = selectedTheme;

                // Determine actual theme for popup display
                const displayTheme = this.getDisplayTheme(selectedTheme);

                popup.querySelector('.civitai-popup-content').dataset.theme = displayTheme;

                // Update blur effect for new theme
                this.updateBlurEffect();
            });
        });

        // Blur slider
        const blurSlider = popup.querySelector('#blurLevel');
        const blurValue = popup.querySelector('.civitai-blur-value');
        const sliderThumb = popup.querySelector('.civitai-slider-thumb');
        const sliderTrack = popup.querySelector('.civitai-slider-track');
        const sliderLabels = popup.querySelector('.civitai-slider-labels');
        let isDragging = false;

        const updateSliderThumb = (value) => {
            const percentage = ((value - 4) / 36) * 100;
            sliderThumb.style.left = percentage + '%';

            // Update the CSS variable for the track
            blurValue.textContent = value + 'px';
            sliderTrack.style.setProperty('--progress', percentage + '%');
        };

        // Mouse events for slider
        const startDrag = (e) => {
            if (!this.tempSettings.enableBlur) return;
            isDragging = true;
            sliderLabels.classList.add('show');

            const handleMouseMove = (moveEvent) => {
                if (!isDragging) return;

                const rect = sliderTrack.getBoundingClientRect();
                const percentage = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
                const rawValue = (percentage / 100) * 36 + 4;
                const steppedValue = Math.round(rawValue / 2) * 2; // Step of 2
                const clampedValue = Math.max(4, Math.min(40, steppedValue));

                this.tempSettings.blurLevel = clampedValue;
                blurSlider.value = clampedValue;
                updateSliderThumb(clampedValue);

                // Apply blur effect in real-time only when enabled
                if (this.tempSettings.enableBlur) {
                    this.updateBlurEffect();
                }
            };

            const stopDrag = () => {
                isDragging = false;
                sliderLabels.classList.remove('show');
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', stopDrag);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        };

        // Add event listeners to slider thumb only
        sliderThumb.addEventListener('mousedown', startDrag);

        // Track click to jump to position
        sliderTrack.addEventListener('click', (e) => {
            if (!this.tempSettings.enableBlur || e.target === sliderThumb) return;

            const rect = sliderTrack.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            const rawValue = (percentage / 100) * 36 + 4;
            const steppedValue = Math.round(rawValue / 2) * 2;
            const clampedValue = Math.max(4, Math.min(40, steppedValue));

            this.tempSettings.blurLevel = clampedValue;
            blurSlider.value = clampedValue;
            updateSliderThumb(clampedValue);

            if (this.tempSettings.enableBlur) {
                this.updateBlurEffect();
            }
        });

        // Show/hide labels on hover
        sliderTrack.addEventListener('mouseenter', () => {
            if (this.tempSettings.enableBlur && !isDragging) {
                sliderLabels.classList.add('show');
            }
        });

        sliderTrack.addEventListener('mouseleave', () => {
            if (!isDragging) {
                sliderLabels.classList.remove('show');
            }
        });

        // Initialize the slider
        updateSliderThumb(this.tempSettings.blurLevel);

        // Enable blur checkbox
        const enableBlurCheck = popup.querySelector('#enableBlur');
        enableBlurCheck.addEventListener('change', (e) => {
            const blurItem = popup.querySelector('.blur-slider-item');
            this.tempSettings.enableBlur = e.target.checked;

            if (e.target.checked) {
                blurItem.classList.remove('disabled');
                blurSlider.disabled = false;
                this.updateBlurEffect();
            } else {
                blurItem.classList.add('disabled');
                blurSlider.disabled = true;
                this.updateBlurEffect();
            }
        });

        // Update temp settings for all checkboxes
        popup.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', (e) => {
                const settingName = e.target.id;
                this.tempSettings[settingName] = e.target.checked;
            });
        });

        // Close handlers
        popup.querySelector('.civitai-close-btn').addEventListener('click', () => {
            this.closePopup(popup);
        });

        popup.querySelector('.civitai-save-btn').addEventListener('click', () => {
            this.saveSettingsFromTemp();
            this.closePopup(popup);
        });

        popup.querySelector('.civitai-reset-btn').addEventListener('click', () => {
            this.resetSettings();
            this.closePopup(popup);
        });

        // Background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closePopup(popup);
            }
        });

        // Close dropdown when clicking outside
        const closeDropdown = (e) => {
            if (langDropdown.classList.contains('show')) {
                if (!e.target.closest('.civitai-language-selector')) {
                    langDropdown.classList.remove('show');
                }
            }
        };

        document.addEventListener('click', closeDropdown);

        // Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closePopup(popup);
            }
        };

        document.addEventListener('keydown', handleEscape);

        // Store cleanup functions
        popup._cleanup = () => {
            document.removeEventListener('click', closeDropdown);
            document.removeEventListener('keydown', handleEscape);
        };
    }

    updateThemeFromSite() {
        if (this.settings.theme !== 'auto') return;

        const detectedTheme = DefaultSettings.detectTheme();

        // Update popup theme if it's open and in auto mode
        const popup = document.querySelector('.civitai-settings-popup');
        if (popup) {
            const popupContent = popup.querySelector('.civitai-popup-content');
            if (popupContent) {
                popupContent.dataset.theme = detectedTheme;
                this.updateBlurEffect();
            }
        }
    }

    updateBlurEffect() {
        const popup = document.querySelector('.civitai-settings-popup');
        if (!popup) return;

        const level = this.tempSettings.enableBlur ? this.tempSettings.blurLevel : 0;
        const content = popup.querySelector('.civitai-popup-content');

        popup.style.backdropFilter = level > 0 ? `blur(${level}px)` : 'none';

        // Determine actual theme for display
        const displayTheme = this.getDisplayTheme(this.tempSettings.theme);

        const opacity = level > 0 ? 0.95 : 1;
        content.style.background = displayTheme === 'light' ? `rgba(255, 255, 255, ${opacity})` : `rgba(26, 27, 35, ${opacity})`;
    }

    closePopup(popup) {
        popup.classList.add('closing');
        popup.querySelector('.civitai-popup-content').classList.add('closing');

        // Reset temp settings to saved settings when closing without saving
        this.tempSettings = { ...this.settings };

        // Cleanup event listeners
        if (popup._cleanup) {
            popup._cleanup();
        }

        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 300);
    }

    saveSettingsFromTemp() {
        // If the button setting has changed, update the UI
        if (this.settings.showControlButton !== this.tempSettings.showControlButton) {
            this.manageControlButton();
        }

        this.settings = { ...this.tempSettings };
        this.saveSettings();
        this.applySettings();
    }

    resetSettings() {
        const defaultSettings = DefaultSettings.get();
        // Save the current language and theme
        const currentLanguage = this.settings.language;
        const currentTheme = this.settings.theme;

        this.settings = { ...defaultSettings, language: currentLanguage, theme: currentTheme };
        this.tempSettings = { ...this.settings };

        this.manageControlButton();

        this.saveSettings();
        this.applySettings();
    }

    applySettings() {
        const body = document.body;

        // Controlling the display of the controller button
        if (this.settings.showControlButton) {
            if (!document.querySelector('.civitai-design-controller')) {
                this.createControlButton();
            }
        } else {
            const controlBtn = document.querySelector('.civitai-design-controller');
            if (controlBtn) controlBtn.remove();
        }

        // Apply settings classes
        body.classList.toggle('civitai-hide-avatar-animations', this.settings.hideAvatarAnimations);
        body.classList.toggle('civitai-hide-profile-badges', this.settings.hideProfileBadges);
        body.classList.toggle('civitai-hide-profile-banners', this.settings.hideProfileBanners);
        body.classList.toggle('civitai-normalize-author-names', this.settings.normalizeAuthorNames);
        body.classList.toggle('civitai-hide-card-glow', this.settings.hideCardGlow);
        body.classList.toggle('civitai-improve-card-appearance', this.settings.cardAppearance);
        body.classList.toggle('civitai-hide-pro-badges', this.settings.hideProBadges);
        body.classList.toggle('civitai-hide-updates-button', this.settings.hideUpdatesButton);
        body.classList.toggle('civitai-hide-purchase-buttons', this.settings.hidePurchaseButtons);
    }

    observeChanges() {
        // Clear the previous observer
        if (this.observer) {
            this.observer.disconnect();
        }

        this.observer = new MutationObserver((mutations) => {
            let shouldCreateButton = false;
            let shouldUpdateTheme = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // Check if the header has appeared
                    if (mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.querySelector && node.querySelector('header')) {
                                    shouldCreateButton = true;
                                    break;
                                } else if (node.tagName === 'HEADER') {
                                    shouldCreateButton = true;
                                    break;
                                }
                            }
                        }
                    }
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'data-mantine-color-scheme') {
                    // Check if theme is auto and site theme changed
                    if (this.settings.theme === 'auto') {
                        shouldUpdateTheme = true;
                    }
                }
            }

            if (shouldCreateButton && this.settings.showControlButton && !document.querySelector('.civitai-design-controller')) {
                this.createControlButton();
            }

            if (shouldUpdateTheme) {
                this.updateThemeFromSite();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-mantine-color-scheme'],
        });

        // Also observe HTML element for theme changes
        this.observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-mantine-color-scheme'],
        });
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.messageListener) {
            chrome.runtime.onMessage.removeListener(this.messageListener);
            this.messageListener = null;
        }

        const controlBtn = document.querySelector('.civitai-design-controller');
        if (controlBtn) controlBtn.remove();

        const popup = document.querySelector('.civitai-settings-popup');
        if (popup) popup.remove();

        this.initialized = false;
    }
}

// Initialize the controller only once
let civitaiController = null;

function initController() {
    if (!civitaiController && window.location.hostname.includes('civitai.com')) {
        civitaiController = new CivitAIController();
    }
}

// Start the controller
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initController);
} else {
    initController();
}

window.addEventListener('beforeunload', () => {
    if (civitaiController) {
        civitaiController.destroy();
        civitaiController = null;
    }
});
