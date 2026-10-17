// ==UserScript==
// @name         Nhắc Nhở Học Bài Pro
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Thanh nhắc học 1 dòng chữ chạy, khoá màn hình khi lướt FB/Reddit quá giờ (gia hạn 1 lần, trần 30p/ngày dùng chung xuyên site)
// @author       You
// @match        *://*/*
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @updateURL    https://raw.githubusercontent.com/ngxuanhai123/nhachocbai/main/nhac-nho.js
// @downloadURL  https://raw.githubusercontent.com/ngxuanhai123/nhachocbai/main/nhac-nho.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.__studyReminderBubbleLoaded) return;
    window.__studyReminderBubbleLoaded = true;

    // ⚠️ Nhớ đổi link này thành link học thật của bạn
    const STUDY_URL = "https://community-courses.memrise.com/";

    const messages = [
        // Nhắc nhở nhẹ nhàng
        "📚 Đến giờ học rồi đó!",
        "📖 Chỉ cần học 10 phút thôi.",
        "🎓 Hành động nhỏ tạo nên kết quả lớn.",
        "📚 Học ngay bây giờ nhé!",
        "🧠 Não bộ đang chờ được nạp thêm kiến thức đó.",
        "✨ Mở sách ra, mọi thứ sẽ dễ hơn bạn nghĩ.",

        // Tạo động lực / truyền cảm hứng
        "🔥 Tương lai của bạn bắt đầu từ 1 trang sách tiếp theo.",
        "🚀 Một chút cố gắng hôm nay, thành công ngày mai.",
        "🌟 Bạn của tương lai sẽ cảm ơn bạn.",
        "💫 Mỗi trang sách hôm nay là một bước gần hơn tới ước mơ.",
        "🌈 Kiên trì hôm nay, tỏa sáng ngày mai.",
        "🏆 Người thành công không phải người giỏi nhất, mà là người bền bỉ nhất.",
        "🌱 Kiến thức là hạt giống, hôm nay gieo thì mai mới có quả.",
        "💎 Cố gắng của bạn hôm nay sẽ tỏa sáng trong tương lai.",

        // Thúc giục / tạo cảm giác cấp bách
        "🎯 Đừng trì hoãn nữa, bắt đầu ngay đi.",
        "⏰ Deadline không đợi bạn đâu.",
        "⚡ 5 phút nữa thôi, đừng lướt điện thoại tiếp nữa!",
        "🚨 Cảnh báo: mất tập trung đã lâu, quay lại học thôi!",
        "🕐 Thời gian trôi rất nhanh, đừng để nó trôi qua vô ích.",
        "📵 Gấp điện thoại lại 15 phút, mở sách ra nào.",

        // Vui vẻ / hài hước
        "🐢 Rùa còn kiên trì về đích, bạn thì sao?",
        "🍕 Học xong rồi ăn gì cũng ngon hơn, tin mình đi!",
        "😼 Mèo còn ngủ 16 tiếng/ngày mà vẫn giỏi bắt chuột, bạn học 30 phút có gì khó đâu.",
        "🎮 Coi việc học như một màn game, và bạn sắp qua level rồi!",
        "🧋 Học 20 phút, tự thưởng trà sữa nha!",
        "🐝 Chăm như con ong thì mật ngọt sẽ đến.",

        // Động viên khi mệt mỏi / nản
        "🤍 Mệt thì nghỉ 1 chút, nhưng đừng bỏ cuộc nhé.",
        "🌤️ Hôm nay khó không có nghĩa là mãi mãi khó.",
        "💪 Bạn đã đi được xa hơn hôm qua rồi, cố thêm chút nữa nào.",
        "🕊️ Không cần hoàn hảo, chỉ cần bắt đầu.",
        "🌻 Chậm cũng được, miễn là đừng dừng lại.",
        "🫶 Bạn mạnh mẽ hơn bạn nghĩ đó, học tiếp nào!",

        // Gợi nhắc mục tiêu
        "🎯 Nhớ mục tiêu bạn đã đặt ra không? Đây là lúc hành động.",
        "📈 Mỗi ngày học một ít, kết quả sẽ cộng dồn rất lớn.",
        "🗝️ Kiến thức là chìa khóa mở ra cơ hội, đừng bỏ lỡ.",
        "🧭 Bạn đang xây tương lai bằng những gì làm hôm nay.",

        // Nhắc về gia đình / trách nhiệm
        "😢 Cha mẹ ở quê nhà làm ăn cực khổ cho bạn đi học, đừng phí thời gian như thế này.",
        "👨‍👩‍👧 Ở nhà bố mẹ đang vất vả kiếm tiền, còn bạn thì đang lướt mạng xã hội?",
        "🌾 Cha mẹ một nắng hai sương ngoài đồng, đổi lấy từng đồng học phí cho bạn.",
        "💸 Học phí không tự nhiên mà có, đó là mồ hôi công sức của cha mẹ.",
        "🏡 Gia đình đặt niềm tin vào bạn, đừng để niềm tin đó lãng phí trên newsfeed.",
        "👵👴 Ông bà, cha mẹ đã hy sinh rất nhiều, hãy học vì họ và vì chính bạn.",
        "🙏 Nhớ lời hứa với gia đình chưa? Tắt mạng xã hội và học đi.",
        "💔 Đừng để công sức của cha mẹ trở nên vô nghĩa chỉ vì vài phút lướt điện thoại."
    ];

    const STATE_KEY = "studyReminderState"; // { left, top, width, height }

    const DEFAULT_WIDTH = 300;
    const DEFAULT_HEIGHT = 46;
    const MIN_WIDTH = 180;
    const MIN_HEIGHT = 40;
    const MAX_WIDTH = 520;
    const MAX_HEIGHT = 80;

    const TAP_THRESHOLD = 8;      // px: dưới mức này coi là "click", trên mức này coi là "kéo"
    const MARQUEE_SPEED = 70;     // px/giây, tốc độ chữ chạy
    const MARQUEE_MIN_DURATION = 4000; // ms

    // --- Cấu hình khoá màn hình khi lướt mạng xã hội quá lâu ---
    const DISTRACTION_HOSTS = [/(^|\.)facebook\.com$/i, /(^|\.)reddit\.com$/i];
    const SESSION_LIMIT_SECONDS = 10 * 60;   // 10 phút mỗi phiên trình duyệt (trước khi gia hạn)
    const EXTENSION_SECONDS = 10 * 60;       // gia hạn thêm 10 phút, chỉ dùng được 1 lần mỗi phiên
    const DAILY_LIMIT_SECONDS = 30 * 60;     // tổng tối đa 30 phút/ngày, tính trên mọi phiên/lần khởi động lại

    const SESSION_ELAPSED_KEY = "studyLockElapsedSeconds";   // sessionStorage: reset khi đóng tab/trình duyệt
    const SESSION_EXTENSION_KEY = "studyLockExtensionUsed";  // sessionStorage: đã dùng lượt gia hạn trong phiên chưa
    const DAILY_USAGE_KEY = "studyLockDailyUsage";           // GM storage: tổng giây đã dùng trong ngày, dùng chung xuyên site

    let bubble = null;
    let marqueeAnim = null;
    let lockOverlay = null;
    let updateTimer = null;
    let distractionInterval = null;
    let isInitialized = false;

    // Lưu bằng GM_setValue/GM_getValue để dữ liệu DÙNG CHUNG giữa mọi trang script này chạy
    // (facebook.com, youtube.com, google.com... đều dùng chung 1 cấu hình và vị trí).
    // Có fallback về localStorage phòng khi trình quản lý userscript không hỗ trợ GM_setValue/GM_getValue.
    function gmGet(key, fallback) {
        try {
            if (typeof GM_getValue === 'function') {
                const val = GM_getValue(key, fallback);
                if (typeof val === 'string') {
                    try { return JSON.parse(val); } catch { return val; }
                }
                return val !== undefined && val !== null ? val : fallback;
            }
        } catch {}
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function gmSet(key, value) {
        try {
            if (typeof GM_setValue === 'function') {
                try {
                    GM_setValue(key, value);
                } catch {
                    GM_setValue(key, JSON.stringify(value));
                }
                return;
            }
        } catch {}
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }

    function injectStyles() {
        if (document.getElementById('study-reminder-styles')) return;
        const style = document.createElement('style');
        style.id = 'study-reminder-styles';
        style.textContent = `
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(255,193,7,.6); }
            70% { box-shadow: 0 0 0 10px rgba(255,193,7,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,193,7,0); }
        }
        @keyframes lockFadeIn {
            from { opacity: 0; transform: scale(0.96) translateY(12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        #study-reminder-bubble.paused-anim,
        #study-reminder-bubble.dragging,
        #study-reminder-bubble.resizing {
            animation-play-state: paused !important;
        }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function randomMessage() {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function loadState() {
        try {
            const s = gmGet(STATE_KEY, null);
            if (s && typeof s === 'object') return s;
        } catch {}
        return null;
    }

    function saveState(partial) {
        try {
            const current = loadState() || {};
            const merged = { ...current, ...partial };
            gmSet(STATE_KEY, merged);
        } catch {}
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Áp dụng và chuẩn hoá kích thước & vị trí từ state đã lưu
    function applyState(saved) {
        if (!bubble) return null;
        const width = clamp(saved?.width || DEFAULT_WIDTH, MIN_WIDTH, MAX_WIDTH);
        const height = clamp(saved?.height || DEFAULT_HEIGHT, MIN_HEIGHT, MAX_HEIGHT);

        const maxLeft = Math.max(0, window.innerWidth - width);
        const maxTop = Math.max(0, window.innerHeight - height);

        let left, top;
        if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
            left = clamp(saved.left, 0, maxLeft);
            top = clamp(saved.top, 0, maxTop);
        } else {
            left = Math.max(0, window.innerWidth - width - 20);
            top = Math.max(0, window.innerHeight - height - 20);
        }

        bubble.style.width = width + 'px';
        bubble.style.height = height + 'px';
        bubble.style.minWidth = MIN_WIDTH + 'px';
        bubble.style.minHeight = MIN_HEIGHT + 'px';
        bubble.style.left = left + 'px';
        bubble.style.top = top + 'px';
        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';

        return { left, top, width, height };
    }

    // Giữ thanh nhắc luôn nằm trọn vẹn trong màn hình
    function clampToViewport(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const maxLeft = Math.max(0, window.innerWidth - rect.width);
        const maxTop = Math.max(0, window.innerHeight - rect.height);

        let left = clamp(rect.left, 0, maxLeft);
        let top = clamp(rect.top, 0, maxTop);

        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';

        return { left, top };
    }

    // Chữ + nút "Học ngay" cùng chạy ngang qua thanh, lặp vô hạn
    function startMarquee() {
        if (!bubble || document.hidden) return;
        const viewport = bubble.querySelector('.ticker-viewport');
        const track = bubble.querySelector('.ticker-track');
        if (!viewport || !track) return;

        if (marqueeAnim) {
            marqueeAnim.cancel();
            marqueeAnim = null;
        }

        requestAnimationFrame(() => {
            if (!bubble || document.hidden) return;
            const viewportWidth = viewport.clientWidth;
            const trackWidth = track.scrollWidth;

            const startX = viewportWidth;
            const endX = -trackWidth;
            const distance = viewportWidth + trackWidth;
            const duration = Math.max(MARQUEE_MIN_DURATION, (distance / MARQUEE_SPEED) * 1000);

            marqueeAnim = track.animate(
                [
                    { transform: `translateY(-50%) translateX(${startX}px)` },
                    { transform: `translateY(-50%) translateX(${endX}px)` }
                ],
                {
                    duration,
                    iterations: Infinity,
                    easing: 'linear'
                }
            );
        });
    }

    function pauseMarquee() {
        if (marqueeAnim) {
            try {
                marqueeAnim.pause();
            } catch {}
        }
    }

    function resumeMarquee() {
        if (!bubble || document.hidden) return;
        if (marqueeAnim) {
            try {
                marqueeAnim.play();
                return;
            } catch {}
        }
        startMarquee();
    }

    function isDistractingSite() {
        return DISTRACTION_HOSTS.some(re => re.test(location.hostname));
    }

    function todayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    // --- Bộ đếm theo phiên (sessionStorage: reset khi đóng tab/trình duyệt) ---
    function getElapsedSeconds() {
        try {
            return parseInt(sessionStorage.getItem(SESSION_ELAPSED_KEY) || '0', 10) || 0;
        } catch {
            return 0;
        }
    }

    function setElapsedSeconds(v) {
        try {
            sessionStorage.setItem(SESSION_ELAPSED_KEY, String(v));
        } catch {}
    }

    function getExtensionUsed() {
        try {
            return sessionStorage.getItem(SESSION_EXTENSION_KEY) === '1';
        } catch {
            return false;
        }
    }

    function setExtensionUsed() {
        try {
            sessionStorage.setItem(SESSION_EXTENSION_KEY, '1');
        } catch {}
    }

    function currentSessionLimit() {
        return SESSION_LIMIT_SECONDS + (getExtensionUsed() ? EXTENSION_SECONDS : 0);
    }

    // --- Bộ đếm theo NGÀY (dùng chung xuyên site qua GM storage, giữ nguyên qua các lần khởi động lại trình duyệt) ---
    function getDailyUsage() {
        const raw = gmGet(DAILY_USAGE_KEY, null);
        if (raw && raw.date === todayKey()) return raw.seconds || 0;
        return 0;
    }

    function addDailyUsage(deltaSeconds) {
        const updated = getDailyUsage() + deltaSeconds;
        gmSet(DAILY_USAGE_KEY, { date: todayKey(), seconds: updated });
        return updated;
    }

    function hideLockOverlay() {
        if (!lockOverlay) return;
        lockOverlay.remove();
        lockOverlay = null;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (bubble) bubble.style.display = 'flex';
        if (!document.hidden) startDistractionTracking();
    }

    // Bảng che toàn màn hình, chặn tương tác với trang, kèm 1 câu động viên ngẫu nhiên.
    // reason: 'session' (hết giờ phiên, có thể còn lượt gia hạn) | 'daily' (đã hết 30 phút/ngày)
    function showLockOverlay(reason) {
        if (lockOverlay) return;
        stopDistractionTracking();

        if (bubble) bubble.style.display = 'none'; // ẩn thanh nhắc để khỏi chồng lên bảng khoá

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        injectStyles();

        // Lớp nền mờ bao phủ toàn màn hình (Backdrop)
        lockOverlay = document.createElement('div');
        lockOverlay.id = 'study-lock-overlay';
        Object.assign(lockOverlay.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '2147483647',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            webkitBackdropFilter: 'blur(16px)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            boxSizing: 'border-box',
            overflowY: 'auto'
        });

        const isDaily = reason === 'daily';

        // Khung nội dung chính (Modal Card): Tối ưu độ rộng & độ cao cho màn hình laptop
        const card = document.createElement('div');
        card.className = 'study-lock-card';
        Object.assign(card.style, {
            margin: 'auto',
            width: '100%',
            maxWidth: '720px',             // Tăng độ rộng lên 720px để hiển thị thoải mái trên laptop
            minHeight: '460px',            // Tăng độ cao, tạo bố cục thông thoáng
            background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 50px rgba(245, 158, 11, 0.12)',
            padding: '44px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '20px',
            boxSizing: 'border-box',
            animation: 'lockFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        });

        // Huy hiệu icon nổi bật ở trung tâm
        const iconWrapper = document.createElement('div');
        Object.assign(iconWrapper.style, {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isDaily ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: isDaily ? '2px solid rgba(239, 68, 68, 0.4)' : '2px solid rgba(245, 158, 11, 0.4)',
            boxShadow: isDaily ? '0 0 30px rgba(239, 68, 68, 0.25)' : '0 0 30px rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            lineHeight: '1',
            flexShrink: '0',
            margin: '0 auto'
        });
        iconWrapper.textContent = isDaily ? '⛔' : '🔒';
        card.appendChild(iconWrapper);

        // Tiêu đề thông báo
        const title = document.createElement('div');
        title.textContent = isDaily
            ? 'Bạn đã dùng hết 30 phút mạng xã hội cho hôm nay!'
            : 'Đã hết giờ lướt mạng xã hội trong phiên này!';
        Object.assign(title.style, {
            fontSize: '24px',
            fontWeight: '800',
            color: '#ffffff',
            maxWidth: '620px',
            lineHeight: '1.35',
            letterSpacing: '-0.02em',
            margin: '0',
            flexShrink: '0'
        });
        card.appendChild(title);

        // Khung thông điệp động viên
        const msgBox = document.createElement('div');
        msgBox.textContent = `"${randomMessage()}"`;
        Object.assign(msgBox.style, {
            width: '100%',
            maxWidth: '600px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '14px',
            padding: '16px 24px',
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#e2e8f0',
            fontStyle: 'italic',
            boxSizing: 'border-box',
            margin: '0 auto',
            flexShrink: '0'
        });
        card.appendChild(msgBox);

        // Nhóm nút bấm hành động (Đồng nhất độ rộng, căn giữa tuyệt đối, không bị lệch)
        const actions = document.createElement('div');
        Object.assign(actions.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '460px',
            margin: '4px auto 0 auto',
            flexShrink: '0'
        });

        // Nút chính: Quay lại học ngay
        const cta = document.createElement('button');
        cta.textContent = '📚 Quay lại học / làm việc ngay';
        Object.assign(cta.style, {
            width: '100%',
            height: '50px',
            border: 'none',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)',
            transition: 'transform .15s ease, box-shadow .15s ease, filter .15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            outline: 'none'
        });
        cta.addEventListener('mouseenter', () => {
            cta.style.transform = 'translateY(-1px)';
            cta.style.boxShadow = '0 6px 24px rgba(245, 158, 11, 0.55)';
            cta.style.filter = 'brightness(1.05)';
        });
        cta.addEventListener('mouseleave', () => {
            cta.style.transform = 'translateY(0)';
            cta.style.boxShadow = '0 4px 18px rgba(245, 158, 11, 0.4)';
            cta.style.filter = 'none';
        });
        cta.addEventListener('click', () => {
            window.location.href = STUDY_URL;
        });
        actions.appendChild(cta);

        // Nút gia hạn: chỉ hiện khi lý do khoá là hết giờ phiên (chưa chạm giới hạn ngày)
        // và phiên này chưa dùng lượt gia hạn nào.
        const canExtend = !isDaily && !getExtensionUsed();
        if (canExtend) {
            const extendBtn = document.createElement('button');
            extendBtn.textContent = '➕ Cho tôi thêm 10 phút (chỉ 1 lần/phiên)';
            Object.assign(extendBtn.style, {
                width: '100%',
                height: '46px',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#f8fafc',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background .15s ease, border-color .15s ease, transform .15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                outline: 'none'
            });
            extendBtn.addEventListener('mouseenter', () => {
                extendBtn.style.background = 'rgba(255, 255, 255, 0.12)';
                extendBtn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            });
            extendBtn.addEventListener('mouseleave', () => {
                extendBtn.style.background = 'rgba(255, 255, 255, 0.06)';
                extendBtn.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            });
            extendBtn.addEventListener('click', () => {
                setExtensionUsed();
                hideLockOverlay();
            });
            actions.appendChild(extendBtn);
        }

        card.appendChild(actions);

        // Ghi chú nhỏ dưới cùng
        const hint = document.createElement('div');
        hint.textContent = isDaily
            ? 'Giới hạn 30 phút/ngày sẽ được làm mới vào ngày mai.'
            : canExtend
            ? 'Hoặc đóng tab này để nghỉ ngơi.'
            : 'Bạn đã dùng hết lượt gia hạn của phiên này. Muốn tiếp tục, hãy khởi động lại trình duyệt (tối đa 30 phút/ngày).';
        Object.assign(hint.style, {
            fontSize: '13px',
            color: '#94a3b8',
            maxWidth: '560px',
            lineHeight: '1.55',
            margin: '0 auto',
            opacity: '0.85',
            flexShrink: '0'
        });
        card.appendChild(hint);

        lockOverlay.appendChild(card);
        document.body.appendChild(lockOverlay);
    }

    function checkAndLock(sessionElapsed, dailyUsed) {
        if (lockOverlay) return;
        const se = sessionElapsed !== undefined ? sessionElapsed : getElapsedSeconds();
        const du = dailyUsed !== undefined ? dailyUsed : getDailyUsage();

        if (du >= DAILY_LIMIT_SECONDS) {
            showLockOverlay('daily');
        } else if (se >= currentSessionLimit()) {
            showLockOverlay('session');
        }
    }

    // Đếm thời gian thực tế đang xem Facebook/Reddit (chỉ tính khi tab đang active).
    function startDistractionTracking() {
        if (!isDistractingSite()) return;
        if (document.hidden) return;
        if (distractionInterval) return;

        checkAndLock();
        if (lockOverlay) return;

        distractionInterval = setInterval(() => {
            if (document.hidden || lockOverlay) return;

            const sessionElapsed = getElapsedSeconds() + 1;
            setElapsedSeconds(sessionElapsed);

            const dailyUsed = addDailyUsage(1);

            checkAndLock(sessionElapsed, dailyUsed);
        }, 1000);
    }

    function stopDistractionTracking() {
        if (distractionInterval) {
            clearInterval(distractionInterval);
            distractionInterval = null;
        }
    }

    function createBubble() {
        if (bubble || document.hidden || !document.body) return;

        bubble = document.createElement('div');
        bubble.id = 'study-reminder-bubble';

        const saved = loadState();

        Object.assign(bubble.style, {
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minWidth: MIN_WIDTH + 'px',
            minHeight: MIN_HEIGHT + 'px',
            padding: '0 6px 0 16px',
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
            color: '#fff',
            borderRadius: '24px',
            zIndex: '2147483647',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
            fontSize: '13px',
            lineHeight: '1',
            fontWeight: '500',
            boxShadow: '0 4px 20px rgba(0,0,0,.3), 0 1px 4px rgba(0,0,0,.2)',
            animation: 'pulseGlow 2.5s infinite',
            border: '2px solid rgba(255,215,0,0.8)',
            cursor: 'pointer',
            boxSizing: 'border-box',
            touchAction: 'none',
            userSelect: 'none',
            overflow: 'hidden'
        });

        // --- Vùng chữ chạy (marquee) ---
        const viewport = document.createElement('div');
        viewport.className = 'ticker-viewport';
        Object.assign(viewport.style, {
            flex: '1',
            minWidth: '0',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
        });

        const track = document.createElement('div');
        track.className = 'ticker-track';
        Object.assign(track.style, {
            position: 'absolute',
            top: '50%',
            left: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            whiteSpace: 'nowrap',
            willChange: 'transform',
            transform: 'translateY(-50%)'
        });

        const text = document.createElement('span');
        text.className = 'ticker-text';
        text.textContent = randomMessage();
        Object.assign(text.style, {
            whiteSpace: 'nowrap',
            flexShrink: '0',
            fontSize: '13px',
            lineHeight: '1.2'
        });
        track.appendChild(text);

        // --- "Nút" Học ngay, chạy theo chữ (chỉ mang tính hiển thị, cả thanh đều bấm được) ---
        const studyButton = document.createElement('span');
        studyButton.className = 'ticker-btn';
        studyButton.textContent = '📚 Học ngay';
        Object.assign(studyButton.style, {
            display: 'inline-flex',
            alignItems: 'center',
            background: '#ff9800',
            color: '#fff',
            fontWeight: '700',
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
            flexShrink: '0',
            lineHeight: '1',
            boxShadow: '0 1px 3px rgba(0,0,0,.2)'
        });
        track.appendChild(studyButton);

        viewport.appendChild(track);
        bubble.appendChild(viewport);

        // --- Nút đóng (duy nhất không mở trang học) ---
        const close = document.createElement('div');
        close.innerHTML = '✕';
        Object.assign(close.style, {
            flexShrink: '0',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255,255,255,.2)',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
            lineHeight: '1',
            transition: 'background .15s'
        });
        close.addEventListener('mouseenter', () => close.style.background = 'rgba(255,255,255,.35)');
        close.addEventListener('mouseleave', () => close.style.background = 'rgba(255,255,255,.2)');
        close.addEventListener('click', e => {
            e.stopPropagation();
            if (marqueeAnim) {
                marqueeAnim.cancel();
                marqueeAnim = null;
            }
            bubble.remove();
            bubble = null;
        });
        bubble.appendChild(close);

        // --- Tay cầm để kéo to/nhỏ (góc dưới phải) — vùng hit lớn hơn để dễ bắt ---
        const resizeHandle = document.createElement('div');
        Object.assign(resizeHandle.style, {
            position: 'absolute',
            right: '0',
            bottom: '0',
            width: '18px',
            height: '18px',
            cursor: 'nwse-resize',
            touchAction: 'none',
            // Dùng SVG-like stripes bằng CSS gradient, rõ ràng hơn
            background:
                'repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(255,255,255,.55) 3px, rgba(255,255,255,.55) 4px)',
            borderRadius: '0 0 22px 0'
        });
        bubble.appendChild(resizeHandle);

        document.body.appendChild(bubble);

        applyState(saved);

        makeDraggable(bubble, [close, resizeHandle]);
        makeResizable(bubble, resizeHandle);

        startMarquee();
    }

    // Dùng Pointer Events để hỗ trợ cả chuột lẫn cảm ứng.
    // Nếu gần như không di chuyển (dưới TAP_THRESHOLD) => coi là "click" => mở trang học.
    // Nếu di chuyển nhiều hơn => coi là kéo thả bình thường.
    function makeDraggable(el, excludeEls) {
        let dragging = false;
        let startX, startY, startLeft, startTop;

        el.addEventListener('pointerdown', function (e) {
            if (excludeEls.includes(e.target)) return;

            dragging = true;
            el.classList.add('dragging');
            el.style.cursor = 'grabbing';
            el.setPointerCapture(e.pointerId);

            const rect = el.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;
        });

        el.addEventListener('pointermove', function (e) {
            if (!dragging) return;

            const rect = el.getBoundingClientRect();
            let left = startLeft + (e.clientX - startX);
            let top = startTop + (e.clientY - startY);

            left = clamp(left, 0, Math.max(0, window.innerWidth - rect.width));
            top = clamp(top, 0, Math.max(0, window.innerHeight - rect.height));

            el.style.left = left + 'px';
            el.style.top = top + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        });

        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            el.classList.remove('dragging');
            el.style.cursor = 'pointer';

            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);
            const moved = dx > TAP_THRESHOLD || dy > TAP_THRESHOLD;

            if (moved) {
                const rect = el.getBoundingClientRect();
                saveState({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                });
            } else {
                // Nhấp vào bất kỳ đâu trên thanh (trừ nút X) => nhảy vào trang học
                window.open(STUDY_URL, '_blank');
            }
        }

        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);
    }

    function makeResizable(el, handle) {
        let resizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('pointerdown', function (e) {
            e.stopPropagation();
            resizing = true;
            el.classList.add('resizing');
            handle.setPointerCapture(e.pointerId);

            const rect = el.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startX = e.clientX;
            startY = e.clientY;
        });

        handle.addEventListener('pointermove', function (e) {
            if (!resizing) return;

            const rect = el.getBoundingClientRect();
            let width = startWidth + (e.clientX - startX);
            let height = startHeight + (e.clientY - startY);

            width = clamp(width, MIN_WIDTH, Math.min(MAX_WIDTH, window.innerWidth - rect.left));
            height = clamp(height, MIN_HEIGHT, Math.min(MAX_HEIGHT, window.innerHeight - rect.top));

            el.style.width = width + 'px';
            el.style.height = height + 'px';
        });

        function endResize(e) {
            if (!resizing) return;
            resizing = false;
            el.classList.remove('resizing');

            const rect = el.getBoundingClientRect();
            saveState({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });

            startMarquee(); // bề rộng đổi => tính lại chữ chạy
        }

        handle.addEventListener('pointerup', endResize);
        handle.addEventListener('pointercancel', endResize);
    }

    function updateMessage() {
        if (!bubble) return;
        const textEl = bubble.querySelector('.ticker-text');
        if (!textEl) return;
        textEl.textContent = randomMessage();
        startMarquee();
    }

    function scheduleUpdates() {
        stopScheduledUpdates();
        if (document.hidden) return;

        const delay = Math.random() * (10 - 5) * 60 * 1000 + 5 * 60 * 1000;

        updateTimer = setTimeout(() => {
            if (document.hidden) return;
            if (!bubble) {
                createBubble();
            } else {
                updateMessage();
            }
            scheduleUpdates();
        }, delay);
    }

    function stopScheduledUpdates() {
        if (updateTimer) {
            clearTimeout(updateTimer);
            updateTimer = null;
        }
    }

    function initTab() {
        if (isInitialized) return;
        if (document.hidden) return;
        if (!document.body) return;
        isInitialized = true;

        injectStyles();
        createBubble();
        scheduleUpdates();
        startDistractionTracking();
    }

    function onVisibilityChange() {
        if (document.hidden) {
            // Tab chuyển sang nền -> tạm dừng animation và timer để giảm tải hệ thống
            if (bubble) {
                bubble.style.animationPlayState = 'paused';
            }
            pauseMarquee();
            stopScheduledUpdates();
            stopDistractionTracking();
        } else {
            // Tab trở lại hoạt động -> khởi tạo nếu chưa có, hoặc resume và đồng bộ lại
            if (!isInitialized) {
                initTab();
            } else {
                if (bubble) {
                    const saved = loadState();
                    applyState(saved);
                    bubble.style.animationPlayState = 'running';
                    resumeMarquee();
                }
                scheduleUpdates();
                startDistractionTracking();
            }
        }
    }

    // Đồng bộ vị trí tức thì giữa các tab qua GM_addValueChangeListener
    if (typeof GM_addValueChangeListener === 'function') {
        try {
            GM_addValueChangeListener(STATE_KEY, (name, oldVal, newVal, remote) => {
                if (!remote) return; // Chỉ xử lý khi thay đổi xuất phát từ tab khác
                if (document.hidden || !bubble) return; // Tab ẩn sẽ tự đồng bộ khi active
                try {
                    const state = typeof newVal === 'string' ? JSON.parse(newVal) : newVal;
                    if (state && typeof state === 'object') {
                        applyState(state);
                        startMarquee();
                    }
                } catch {}
            });
        } catch {}
    }

    // Giữ thanh nhắc trong màn hình nếu cửa sổ trình duyệt đổi kích thước
    window.addEventListener('resize', () => {
        if (document.hidden || !bubble) return;
        clampToViewport(bubble);
    });

    document.addEventListener('visibilitychange', onVisibilityChange);

    // Khởi động khi tab đang hiển thị
    if (!document.hidden) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTab, { once: true });
        } else {
            initTab();
        }
    }

})();
