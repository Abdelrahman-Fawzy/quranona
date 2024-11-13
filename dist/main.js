let mainSection = document.querySelector('.main-section')
let quranSection = document.querySelector('.quran-section')
let hadithSection = document.querySelector('.hadith-section')
let prayersSection = document.querySelector('.quran-section')

// start header links
let links = document.querySelectorAll('.links ul li')
let responsiveLinks = document.querySelector('.links.responsive')
let togglerButton = document.querySelector('header.navbar button.toggler')
let headerCloseButton = document.querySelector('header.navbar .links.responsive button.close')

if (!localStorage.getItem('reciterId')) localStorage.setItem('reciterId', 123)

links.forEach(link => {
  link.addEventListener('click', () => {
    removeActiveFromLinks();
    link.classList.add('active');
    document.querySelector('.' + link.dataset.page).scrollIntoView({behavior: 'smooth'})
    responsiveLinks.classList.remove('active')
  })
})

function removeActiveFromLinks() {
  links.forEach(link => {
    link.classList.remove('active')
  })
}

togglerButton.addEventListener('click', function () {
  responsiveLinks.classList.add('active')
})

headerCloseButton.addEventListener('click', function () {
  responsiveLinks.classList.remove('active')
})

// start header activation and scroll to top
let header = document.querySelector('header.navbar')
let scrollToTop = document.querySelector('button.scroll-to-top')
window.addEventListener('scroll', () => {
  let isThereAudio = document.querySelector('.show-player') != null ? true : false
  
  window.scrollY > 100 ? header.classList.add('active') : header.classList.remove('active')
  window.scrollY > 500 ? (isThereAudio ? scrollToTop.style.bottom = document.querySelector('.show-player').offsetHeight + 10 + 'px' : scrollToTop.style.bottom = '20px') : scrollToTop.style.bottom = '-60px'
})

scrollToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior:'smooth'
  })
})

// start browsing button
let browsing = document.querySelector('button.browsing');
browsing.addEventListener('click', () => {
  quranSection.scrollIntoView({
    behavior:'smooth'
  })
})

// start quran section
let surahsBox = document.querySelector('.surahs-box')
let surahsBoxSurah = document.querySelector('.surahs-box .surah')
let ayatBox = document.querySelector('.ayat-box');
let close = document.querySelector('.ayat-box button.close');
let closeResponsive = document.querySelector('.ayat-box button.close.responsive');
let ayatBoxList = document.querySelector('.ayat-box ul')
let ayatBoxListResponsive = document.querySelector('.ayat-box ul.responsive')
const playAllButton = document.getElementById('play-all');
const playAllButtonResponsive = document.querySelector('#play-all.responsive');

let player = document.querySelector('.quran-section .current-surah-playing')
let closeCurrentPlayer = document.querySelector('.quran-section .current-surah-playing .actions button.close-player')
let recitersList = document.querySelector('.readers select.form-select')

getAllReciters()
function getAllReciters() {
  
  fetch('https://mp3quran.net/api/v3/reciters?language=ar&rewaya=1')
  .then(response => response.json())
  .then(data => {
    let reciters = data.reciters.filter(reciters => {
      return reciters.id == 123 
            || reciters.id == 112
            || reciters.id == 118
            || reciters.id == 121
            || reciters.id == 102
            || reciters.id == 20
            || reciters.id == 217
            || reciters.id == 259
            || reciters.id == 286
            || reciters.id == 30
            || reciters.id == 5
            || reciters.id == 51
            || reciters.id == 54
            || reciters.id == 76
            || reciters.id == 92
    })
    
    console.log(reciters);
    
    reciters.forEach(reciter => {
      if (reciter.id == localStorage.getItem('reciterId')) {
        recitersList.innerHTML += 
        `<option value="${reciter.id}" selected>${reciter.name}</option>`
      } else {
        recitersList.innerHTML += 
        `<option value="${reciter.id}">${reciter.name}</option>`
      }
    })
  })
}

recitersList.addEventListener('change', function(event) {
  localStorage.setItem('reciterId', Number(event.target.value))
})

getQuranDefinitions();
function getQuranDefinitions() {
  fetch('https://api.alquran.cloud/v1/quran/ar.alafasy')
  .then(response => response.json())
  .then(data => {
    let surahs = data.data.surahs
    surahsBox.innerHTML = ''
    surahs.forEach(surah => {
      surahsBox.innerHTML += `
      <div class="surah">
        <p>${removeTashkeel(surah.name)}</p>
        <p>${surah.englishName}</p>
        <div class="actions">
          <button class="play-surah bg-transparent border-0 p-0">
            <i class="fa-regular fa-circle-play"></i>
          </button>
        </div>
      </div>`
    })
    
    for (let index = 0; index < surahsBox.children.length; index++) {
      surahsBox.children[index].children[0].addEventListener('click', function () {
        ayatBox.classList.add('active')
        document.body.style.overflow = 'hidden';
        let ayat = surahs[index].ayahs
        ayatBoxList.innerHTML = ''
        ayatBoxListResponsive.innerHTML = ''
        
        allAudios = []
        ayat.forEach(ayah => {
          ayatBoxList.innerHTML += `
            <li>
              <span>${ayah.numberInSurah}- ${ayah.text}</span>
              <button class="bg-transparent border-0 play-button" data-audio="${ayah.audio}">
                <i class="fa-solid fa-play"></i>
              </button>
            </li>
          `
          ayatBoxListResponsive.innerHTML += `
            <li>
              <span>${ayah.numberInSurah}- ${ayah.text}</span>
              <button class="bg-transparent border-0 play-button" data-audio="${ayah.audio}">
                <i class="fa-solid fa-play"></i>
              </button>
            </li>
          `
          allAudios.push(new Audio(ayah.audio));
        })
        let playButtons = document.querySelectorAll('.play-button')
        playButtons.forEach(button => {
          button.addEventListener('click', function () {
            playAudio(this.dataset.audio, button)
          })
        })
        playAllButton.removeAttribute('disabled')
        playAllButtonResponsive.removeAttribute('disabled')
      })
      surahsBox.children[index].children[2].children[0].addEventListener('click', function() {
        player.classList.add('show-player')
        getSurahs(index + 1, surahsBox.children[index].children[0].innerHTML)
      })
    }
    
    close.addEventListener('click', function () {
      ayatBox.classList.remove('active')
      document.body.style.overflow = '';
      currentAudio.pause();
      currentAudio = null;
    })

    closeResponsive.addEventListener('click', function () {
      ayatBox.classList.remove('active')
      document.body.style.overflow = '';
      currentAudio.pause();
      currentAudio = null;
    })
  })
}

let filterInputBox = document.querySelector('.filter-surah')

filterInputBox.addEventListener('input', function (event) {
  for (let index = 0; index < surahsBox.children.length; index++) {
    let arabicWord = removeTashkeel(surahsBox.children[index].children[0].textContent)
    let englishWord = surahsBox.children[index].children[1].textContent.toLowerCase()
    if (arabicWord.indexOf(event.target.value) > -1 || englishWord.indexOf(event.target.value) > -1) {
      surahsBox.children[index].style.display = '';
    } else {
      surahsBox.children[index].style.display = 'none';
    }
  }
})
// function removeTashkeel(text) {
//   // Remove all Arabic diacritics (covering a broader range of Unicode values)
//   return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
// }

function removeTashkeel(text) {
  // Replace alif with wasla (ٱ) with a regular alif (ا)
  text = text.replace(/\u0671/g, 'ا');
  
  // Remove all Arabic diacritics (covering a broad range of Unicode values)
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

function getSurahs(surahIndex, surahName) {
  let reciterId = localStorage.getItem('reciterId') || 123
  console.log(reciterId);
  
  fetch(`https://www.mp3quran.net/api/v3/reciters?language=ar&reciter=${reciterId}&rewaya=1`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    let transformedSurahIndex
    if (surahIndex < 10) transformedSurahIndex = '00' + (surahIndex)
    else if (surahIndex == 10) transformedSurahIndex = '0' + (surahIndex)
    else if (surahIndex > 10 && surahIndex < 100) transformedSurahIndex = '0' + (surahIndex)
    else if (surahIndex >= 100) transformedSurahIndex = (surahIndex);
    let surahUrl = data.reciters[0].moshaf[0].server+`/${transformedSurahIndex}.mp3`
    player.innerHTML = `
      <div class="surah-details">
        <h4>${surahName}</h4>
      </div>
      <div class='d-flex align-items-center gap-3'>
        <div class="audio">
          <audio controls="" autoplay>
            <source src="${surahUrl}" type="audio/mpeg">
          </audio>
        </div>
        <div class="actions">
          <button id="close-player-button" class="bg-transparent border-0 p-0 close-player"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    `

    let closePlayerButton = document.getElementById('close-player-button')
    let audioPlayer = document.querySelector('.audio audio')
    closePlayerButton.addEventListener('click', function () {
      player.classList.remove('show-player')
      surahUrl = null
      audioPlayer.pause()
    })
    audioPlayer.addEventListener('ended', function () {
      audioPlayer.pause()
      surahUrl = null
    })
    
  })
}

let currentAudio = null
let currentAllAudio = null
let allAudios = [];
function playAudio(url, button) {
  let playButtons = document.querySelectorAll('.play-button')
  
  if (currentAudio && currentAudio.src === url) {
    currentAudio.pause();
    currentAudio = null;
    button.children[0].classList.remove('fa-pause')
    button.children[0].classList.add('fa-play')
  } else {
    if (currentAudio) {
      currentAudio.pause();
      playButtons.forEach(button => {
        button.children[0].classList.remove('fa-pause')
        button.children[0].classList.add('fa-play')
      })
      button.children[0].classList.add('fa-play')
    }
    currentAudio = new Audio(url);
    currentAudio.play();
    button.children[0].classList.remove('fa-play')
    button.children[0].classList.add('fa-pause')

    currentAudio.addEventListener('ended', () => {
      currentAudio = null;
      button.children[0].classList.remove('fa-pause')
      button.children[0].classList.add('fa-play')
    })
  }
}


// start hadith section
let hadithBox = document.querySelector('.hadith-box');
let nextButton = document.querySelector('.hadith-section .footer button.next')
let prevButton = document.querySelector('.hadith-section .footer button.prev')
let hadithNumber = Number(localStorage.getItem('hadithNumber')) || 1
getHadithDefinitions(hadithNumber)
function getHadithDefinitions(page) {
  let apiKey = '$2y$10$gGgZbggF7BToRq3kdHoEwOlGHgASrtQXc0TyTNlkHxONnPJKhH2W'
  const apiUrl = `https://www.hadithapi.com/api/hadiths?apiKey=${apiKey}&paginate=1&page=${page}`;
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data.hadiths.data);
    console.log(data.hadiths.data.filter(hadith => hadith.status == 'Sahih'));
    
    hadithBox.innerHTML = ''
    hadithBox.innerHTML = `
      <q>${data.hadiths.data[0].hadithArabic}</q>
      <span>( ${data.hadiths.data[0].status == 'Sahih' || data.hadiths.data[0].status == 'sahih' ? 'حديث صحيح' : data.hadiths.data[0].status == 'Hasan' ? 'حديث حسن' : 'حديث ضعيف'} )</span>
      <div class="hadith-number"><span>${data.hadiths.current_page} / ${data.hadiths.total}</span></div>
    `
  })
}

nextButton.addEventListener('click', function () {
  if (hadithNumber == 40619 || hadithNumber == 0) hadithNumber = 1
  else hadithNumber += 1

  localStorage.setItem('hadithNumber', hadithNumber)
  getHadithDefinitions(localStorage.getItem('hadithNumber'))
})

prevButton.addEventListener('click', function () {
  if (hadithNumber == 0 || hadithNumber == 1) hadithNumber = 40619
  else hadithNumber -= 1

  localStorage.setItem('hadithNumber', hadithNumber)
  getHadithDefinitions(localStorage.getItem('hadithNumber'))
})

// start prayers section
let prayerSectionTitle = document.querySelector('.prayers-section .header h3')
let prayers = document.querySelector('.prayers-section .prayers')
getPrayerDefinitions()
function getPrayerDefinitions() {
  let currentDate = new Date()
  let today = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`
  
  fetch(`https://api.aladhan.com/v1/timingsByAddress/${today}?address=Cairo,Suez&method=5`)
  .then(response => response.json())
  .then(data => {
    prayerSectionTitle.innerHTML = `مواقيت الصلاة بتاريخ اليوم ${data.data.date.hijri.weekday.ar} ${data.data.date.hijri.day} ${data.data.date.hijri.month.ar} ${data.data.date.hijri.year} | ${data.data.date.readable}`
    prayers.innerHTML = 
    `
      <div class="pray-time">
        <div class="time"><span>${data.data.timings.Fajr}</span></div>
        <div class="name"><span>الفجر</span></div>
      </div>
      <div class="pray-time">
        <div class="time"><span>${data.data.timings.Sunrise}</span></div>
        <div class="name"><span>الشروق</span></div>
      </div>
      <div class="pray-time">
        <div class="time"><span>${data.data.timings.Dhuhr}</span></div>
        <div class="name"><span>الظهر</span></div>
      </div>
      <div class="pray-time">
        <div class="time"><span>${data.data.timings.Asr}</span></div>
        <div class="name"><span>العصر</span></div>
      </div>
      <div class="pray-time">
        <div class="time"><span>${data.data.timings.Maghrib}</span></div>
        <div class="name"><span>المغرب</span></div>
      </div>
      <div class="pray-time">
        <div class="time"><span>${data.data.timings.Isha}</span></div>
        <div class="name"><span>العشاء</span></div>
      </div>
    `
  })
}