document.addEventListener('DOMContentLoaded', () => {
    const form      = document.getElementById('urlForm');
    const input     = document.getElementById('urlInput');
    const container = document.getElementById('iframeContainer');
  
    if (!form || !input || !container) {
      console.error('Required HTML elements not found. Please check IDs.');
      return;
    }
  
    const viewports = [
      { name: 'Mobile',  width: 375,  height: 667  },
      { name: 'Tablet',  width: 768,  height: 1024 },
      { name: 'Desktop', width: 1440, height: 900  }
    ];
  
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      const raw = input.value.trim();
      // Check if empty
      if (!raw) {
        alert('Please enter a URL.');
        return;
      }
      // Enforce HTTPS
      if (!raw.startsWith('https://')) {
        alert('Please enter a URL starting with "https://".');
        return;
      }
      // Validate URL format
      let url;
      try {
        url = new URL(raw).href;
      } catch (err) {
        alert('Invalid URL. Please enter a valid URL.');
        return;
      }
  
      container.innerHTML = ''; // Clear previous iframes
  
      viewports.forEach(({ name, width, height }) => {
        const wrap = document.createElement('div');
        wrap.className = 'iframe-wrapper';
  
        // Title
        const title = document.createElement('h3');
        title.textContent = name;
        wrap.appendChild(title);
  
        // Spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        wrap.appendChild(spinner);
  
        // Progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressText = document.createElement('span');
        progressText.className = 'progress-percentage';
        progressText.textContent = '0%';
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        wrap.appendChild(progressContainer);
  
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src     = url;
        iframe.width   = width;
        iframe.height  = height;
        iframe.loading = 'lazy';
  
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
          progress = Math.min(progress + Math.random() * 10, 90);
          progressBar.style.width = progress + '%';
          progressText.textContent = Math.floor(progress) + '%';
          if (progress >= 90) clearInterval(interval);
        }, 200);
  
        // Loading timeout (15s)
        const timeout = setTimeout(() => {
          clearInterval(interval);
          spinner.remove();
          progressContainer.remove();
          const errMsg = document.createElement('p');
          errMsg.textContent = 'Loading timed out.';
          errMsg.style.color = 'red';
          wrap.appendChild(errMsg);
        }, 15000);
  
        // On successful load
        iframe.addEventListener('load', () => {
          clearTimeout(timeout);
          clearInterval(interval);
          progressBar.style.width  = '100%';
          progressText.textContent = '100%';
          spinner.remove();
          iframe.style.visibility = 'visible';
        });
  
        wrap.appendChild(iframe);
        container.appendChild(wrap);
      });
    });
  });
  