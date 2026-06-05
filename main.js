document.addEventListener("DOMContentLoaded", () => {
    
    // ==================== 0. ÉP CUỘN LÊN ĐẦU TRANG KHI REFRESH ====================
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==================== 1. KHÓA CUỘN TRANG LÚC BAN ĐẦU ====================
    document.body.style.overflowY = 'hidden';

    // ==================== 2. ANIMATION HERO SECTION ====================
    const bgGlow = document.getElementById('red-glow');
    const heroUitBg = document.getElementById('hero-uit-bg');
    const step1Text = document.getElementById('step-1-text');
    const step2Text = document.getElementById('step-2-text');
    const slashEffect = document.getElementById('slash-effect');
    const step4Photo = document.getElementById('step-4-photo');
    const photoCaption = document.getElementById('photo-caption');
    const navbar = document.getElementById('navbar');
    const bottomStats = document.getElementById('bottom-stats');
    const scrollDown = document.getElementById('scroll-down');
    const heroSection = document.getElementById('hero-section');

    setTimeout(() => {
        step1Text.classList.remove('opacity-0', 'scale-110', 'blur-sm');
        step1Text.classList.add('opacity-100', 'scale-100', 'blur-none');
        bgGlow.style.opacity = '1';
    }, 500);

    setTimeout(() => {
        step2Text.classList.remove('opacity-0', 'scale-90');
        step2Text.classList.add('opacity-100', 'scale-100');
    }, 2500);

    setTimeout(() => {
        slashEffect.classList.add('animate-slash');
        heroSection.classList.add('shake-screen');
        setTimeout(() => heroSection.classList.remove('shake-screen'), 400);

        setTimeout(() => {
            step1Text.style.opacity = '0';
            step1Text.style.filter = 'blur(10px)';
            step2Text.style.opacity = '0';
            step2Text.style.filter = 'blur(10px)';
            step2Text.style.transform = 'scale(1.1)'; 
        }, 200);
    }, 5500);

    setTimeout(() => {
        // Hiện nhân vật
        step4Photo.classList.remove('opacity-0', 'scale-110', 'blur-lg', 'pointer-events-none');
        step4Photo.classList.add('opacity-100', 'scale-100', 'blur-none', 'pointer-events-auto');
        
        // Hiện trường UIT đằng sau
        heroUitBg.classList.remove('opacity-0', 'scale-110');
        heroUitBg.classList.add('opacity-100', 'scale-100');

        navbar.classList.remove('opacity-0');
        if(bottomStats) bottomStats.classList.remove('opacity-0');
        scrollDown.classList.remove('opacity-0');
        
        // MỞ KHÓA CUỘN
        document.body.style.overflowY = 'auto';
        
        setTimeout(() => photoCaption.classList.remove('opacity-0'), 800);
    }, 6000); 

    // ==================== 3. HIỆU ỨNG CUỘN (SCROLL REVEAL) ====================
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                reveal.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    // ==================== 4. LOGIC LẤY KỶ NIỆM TỪ FOLDER (JSON TĨNH) ====================
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const guestId = getUrlParameter('guest');

    const renderMemories = async () => {
        const greetingContainer = document.getElementById('personalized-greeting');
        const gridContainer = document.getElementById('memories-grid');
        
        greetingContainer.innerHTML = `<p class="text-gray-400 font-mono text-sm animate-pulse">Decrypting memory files...</p>`;
        
        const folderName = guestId ? guestId.toLowerCase() : 'default';
        const dataUrl = `./beautifulpeople/${folderName}/data.json`;

        try {
            let response = await fetch(dataUrl);
            
            if (!response.ok) {
                console.warn(`Không tìm thấy dữ liệu cho: ${folderName}. Chuyển sang default...`);
                response = await fetch('./beautifulpeople/default/data.json');
            }

            const data = await response.json();

            setTimeout(() => {
                
                // 1. Cập nhật Tên và Avatar trên Navbar
                document.getElementById('navbar-guest-name').innerText = data.guestName;
                const avatarStr = data.avatarText ? data.avatarText : data.guestName.substring(0, 2).toUpperCase();
                document.getElementById('navbar-avatar-text').innerText = avatarStr;
                
                // 2. In Lời chào
                greetingContainer.innerHTML = `
                    <h3 class="text-xl md:text-2xl font-bold text-white mb-2">Xin chào, <span class="text-katana">${data.guestName}</span></h3>
                    <p class="text-gray-300 text-sm italic font-sans max-w-xl mx-auto">"${data.message}"</p>
                `;
                
                // 3. In Thẻ ảnh kỷ niệm (Fix bug relative + thêm Badge Tap/Hover)
                let cardsHtml = '';
                data.photos.forEach(photo => {
                    cardsHtml += `
                        <div class="memory-card w-full max-w-[350px] flex-shrink-0 cursor-pointer">
                            <div class="memory-inner">
                                
                                <div class="memory-front border border-gray-800">
                                    <img src="${photo.url}" alt="${photo.note}">
                                    
                                    <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm border border-katana/40 px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none animate-pulse">
                                        <svg class="w-3 h-3 text-katana" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                                        </svg>
                                        <span class="font-mono text-[9px] md:text-[10px] text-gray-200 tracking-widest uppercase mt-0.5 whitespace-nowrap">Tap / Hover</span>
                                    </div>
                                </div>

                                <div class="memory-back">
                                    <p class="font-mono text-katana text-xs mb-3 tracking-widest uppercase">${photo.date}</p>
                                    <p class="font-sans text-white text-base md:text-lg font-medium text-center leading-relaxed">${photo.note}</p>
                                </div>
                                
                            </div>
                        </div>
                    `;
                });
                
                gridContainer.innerHTML = cardsHtml;
                revealOnScroll();

            }, 1000);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            greetingContainer.innerHTML = `<p class="text-red-500 font-mono">System Error: Không thể tải dữ liệu bộ nhớ.</p>`;
        }
    };

    renderMemories();

    // ==================== 5. ĐỒNG HỒ ĐẾM NGƯỢC ====================
    const graduationDate = new Date("June 09, 2026 08:00:00").getTime();

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = graduationDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(updateCountdown);
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";
            const statusText = document.getElementById("status-text");
            statusText.innerHTML = "DEPLOYMENT COMPLETE (IT'S TODAY!)";
            statusText.classList.replace('text-green-500', 'text-katana');
        }
    }, 1000);

});document.addEventListener("DOMContentLoaded", () => {
    
    // ==================== 0. ÉP CUỘN LÊN ĐẦU TRANG KHI REFRESH ====================
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==================== 1. KHÓA CUỘN TRANG LÚC BAN ĐẦU ====================
    document.body.style.overflowY = 'hidden';

    // ==================== 2. ANIMATION HERO SECTION ====================
    const bgGlow = document.getElementById('red-glow');
    const heroUitBg = document.getElementById('hero-uit-bg');
    const step1Text = document.getElementById('step-1-text');
    const step2Text = document.getElementById('step-2-text');
    const slashEffect = document.getElementById('slash-effect');
    const step4Photo = document.getElementById('step-4-photo');
    const photoCaption = document.getElementById('photo-caption');
    const navbar = document.getElementById('navbar');
    const bottomStats = document.getElementById('bottom-stats');
    const scrollDown = document.getElementById('scroll-down');
    const heroSection = document.getElementById('hero-section');

    setTimeout(() => {
        step1Text.classList.remove('opacity-0', 'scale-110', 'blur-sm');
        step1Text.classList.add('opacity-100', 'scale-100', 'blur-none');
        bgGlow.style.opacity = '1';
    }, 500);

    setTimeout(() => {
        step2Text.classList.remove('opacity-0', 'scale-90');
        step2Text.classList.add('opacity-100', 'scale-100');
    }, 2500);

    setTimeout(() => {
        slashEffect.classList.add('animate-slash');
        heroSection.classList.add('shake-screen');
        setTimeout(() => heroSection.classList.remove('shake-screen'), 400);

        setTimeout(() => {
            step1Text.style.opacity = '0';
            step1Text.style.filter = 'blur(10px)';
            step2Text.style.opacity = '0';
            step2Text.style.filter = 'blur(10px)';
            step2Text.style.transform = 'scale(1.1)'; 
        }, 200);
    }, 5500);

    setTimeout(() => {
        // Hiện nhân vật
        step4Photo.classList.remove('opacity-0', 'scale-110', 'blur-lg', 'pointer-events-none');
        step4Photo.classList.add('opacity-100', 'scale-100', 'blur-none', 'pointer-events-auto');
        
        // Hiện trường UIT đằng sau
        heroUitBg.classList.remove('opacity-0', 'scale-110');
        heroUitBg.classList.add('opacity-100', 'scale-100');

        navbar.classList.remove('opacity-0');
        if(bottomStats) bottomStats.classList.remove('opacity-0');
        scrollDown.classList.remove('opacity-0');
        
        // MỞ KHÓA CUỘN
        document.body.style.overflowY = 'auto';
        
        setTimeout(() => photoCaption.classList.remove('opacity-0'), 800);
    }, 6000); 

    // ==================== 3. HIỆU ỨNG CUỘN (SCROLL REVEAL) ====================
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                reveal.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    // ==================== 4. LOGIC LẤY KỶ NIỆM TỪ FOLDER (JSON TĨNH) ====================
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const guestId = getUrlParameter('guest');

    const renderMemories = async () => {
        const greetingContainer = document.getElementById('personalized-greeting');
        const gridContainer = document.getElementById('memories-grid');
        
        greetingContainer.innerHTML = `<p class="text-gray-400 font-mono text-sm animate-pulse">Decrypting memory files...</p>`;
        
        const folderName = guestId ? guestId.toLowerCase() : 'default';
        const dataUrl = `./beautifulpeople/${folderName}/data.json`;

        try {
            let response = await fetch(dataUrl);
            
            if (!response.ok) {
                console.warn(`Không tìm thấy dữ liệu cho: ${folderName}. Chuyển sang default...`);
                response = await fetch('./beautifulpeople/default/data.json');
            }

            const data = await response.json();

            setTimeout(() => {
                
                // 1. Cập nhật Tên và Avatar trên Navbar
                document.getElementById('navbar-guest-name').innerText = data.guestName;
                const avatarStr = data.avatarText ? data.avatarText : data.guestName.substring(0, 2).toUpperCase();
                document.getElementById('navbar-avatar-text').innerText = avatarStr;
                
                // 2. In Lời chào
                greetingContainer.innerHTML = `
                    <h3 class="text-xl md:text-2xl font-bold text-white mb-2">Xin chào, <span class="text-katana">${data.guestName}</span></h3>
                    <p class="text-gray-300 text-sm italic font-sans max-w-xl mx-auto">"${data.message}"</p>
                `;
                
                // 3. In Thẻ ảnh kỷ niệm (Fix bug relative + thêm Badge Tap/Hover)
                let cardsHtml = '';
                data.photos.forEach(photo => {
                    cardsHtml += `
                        <div class="memory-card w-full max-w-[350px] flex-shrink-0 cursor-pointer">
                            <div class="memory-inner">
                                
                                <div class="memory-front border border-gray-800">
                                    <img src="${photo.url}" alt="${photo.note}">
                                    
                                    <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm border border-katana/40 px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none animate-pulse">
                                        <svg class="w-3 h-3 text-katana" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                                        </svg>
                                        <span class="font-mono text-[9px] md:text-[10px] text-gray-200 tracking-widest uppercase mt-0.5 whitespace-nowrap">Tap / Hover</span>
                                    </div>
                                </div>

                                <div class="memory-back">
                                    <p class="font-mono text-katana text-xs mb-3 tracking-widest uppercase">${photo.date}</p>
                                    <p class="font-sans text-white text-base md:text-lg font-medium text-center leading-relaxed">${photo.note}</p>
                                </div>
                                
                            </div>
                        </div>
                    `;
                });
                
                gridContainer.innerHTML = cardsHtml;
                revealOnScroll();

            }, 1000);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            greetingContainer.innerHTML = `<p class="text-red-500 font-mono">System Error: Không thể tải dữ liệu bộ nhớ.</p>`;
        }
    };

    renderMemories();

    // ==================== 5. ĐỒNG HỒ ĐẾM NGƯỢC ====================
    const graduationDate = new Date("June 09, 2026 08:00:00").getTime();

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = graduationDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(updateCountdown);
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";
            const statusText = document.getElementById("status-text");
            statusText.innerHTML = "DEPLOYMENT COMPLETE (IT'S TODAY!)";
            statusText.classList.replace('text-green-500', 'text-katana');
        }
    }, 1000);

});