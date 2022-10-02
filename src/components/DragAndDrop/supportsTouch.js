function isBrowser() {
  return typeof window !== 'undefined';
}

export default function isTouchDevice() {
  if (isBrowser()) {
    const confirmed =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    if (confirmed) {
      const html = document.getElementsByTagName('html')[0];
      html.classList.add('touchevents');
    }

    return confirmed;
  }

  return false;
}
