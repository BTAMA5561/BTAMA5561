const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Menüyü aç' : 'Menüyü kapat');
    nav.classList.toggle('open', !isOpen);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Menüyü aç');
    }
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

const certificateList = document.querySelector('#certificate-list');
const certificateSearch = document.querySelector('#certificate-search');
const certificateCategory = document.querySelector('#certificate-category');
const certificateCount = document.querySelector('#certificate-count');
const certificateTotal = document.querySelector('#certificate-total');

if (certificateList && certificateSearch && certificateCategory && certificateCount) {
  let certificates = [];

  const renderCertificates = () => {
    const query = certificateSearch.value.trim().toLocaleLowerCase('tr-TR');
    const category = certificateCategory.value;
    const visibleCertificates = certificates.filter((certificate) => {
      const matchesCategory = category === 'all' || certificate.category === category;
      const matchesQuery = `${certificate.title} ${certificate.category} ${certificate.issuer}`
        .toLocaleLowerCase('tr-TR')
        .includes(query);
      return matchesCategory && matchesQuery;
    });

    certificateList.replaceChildren();
    visibleCertificates.forEach((certificate) => {
      const card = document.createElement('article');
      card.className = 'certificate-card';

      const categoryLabel = document.createElement('span');
      categoryLabel.className = 'certificate-card-category';
      categoryLabel.textContent = certificate.category;

      const title = document.createElement('h3');
      title.textContent = certificate.title;

      const issuer = document.createElement('p');
      issuer.className = 'certificate-issuer';
      issuer.textContent = certificate.issuer;

      const link = document.createElement('a');
      link.className = 'certificate-link';
      link.href = `certificates/${encodeURIComponent(certificate.file)}`;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.setAttribute('aria-label', `${certificate.title} sertifikasını PDF olarak aç`);
      link.textContent = 'PDF’yi aç';
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.append(arrow);

      const cardTop = document.createElement('div');
      cardTop.className = 'certificate-card-top';
      cardTop.append(categoryLabel, link);
      card.append(cardTop, title, issuer);
      certificateList.append(card);
    });

    certificateCount.textContent = `${visibleCertificates.length} sertifika gösteriliyor`;
  };

  fetch('certificates/certificates.json')
    .then((response) => {
      if (!response.ok) throw new Error('Sertifika listesi yüklenemedi');
      return response.json();
    })
    .then((data) => {
      certificates = data;
      if (certificateTotal) certificateTotal.textContent = String(data.length).padStart(2, '0');
      renderCertificates();
    })
    .catch(() => {
      certificateCount.textContent = 'Sertifika listesi şu anda yüklenemiyor. Lütfen daha sonra tekrar dene.';
    });

  certificateSearch.addEventListener('input', renderCertificates);
  certificateCategory.addEventListener('change', renderCertificates);
}
