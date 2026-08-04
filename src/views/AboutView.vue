<template>
  <div class="about">
    <h1>{{ $t('aboutTitle') }}</h1>

    <section class="about-section">
      <p class="about-description">{{ $t('aboutDescription') }}</p>
    </section>

    <div class="divider"></div>

    <section class="about-section">
      <h2>{{ $t('aboutFeatures') }}</h2>
      <ul class="features-list">
        <li>{{ $t('aboutFeatureBosses') }}</li>
        <li>{{ $t('aboutFeatureEvents') }}</li>
        <li>{{ $t('aboutFeatureStats') }}</li>
        <li>{{ $t('aboutFeatureDamage') }}</li>
        <li>{{ $t('aboutFeaturePrivacy') }}</li>
      </ul>
    </section>

    <div class="divider"></div>

    <section class="about-section">
      <h2>{{ $t('aboutCredits') }}</h2>
      <p class="credits-intro">{{ $t('aboutCreditsIntro') }}</p>
      <ul class="credits-list">
        <li class="credit-item">
          <span class="credit-header">
            <a href="https://github.com/Hapfel1/er-save-manager" target="_blank" rel="noopener noreferrer">
              <span class="credit-name">{{ $t('aboutCreditErSaveManager') }}</span>
            </a>
            <span class="credit-owner">{{ $t('aboutCreditErSaveManagerBy') }}</span>
          </span>
          <span class="credit-desc">{{ $t('aboutCreditErSaveManagerDesc') }}</span>
        </li>
        <li class="credit-item">
          <span class="credit-header">
            <a href="https://github.com/vawser/Smithbox" target="_blank" rel="noopener noreferrer">
              <span class="credit-name">{{ $t('aboutCreditSmithbox') }}</span>
            </a>
            <span class="credit-owner">{{ $t('aboutCreditSmithboxBy') }}</span>
          </span>
          <span class="credit-desc">{{ $t('aboutCreditSmithboxDesc') }}</span>
        </li>
        <li class="credit-item">
          <a href="https://www.soulsmodding.com/" target="_blank" rel="noopener noreferrer">
            <span class="credit-name">{{ $t('aboutCreditSoulsModding') }}</span>
          </a>
          <span class="credit-desc">{{ $t('aboutCreditSoulsModdingDesc') }}</span>
        </li>
        <li class="credit-item">
          <span class="credit-header">
            <a
              href="https://github.com/CyberGiant7/Elden-Ring-Automatic-Checklist"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="credit-name">{{ $t('aboutCreditAutoChecklist') }}</span>
            </a>
            <span class="credit-owner">{{ $t('aboutCreditAutoChecklistBy') }}</span>
          </span>
          <span class="credit-desc">{{ $t('aboutCreditAutoChecklistDesc') }}</span>
        </li>
        <li class="credit-item">
          <span class="credit-header">
            <a href="https://github.com/ClayAmore/ER-Save-Editor" target="_blank" rel="noopener noreferrer">
              <span class="credit-name">{{ $t('aboutCreditErSaveEditor') }}</span>
            </a>
            <span class="credit-owner">{{ $t('aboutCreditErSaveEditorBy') }}</span>
          </span>
          <span class="credit-desc">{{ $t('aboutCreditErSaveEditorDesc') }}</span>
        </li>
        <li class="credit-item">
          <span class="credit-header">
            <a href="https://github.com/ClayAmore/ER-Save-Lib" target="_blank" rel="noopener noreferrer">
              <span class="credit-name">{{ $t('aboutCreditErSaveLib') }}</span>
            </a>
            <span class="credit-owner">{{ $t('aboutCreditErSaveLibBy') }}</span>
          </span>
          <span class="credit-desc">{{ $t('aboutCreditErSaveLibDesc') }}</span>
        </li>
        <li class="credit-item">
          <span class="credit-header">
            <a href="https://github.com/EthanShoeDev/elden-ring-compass" target="_blank" rel="noopener noreferrer">
              <span class="credit-name">{{ $t('aboutCreditCompass') }}</span>
            </a>
            <span class="credit-owner">{{ $t('aboutCreditCompassBy') }}</span>
          </span>
          <span class="credit-desc">{{ $t('aboutCreditCompassDesc') }}</span>
        </li>
      </ul>
    </section>

    <div class="divider"></div>

    <section class="about-section">
      <p class="parser-note" v-html="$t('aboutParserNote')"></p>
    </section>

    <div class="divider"></div>

    <section class="about-section">
      <a href="https://github.com/zebbedaja/er-save-viewer" target="_blank" rel="noopener noreferrer" class="github-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
        </svg>
        View on GitHub
      </a>
    </section>
  </div>
</template>

<style scoped>
.about {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 0;
}

h1 {
  font-size: 1.6rem;
  color: var(--highlight-color);
  margin: 0 0 0.5rem;
}

h2 {
  font-size: 1.1rem;
  color: var(--highlight-color);
  margin: 0 0 0.8rem;
}

.about-description {
  line-height: 1.7;
  margin: 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.features-list li {
  position: relative;
  padding-left: 1.2rem;
  line-height: 1.5;
}

.features-list li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: var(--highlight-color);
  font-weight: bold;
}

.credits-intro {
  margin: 0 0 1rem;
  line-height: 1.6;
}

.credits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.credit-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.credit-name {
  font-weight: bold;
  color: var(--link-color);
}

.credit-name:hover {
  text-decoration: underline;
}

.credit-header {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.credit-owner {
  font-size: 0.8rem;
  opacity: 0.6;
}

.credit-desc {
  font-size: 0.85rem;
  color: var(--main-font-color);
  opacity: 0.8;
  line-height: 1.4;
}

.parser-note {
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.5;
  opacity: 0.8;
}

.parser-note a {
  color: var(--link-color);
  text-decoration: none;
}

.parser-note a:hover {
  text-decoration: underline;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--link-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: 0.2s;
}

.github-link:hover {
  text-decoration: underline;
}
</style>
