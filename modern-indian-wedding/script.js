/**
 * MODERN INDIAN WEDDING INVITATION — JAVASCRIPT
 * Pure Vanilla JavaScript implementation
 * Includes: Centralized Config, Envelope Opening, Countdown, Gallery, Lightbox, RSVP, Calendar Links
 */

'use strict';

/* ==========================================================================
   CENTRALIZED WEDDING CONFIGURATION
   All editable wedding parameters are organized here for effortless customization.
   ========================================================================== */
const WEDDING_CONFIG = {
  couple: {
    partner1: 'Priya',
    partner2: 'Rahul',
    initials: 'P & R',
    fullName: 'Priya & Rahul'
  },
  // Wedding Date & Time: October 24, 2027 at 5:00 PM (17:00:00) IST
  date: '2027-10-24T17:00:00',
  formattedDate: 'October 24, 2027',
  venue: {
    name: 'The Grand Garden',
    address: 'Sample Wedding Venue, Bengaluru, Karnataka, India',
    mapsQuery: 'The+Grand+Garden+Bengaluru+Karnataka+India',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Grand+Garden+Bengaluru+Karnataka+India'
  },
  rsvp: {
    enabled: true,         // Toggle false to completely hide RSVP section & links
    isDemoMode: true       // Set to false when connecting to a production backend
  },
  events: [
    {
      title: 'Wedding Ceremony',
      date: 'October 24, 2027',
      time: '5:00 PM',
      venue: 'The Grand Garden',
      description: 'Join us as we begin our journey together.',
      isoStart: '20271024T170000',
      isoEnd: '20271024T183000'
    },
    {
      title: 'Wedding Reception',
      date: 'October 24, 2027',
      time: '7:00 PM',
      venue: 'The Grand Garden',
      description: 'Celebrate an evening filled with love, laughter, and togetherness.',
      isoStart: '20271024T190000',
      isoEnd: '20271024T230000'
    }
  ],
  gallery: [
    {
      src: 'assets/images/gallery-1.jpg',
      caption: 'In graceful pastel hues and quiet anticipation'
    },
    {
      src: 'assets/images/gallery-2.jpg',
      caption: 'A serene garden arch crowned with fresh blossoms'
    },
    {
      src: 'assets/images/gallery-3.jpg',
      caption: 'Delicate bridal details, intricate mehendi, and shared promises'
    },
    {
      src: 'assets/images/gallery-4.jpg',
      caption: 'Moments of quiet joy, laughter, and lifelong togetherness'
    },
    {
      src: 'assets/images/gallery-5.jpg',
      caption: 'Candlelit warmth and soft florals welcoming cherished guests'
    },
    {
      src: 'assets/images/gallery-6.jpg',
      caption: 'Under the twilight sky, celebrating our new beginning'
    }
  ]
};

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Lock body scroll initially until envelope is opened
  document.body.classList.add('is-locked');

  initOpeningInvitation();
  initMobileNavigation();
  initCountdown();
  initEventsCalendar();
  initBackgroundAudio();
  initPhotoGallery();
  initVenueSection();
  initRsvpSection();
});

function initMobileNavigation() {
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('header-nav');
  if (!header || !menuButton || !nav) return;

  const mobileViewport = window.matchMedia('(max-width: 768px)');

  function setMenuOpen(isOpen) {
    nav.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (!mobileViewport.matches) setMenuOpen(false);
  });
}

/* ==========================================================================
   1. OPENING INVITATION (ENVELOPE EXPERIENCE)
   ========================================================================== */
function initOpeningInvitation() {
  const overlay = document.getElementById('envelope-overlay');
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-envelope-btn');
  const mainContent = document.getElementById('main-content');

  if (!overlay || !envelope || !mainContent) return;

  let isOpening = false;
  const card = envelope.querySelector('.envelope-card-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const revealInvitation = () => {
    overlay.classList.add('fade-out');
    document.body.classList.remove('is-locked');
  };

  const triggerOpen = () => {
    if (isOpening) return;
    isOpening = true;

    if (card) {
      const envelopeRect = envelope.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const safeTop = 12;
      const desiredGap = 10;
      // Place the card above the envelope, clamping its top inside the viewport.
      const finalTop = Math.max(safeTop, envelopeRect.top - cardRect.height - desiredGap);
      const rise = Math.max(0, cardRect.top - finalTop);
      envelope.style.setProperty('--card-rise', `${rise}px`);
    }

    // Trigger visual opening animation on the envelope
    envelope.classList.add('is-opening');
    
    // Prepare main content to be visible
    mainContent.classList.remove('is-hidden');

    if (reducedMotion.matches || !card) {
      revealInvitation();
      overlay.addEventListener('transitionend', (event) => {
        if (event.target === overlay && event.propertyName === 'opacity') overlay.classList.add('is-hidden');
      }, { once: true });
      return;
    }

    // Let the card finish emerging before fading the opening screen away.
    const finishOpening = (event) => {
      if (event.target !== card || event.propertyName !== 'transform') return;
      card.removeEventListener('transitionend', finishOpening);
      revealInvitation();
      overlay.addEventListener('transitionend', (fadeEvent) => {
        if (fadeEvent.target === overlay && fadeEvent.propertyName === 'opacity') overlay.classList.add('is-hidden');
      }, { once: true });
    };
    card.addEventListener('transitionend', finishOpening);
  };

  // Click & Touch events
  envelope.addEventListener('click', triggerOpen);
  if (openBtn) openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Reveal the main content first: the shared audio element lives inside it.
    // Both operations stay in this click task, so playback still has user activation.
    triggerOpen();

    const audio = document.getElementById('wedding-background-music');
    if (audio) {
      audio.loop = true;
      audio.muted = false;
      if (audio.volume <= 0) audio.volume = 1;

      const getAudioState = () => ({
        src: audio.src,
        currentSrc: audio.currentSrc,
        paused: audio.paused,
        muted: audio.muted,
        volume: audio.volume,
        readyState: audio.readyState,
        networkState: audio.networkState,
        currentTime: audio.currentTime,
        error: audio.error ? { code: audio.error.code, message: audio.error.message } : null
      });

      try {
        const playback = audio.play();
        if (playback && typeof playback.then === 'function') {
          playback.then(() => {
            const state = getAudioState();
            if (state.paused || state.muted || state.volume <= 0) {
              console.error('Background music play() resolved without audible playback.', state);
            } else {
              console.info('Background music is playing.', state);
            }
          }).catch((error) => {
            console.error('Background music failed to play from Tap to Open.', error, getAudioState());
          });
        } else {
          console.warn('The browser did not provide a playback Promise.', getAudioState());
        }
      } catch (error) {
        console.error('Background music failed to start from Tap to Open.', error, getAudioState());
      }
    }
  });

  // Keyboard accessibility: Enter or Space on envelope
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerOpen();
    }
  });
}

/* ==========================================================================
   2. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const gridEl = document.getElementById('countdown-grid');
  const expiredMsg = document.getElementById('countdown-expired-msg');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date(WEDDING_CONFIG.date).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (isNaN(distance) || distance <= 0) {
      // Date has arrived or passed
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      if (gridEl) gridEl.classList.add('is-hidden');
      if (expiredMsg) expiredMsg.classList.remove('is-hidden');
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(Math.max(0, days)).padStart(2, '0');
    hoursEl.textContent = String(Math.max(0, hours)).padStart(2, '0');
    minutesEl.textContent = String(Math.max(0, minutes)).padStart(2, '0');
    secondsEl.textContent = String(Math.max(0, seconds)).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   3. EVENT CALENDAR LINKS
   ========================================================================== */
function initEventsCalendar() {
  const directionsLinks = document.querySelectorAll('.event-directions-link');

  directionsLinks.forEach((link) => {
    const index = Number(link.getAttribute('data-event-index'));
    const event = WEDDING_CONFIG.events[index];
    if (!event) return;

    const venueName = typeof event.venue === 'string' ? event.venue.trim() : '';
    const eventAddress = typeof event.venueAddress === 'string' ? event.venueAddress.trim() : '';
    const configuredAddress = venueName === WEDDING_CONFIG.venue.name
      ? String(WEDDING_CONFIG.venue.address || '').trim()
      : '';
    const venueAddress = eventAddress || configuredAddress;
    if (!venueAddress) {
      link.hidden = true;
      return;
    }

    const destination = [venueName, venueAddress].filter(Boolean).join(', ');
    link.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    link.hidden = false;

    const addressDisplay = document.querySelector(`[data-event-address-index="${index}"]`);
    if (addressDisplay && venueAddress) {
      addressDisplay.textContent = venueAddress;
      addressDisplay.hidden = false;
    }
  });

  const calButtons = document.querySelectorAll('.add-cal-btn');

  calButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(btn.getAttribute('data-event-index'), 10);
      const ev = WEDDING_CONFIG.events[index];
      if (!ev) return;

      const title = encodeURIComponent(`${WEDDING_CONFIG.couple.fullName} — ${ev.title}`);
      const details = encodeURIComponent(`${ev.description}\nVenue: ${ev.venue}`);
      const location = encodeURIComponent(`${ev.venue}, ${WEDDING_CONFIG.venue.address}`);
      const dates = `${ev.isoStart}/${ev.isoEnd}`;

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
    });
  });
}

/* ==========================================================================
   BACKGROUND MUSIC
   ========================================================================== */
function initBackgroundAudio() {
  const audio = document.getElementById('wedding-background-music');
  const toggle = document.getElementById('audio-toggle');
  const status = document.getElementById('audio-status');
  if (!audio || !toggle) return;

  let playbackRequested = false;

  const setPlaybackState = (isPlaying) => {
    toggle.setAttribute('aria-pressed', String(isPlaying));
    const label = isPlaying ? 'Turn background music off' : 'Turn background music on';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  };

  toggle.addEventListener('click', async () => {
    if (playbackRequested || !audio.paused) {
      playbackRequested = false;
      audio.pause();
      setPlaybackState(false);
      return;
    }

    playbackRequested = true;
    if (status) status.textContent = '';

    try {
      await audio.play();
      setPlaybackState(true);
    } catch (error) {
      playbackRequested = false;
      setPlaybackState(false);
      toggle.setAttribute('aria-label', 'Try starting background music again');
      toggle.title = 'Background music could not be played. Try again.';
      if (status) status.textContent = 'Background music could not be played. You can try again.';
    }
  });

  audio.addEventListener('play', () => setPlaybackState(true));
  audio.addEventListener('pause', () => {
    playbackRequested = false;
    setPlaybackState(false);
  });
  audio.addEventListener('error', () => {
    playbackRequested = false;
    setPlaybackState(false);
    toggle.setAttribute('aria-label', 'Try starting background music again');
    toggle.title = 'Background music could not be loaded. Try again.';
    if (status) status.textContent = 'Background music could not be loaded. You can try again.';
  });
}

/* ==========================================================================
   4. PHOTO GALLERY & LIGHTBOX
   ========================================================================== */
function initPhotoGallery() {
  const featuredImg = document.getElementById('featured-image');
  const featuredCaption = document.getElementById('featured-caption');
  const featuredContainer = document.getElementById('featured-image-container');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const thumbnailBtns = document.querySelectorAll('.gallery-thumbnails .thumb-btn');

  // Lightbox elements
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  let activeIndex = 0;
  const total = WEDDING_CONFIG.gallery.length;

  function updateGallery(index) {
    if (index < 0) activeIndex = total - 1;
    else if (index >= total) activeIndex = 0;
    else activeIndex = index;

    const item = WEDDING_CONFIG.gallery[activeIndex];
    if (!item) return;

    if (featuredImg) {
      featuredImg.src = item.src;
      featuredImg.alt = `${WEDDING_CONFIG.couple.fullName} — ${item.caption}`;
    }

    if (featuredCaption) {
      featuredCaption.textContent = item.caption;
    }

    thumbnailBtns.forEach((btn, i) => {
      if (i === activeIndex) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update lightbox if open
    if (lightbox && !lightbox.classList.contains('is-hidden')) {
      if (lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.caption;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = item.caption;
      }
      if (lightboxCounter) {
        lightboxCounter.textContent = `${activeIndex + 1} / ${total}`;
      }
    }
  }

  // Thumbnails click
  thumbnailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      updateGallery(idx);
    });
  });

  // Next / Prev controls
  if (prevBtn) prevBtn.addEventListener('click', () => updateGallery(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateGallery(activeIndex + 1));

  // Touch Swipe for Mobile Gallery
  if (featuredContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    featuredContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    featuredContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          updateGallery(activeIndex + 1); // Swiped Left -> Next
        } else {
          updateGallery(activeIndex - 1); // Swiped Right -> Prev
        }
      }
    }
  }

  // Lightbox Modal Open
  function openLightbox(index) {
    if (!lightbox) return;
    updateGallery(index);
    lightbox.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('is-hidden');
    document.body.style.overflow = '';
    if (featuredImg) featuredImg.focus();
  }

  if (featuredImg) {
    featuredImg.addEventListener('click', () => openLightbox(activeIndex));
    featuredImg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(activeIndex);
      }
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => updateGallery(activeIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => updateGallery(activeIndex + 1));

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.classList.contains('is-hidden')) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') updateGallery(activeIndex - 1);
      else if (e.key === 'ArrowRight') updateGallery(activeIndex + 1);
    }
  });

  // Touch swipe in lightbox
  if (lightbox) {
    let lbTouchStartX = 0;
    let lbTouchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].screenX;
      const delta = lbTouchEndX - lbTouchStartX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) updateGallery(activeIndex + 1);
        else updateGallery(activeIndex - 1);
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   5. VENUE SECTION
   ========================================================================== */
function initVenueSection() {
  const venueNameEl = document.getElementById('venue-name-display');
  const venueAddressEl = document.getElementById('venue-address-display');
  const directionsBtn = document.getElementById('venue-directions-btn');
  const copyBtn = document.getElementById('copy-address-btn');
  const copyText = document.getElementById('copy-btn-text');

  if (venueNameEl) venueNameEl.textContent = WEDDING_CONFIG.venue.name;
  if (venueAddressEl) venueAddressEl.textContent = WEDDING_CONFIG.venue.address;
  if (directionsBtn) directionsBtn.href = WEDDING_CONFIG.venue.mapsUrl;

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', async () => {
      const fullAddress = `${WEDDING_CONFIG.venue.name}, ${WEDDING_CONFIG.venue.address}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(fullAddress);
        } else {
          // Fallback for older browsers / iframe contexts
          const textArea = document.createElement('textarea');
          textArea.value = fullAddress;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const original = copyText.textContent;
        copyText.textContent = 'Address Copied!';
        setTimeout(() => {
          copyText.textContent = original;
        }, 2200);
      } catch (err) {
        console.warn('Could not copy address: ', err);
      }
    });
  }
}

/* ==========================================================================
   6. RSVP FORM & VALIDATION
   ========================================================================== */
function initRsvpSection() {
  const rsvpSection = document.getElementById('rsvp');
  const rsvpNavLink = document.getElementById('nav-rsvp-link');
  const rsvpHeroBtn = document.getElementById('hero-rsvp-btn');

  // Check if RSVP is enabled in config
  if (!WEDDING_CONFIG.rsvp.enabled) {
    if (rsvpSection) rsvpSection.classList.add('is-hidden');
    if (rsvpNavLink) rsvpNavLink.classList.add('is-hidden');
    if (rsvpHeroBtn) rsvpHeroBtn.classList.add('is-hidden');
    return;
  }

  const form = document.getElementById('rsvp-form');
  const guestNameInput = document.getElementById('guest-name');
  const attendanceAccept = document.getElementById('attendance-accept');
  const attendanceDecline = document.getElementById('attendance-decline');
  const attendeesGroup = document.getElementById('attendees-group');
  const attendeesCount = document.getElementById('attendees-count');
  const dietaryGroup = document.getElementById('dietary-group');
  const dietaryPreference = document.getElementById('dietary-preference');
  const guestNotes = document.getElementById('guest-notes');

  const guestNameError = document.getElementById('guest-name-error');
  const attendanceError = document.getElementById('attendance-error');
  const attendeesError = document.getElementById('attendees-error');

  const submitBtn = document.getElementById('rsvp-submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');
  const submitBtnLabel = document.getElementById('submit-btn-label');

  const confirmationBox = document.getElementById('rsvp-confirmation');
  const confirmedNameEl = document.getElementById('confirmed-guest-name');
  const confirmedMsgEl = document.getElementById('confirmed-message');
  const confirmedSummaryEl = document.getElementById('confirmed-summary');
  const editBtn = document.getElementById('rsvp-edit-btn');

  if (!form) return;

  // Conditional attendance field toggle
  function handleAttendanceChange() {
    attendanceError.textContent = '';
    if (attendanceAccept.checked) {
      attendeesGroup.classList.remove('is-hidden');
      attendeesCount.setAttribute('required', 'true');
      dietaryGroup.classList.remove('is-hidden');
      dietaryPreference.disabled = false;
    } else {
      attendeesGroup.classList.add('is-hidden');
      attendeesCount.removeAttribute('required');
      attendeesError.textContent = '';
      dietaryGroup.classList.add('is-hidden');
      dietaryPreference.disabled = true;
      dietaryPreference.selectedIndex = 0;
    }
  }

  if (attendanceAccept) attendanceAccept.addEventListener('change', handleAttendanceChange);
  if (attendanceDecline) attendanceDecline.addEventListener('change', handleAttendanceChange);
  // Apply the initial no-selection state and keep hidden values out of submissions.
  handleAttendanceChange();

  // Clear errors on input
  guestNameInput.addEventListener('input', () => {
    guestNameInput.classList.remove('is-invalid');
    guestNameError.textContent = '';
  });

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const guestName = guestNameInput.value.trim();
    const isAttending = attendanceAccept.checked ? 'accept' : (attendanceDecline.checked ? 'decline' : null);

    // Validate Guest Name
    if (!guestName || guestName.length < 2) {
      guestNameInput.classList.add('is-invalid');
      guestNameError.textContent = 'Please enter your full name.';
      isValid = false;
    } else {
      guestNameInput.classList.remove('is-invalid');
      guestNameError.textContent = '';
    }

    // Validate Attendance Selection
    if (!isAttending) {
      attendanceError.textContent = 'Please indicate whether you can attend.';
      isValid = false;
    } else {
      attendanceError.textContent = '';
    }

    if (!isValid) return;

    // Build payload
    const rsvpPayload = {
      guestName,
      attendance: isAttending,
      attendeesCount: isAttending === 'accept' ? parseInt(attendeesCount.value, 10) : 0,
      dietaryPreference: attendanceAccept.checked && dietaryPreference ? dietaryPreference.value : 'None',
      notes: guestNotes ? guestNotes.value.trim() : '',
      submittedAt: new Date().toISOString()
    };

    // UI Loading state
    submitBtn.disabled = true;
    if (submitSpinner) submitSpinner.classList.remove('is-hidden');
    if (submitBtnLabel) submitBtnLabel.textContent = 'Sending RSVP...';

    try {
      // Execute simulated or backend submission
      await submitRsvp(rsvpPayload);

      // Display Confirmation
      form.classList.add('is-hidden');
      confirmationBox.classList.remove('is-hidden');

      if (confirmedNameEl) confirmedNameEl.textContent = guestName;

      if (isAttending === 'accept') {
        confirmedMsgEl.textContent = `We are overjoyed that you will be joining us for our special day! We have reserved ${rsvpPayload.attendeesCount} seat${rsvpPayload.attendeesCount > 1 ? 's' : ''} in your honor.`;
        confirmedSummaryEl.innerHTML = `
          <strong>RSVP Details:</strong><br>
          Status: Joyfully Attending<br>
          Guests: ${rsvpPayload.attendeesCount}<br>
          Dietary: ${rsvpPayload.dietaryPreference}
        `;
      } else {
        confirmedMsgEl.textContent = 'Thank you for letting us know. You will be dearly missed as we celebrate our wedding, but we hold your warm wishes in our hearts.';
        confirmedSummaryEl.innerHTML = `
          <strong>RSVP Details:</strong><br>
          Status: Regretfully Declining
        `;
      }

    } catch (err) {
      console.error('RSVP Submission error:', err);
      alert('There was an issue submitting your RSVP. Please try again.');
    } finally {
      submitBtn.disabled = false;
      if (submitSpinner) submitSpinner.classList.add('is-hidden');
      if (submitBtnLabel) submitBtnLabel.textContent = 'Send RSVP';
    }
  });

  // Edit response button
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      confirmationBox.classList.add('is-hidden');
      form.classList.remove('is-hidden');
    });
  }
}

/**
 * Isolated RSVP submission logic.
 * Demonstrates clean separation of concerns: in production, replace with fetch() to Google Sheets,
 * Firebase, Supabase, or custom REST endpoint.
 */
async function submitRsvp(data) {
  if (WEDDING_CONFIG.rsvp.isDemoMode) {
    // Demonstration simulated delay
    console.info('[RSVP Demo Mode] Response captured locally:', data);
    return new Promise((resolve) => setTimeout(resolve, 600));
  } else {
    // Production Example:
    /*
    const response = await fetch('https://your-api-endpoint.com/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Submission failed');
    return await response.json();
    */
    return Promise.resolve({ success: true });
  }
}
