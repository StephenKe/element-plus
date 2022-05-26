;(() => {
  const supportedLangs = window.supportedLangs
  const cacheKey = 'preferred_lang'
  const defaultLang = 'en-US'
  // docs supported languages
  const langAlias = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
  }
  let userPreferredLang = localStorage.getItem(cacheKey) || navigator.language
  const language =
    langAlias[userPreferredLang] ||
    (supportedLangs.includes(userPreferredLang)
      ? userPreferredLang
      : defaultLang)
  localStorage.setItem(cacheKey, language)
  userPreferredLang = language
  // 强制中文
  userPreferredLang = 'zh-CN'
  if (
    ((location.href.includes('localhost') ||
      location.href.includes('127.0.0.1')) &&
      !location.pathname.startsWith(`/${userPreferredLang}`)) ||
    (!(
      location.href.includes('localhost') || location.href.includes('127.0.0.1')
    ) &&
      !location.href.includes('/plus/zh-CN'))
  ) {
    const toPath = [
      `${
        location.href.includes('localhost') ||
        location.href.includes('127.0.0.1')
          ? ''
          : '/plus'
      }/${userPreferredLang}`,
    ]
      .concat(location.pathname.split('/').slice(2))
      .join('/')
    location.pathname =
      toPath.endsWith('.html') || toPath.endsWith('/')
        ? toPath
        : toPath.concat('/')
  }
  if (navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'LANG',
      lang: userPreferredLang,
    })
  }
})()
