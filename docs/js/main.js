/* ============================================================================
   ODEN FORGE DOCS - Main JavaScript
   ============================================================================ */

// Copy to clipboard
function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(function() {
    var originalText = btnElement.textContent;
    btnElement.textContent = 'Copied!';
    btnElement.classList.add('copied');
    setTimeout(function() {
      btnElement.textContent = originalText;
      btnElement.classList.remove('copied');
    }, 2000);
  }).catch(function() {
    // Fallback for older browsers
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    var originalText = btnElement.textContent;
    btnElement.textContent = 'Copied!';
    btnElement.classList.add('copied');
    setTimeout(function() {
      btnElement.textContent = originalText;
      btnElement.classList.remove('copied');
    }, 2000);
  });
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      siteNav.classList.toggle('open');
    });

    // Close nav when clicking a link
    siteNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        siteNav.classList.remove('open');
      });
    });
  }

  // Category filter
  var filterBtns = document.querySelectorAll('.filter-btn');
  var mcpCards = document.querySelectorAll('.mcp-card[data-category]');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var category = btn.dataset.filter;

      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      mcpCards.forEach(function(card) {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Copy buttons on code blocks
  document.querySelectorAll('.copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var codeText = btn.dataset.code || btn.closest('.code-block, .install-box').querySelector('code, pre').textContent.trim();
      copyToClipboard(codeText, btn);
    });
  });
});
