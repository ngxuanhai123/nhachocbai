# ⏰ Nhắc Nhở Học Bài Pro

![Version](https://img.shields.io/badge/version-6.4-blue)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-%E2%9C%93-00485B)
![Platform](https://img.shields.io/badge/all-websites-4EAA25)
![Study-Link](https://img.shields.io/badge/study-Memrise-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> 🚫 Thanh nhắc học chạy ngang màn hình + **khóa màn hình** khi lướt Facebook/Reddit quá giờ. Đừng để thời gian trôi qua vô ích!

---

## 📖 Mô tả

**Nhắc Nhở Học Bài Pro** là UserScript Tampermonkey chạy trên **mọi trang web** (`*://*/*`). Script hoạt động theo hai cơ chế song song:

1. **Thanh nhắc học** — hiển thị góc màn hình mọi lúc, bấm vào chuyển tới trang học.
2. **Bộ kiểm soát mạng xã hội** — đếm thời gian thực bạn xem Facebook/Reddit và khóa màn hình khi vượt giới hạn.

---

## 🎯 Tính năng

| Tính năng | Chi tiết |
|-----------|---------|
| 📺 Thanh nhắc học marquee | Chữ chạy ngang với thông điệp động viên ngẫu nhiên |
| 🔒 Khóa màn hình | Hiện khi lướt FB/Reddit > 10 phút/phiên hoặc > 30 phút/ngày |
| ➕ Gia hạn khẩn cấp | Thêm 10 phút, chỉ được dùng 1 lần/phiên trình duyệt |
| 📊 Giới hạn ngày | 30 phút cộng dồn toàn bộ phiên, xuyên tab, xuyên site |
| 🖱️ Kéo & Thả | Di chuyển thanh nhắc tự do, nhớ vị trí qua GM storage |
| ↔️ Resize | Kéo góc dưới phải để thay đổi kích thước, nhớ kích thước |
| 🔄 Đồng bộ đa tab | Vị trí/kích thước đồng bộ ngay lập tức sang mọi tab đang mở |
| ⚡ Tiết kiệm tài nguyên | Animation, timer, interval đều tạm dừng khi tab ở nền |
| 🔁 Tự cập nhật | `@updateURL` trỏ tới GitHub, Tampermonkey tự kiểm tra version mới |

---

## 🚀 Cài đặt

### Cách 1 — Click để cài (khuyến nghị)

1. Cài **Tampermonkey** cho trình duyệt:
   [Chrome](https://chrome.google.com/webstore/detail/tampermonkey) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. Click vào link bên dưới để cài thẳng:
   👉 **[Cài đặt Nhắc Nhở Học Bài Pro](https://raw.githubusercontent.com/ngxuanhai123/nhachocbai/main/nhac-nho.js)**
3. Bấm **Install** trong cửa sổ Tampermonkey hiện ra.

### Cách 2 — Thủ công

1. Tampermonkey → **Create a new script**
2. Dán toàn bộ nội dung `nhac-nho.js` vào
3. **Ctrl + S** để lưu

---

## 💡 Cách dùng

1. Script tự chạy khi mở **bất kỳ trang web nào**.
2. **Thanh nhắc học** (màu xanh, viền vàng) xuất hiện ở góc màn hình — bấm vào để mở trang học ngay.
3. Nút **✕** trên thanh để ẩn tạm thời (sẽ hiện lại sau 5–10 phút ngẫu nhiên).
4. Kéo thanh đến vị trí bạn thích — script nhớ vị trí này cho tất cả các tab.
5. Kéo góc dưới phải để thay đổi kích thước.
6. Lướt **Facebook/Reddit** quá **10 phút/phiên** → màn hình bị khóa.
   - Chưa dùng lượt gia hạn: bấm **"➕ Cho tôi thêm 10 phút"**.
   - Bấm **"📚 Quay lại học ngay"** để chuyển sang Memrise.
7. Sau **30 phút tổng cộng trong ngày** → bị khóa hoàn toàn đến 0h hôm sau.

---

## ⚙️ Cấu hình

Mở file `nhac-nho.js` và chỉnh các hằng số ở đầu script:

```javascript
// ⚠️ Đổi thành link trang học của bạn
const STUDY_URL = "https://community-courses.memrise.com/";

// Giới hạn thời gian mạng xã hội
const SESSION_LIMIT_SECONDS = 10 * 60;  // 10 phút/phiên
const EXTENSION_SECONDS    = 10 * 60;  // gia hạn 10 phút (1 lần/phiên)
const DAILY_LIMIT_SECONDS  = 30 * 60;  // tổng 30 phút/ngày

// Trang bị giám sát (dùng RegExp)
const DISTRACTION_HOSTS = [/(^|\.)facebook\.com$/i, /(^|\.)reddit\.com$/i];
```

### Bảng hằng số đầy đủ

| Hằng số | Giá trị mặc định | Ý nghĩa |
|---------|-----------------|---------|
| `STUDY_URL` | Memrise | Trang học chuyển tới khi bấm vào thanh |
| `DEFAULT_WIDTH` | 300px | Chiều rộng ban đầu của thanh nhắc |
| `DEFAULT_HEIGHT` | 46px | Chiều cao ban đầu |
| `MIN_WIDTH` | 180px | Chiều rộng tối thiểu khi resize |
| `MIN_HEIGHT` | 40px | Chiều cao tối thiểu |
| `MAX_WIDTH` | 520px | Chiều rộng tối đa |
| `MAX_HEIGHT` | 80px | Chiều cao tối đa |
| `TAP_THRESHOLD` | 8px | Dưới mức này coi là "click" (mở trang học), trên là "kéo" |
| `MARQUEE_SPEED` | 70 px/s | Tốc độ chữ chạy |
| `MARQUEE_MIN_DURATION` | 4000ms | Thời gian tối thiểu một vòng marquee |
| `SESSION_LIMIT_SECONDS` | 600s (10 phút) | Giới hạn xem mạng xã hội mỗi phiên trình duyệt |
| `EXTENSION_SECONDS` | 600s (10 phút) | Thời gian gia hạn khẩn cấp |
| `DAILY_LIMIT_SECONDS` | 1800s (30 phút) | Tổng giới hạn mỗi ngày |

---

## 🏗️ Kiến trúc & Giải thích code

### Storage — Nơi lưu dữ liệu

| Storage | Dùng cho | Scope |
|---------|----------|-------|
| `GM_setValue/getValue` | Vị trí/kích thước thanh nhắc (`studyReminderState`), tổng thời gian dùng mạng xã hội trong ngày (`studyLockDailyUsage`) | **Xuyên tất cả trang web**, persist qua restart trình duyệt |
| `sessionStorage` | Số giây đã lướt mạng xã hội trong phiên (`studyLockElapsedSeconds`), đã dùng lượt gia hạn chưa (`studyLockExtensionUsed`) | **Chỉ trong phiên** — reset khi đóng tab/trình duyệt |

### Hàm tiện ích lõi

| Hàm | Mô tả |
|-----|-------|
| `gmGet(key, fallback)` | Đọc giá trị từ GM storage, tự parse JSON, fallback về `localStorage` nếu không có GM |
| `gmSet(key, value)` | Ghi giá trị vào GM storage, tự stringify JSON, fallback về `localStorage` |
| `clamp(value, min, max)` | Kẹp giá trị vào khoảng `[min, max]` |
| `randomMessage()` | Trả về 1 thông điệp ngẫu nhiên từ mảng `messages` |
| `todayKey()` | Tạo key ngày theo định dạng `"YYYY-M-D"` dùng để kiểm tra giới hạn ngày |

### Quản lý state (vị trí & kích thước)

| Hàm | Mô tả |
|-----|-------|
| `loadState()` | Đọc `{ left, top, width, height }` từ GM storage |
| `saveState(partial)` | Merge và ghi state mới vào GM storage (chỉ cập nhật các trường được truyền vào) |
| `applyState(saved)` | Áp dụng state lên thanh nhắc: clamp vị trí vào viewport, set `width/height/left/top` |
| `clampToViewport(el)` | Giữ phần tử luôn trong viewport (dùng khi cửa sổ trình duyệt thay đổi kích thước) |

### Marquee (chữ chạy)

| Hàm | Mô tả |
|-----|-------|
| `startMarquee()` | Tạo animation Web Animations API (`track.animate(...)`) chạy chữ từ phải sang trái, vô hạn. Tốc độ tính từ `MARQUEE_SPEED` và kích thước thực tế của thanh |
| `pauseMarquee()` | Tạm dừng animation khi tab vào nền |
| `resumeMarquee()` | Tiếp tục animation khi tab trở lại foreground |
| `updateMessage()` | Đổi nội dung chữ sang thông điệp ngẫu nhiên mới, gọi lại `startMarquee()` |

### Bộ đếm mạng xã hội

| Hàm | Mô tả |
|-----|-------|
| `isDistractingSite()` | Kiểm tra hostname hiện tại có khớp `DISTRACTION_HOSTS` không |
| `getElapsedSeconds()` | Đọc số giây đã lướt trong phiên này từ `sessionStorage` |
| `setElapsedSeconds(v)` | Ghi số giây vào `sessionStorage` |
| `getExtensionUsed()` | Kiểm tra có đã dùng lượt gia hạn trong phiên này chưa |
| `setExtensionUsed()` | Đánh dấu đã dùng lượt gia hạn |
| `currentSessionLimit()` | Trả về giới hạn phiên hiện tại (10 phút, hoặc 20 phút nếu đã gia hạn) |
| `getDailyUsage()` | Đọc tổng giây dùng trong ngày từ GM storage (tự reset sang 0 nếu là ngày mới) |
| `addDailyUsage(delta)` | Cộng thêm `delta` giây vào tổng ngày, ghi lại GM storage |
| `startDistractionTracking()` | Bắt đầu `setInterval` 1 giây đếm thời gian lướt; kiểm tra và khoá nếu vượt giới hạn; chỉ chạy trên trang trong `DISTRACTION_HOSTS` và khi tab đang active |
| `stopDistractionTracking()` | Dừng interval đếm giờ |
| `checkAndLock(se, du)` | So sánh thời gian đã dùng với giới hạn, gọi `showLockOverlay` nếu vượt |

### Màn hình khoá (Lock Overlay)

| Hàm | Mô tả |
|-----|-------|
| `showLockOverlay(reason)` | Tạo overlay toàn màn hình chặn tương tác. `reason = 'session'` (hết phiên, còn thể gia hạn) hoặc `'daily'` (hết 30 phút/ngày). Ẩn thanh nhắc, khóa scroll trang |
| `hideLockOverlay()` | Xóa overlay, khôi phục scroll, hiện lại thanh nhắc, restart bộ đếm mạng xã hội |

**Nội dung overlay gồm:**
- 🔒 Icon khoá lớn
- Tiêu đề lý do khoá
- Câu thông điệp động viên ngẫu nhiên
- Nút **"➕ Gia hạn 10 phút"** (chỉ hiện khi `reason = 'session'` và chưa dùng gia hạn)
- Nút **"📚 Quay lại học ngay"** → chuyển tới `STUDY_URL`
- Ghi chú nhỏ phía dưới

### Tạo thanh nhắc học

| Hàm | Mô tả |
|-----|-------|
| `createBubble()` | Tạo toàn bộ DOM của thanh nhắc: container, ticker viewport, ticker track, text, nút "Học ngay", nút ✕, resize handle. Áp dụng state đã lưu, gắn event drag & resize, chạy marquee |
| `injectStyles()` | Chèn `<style>` một lần vào `<head>` với animation `pulseGlow` (viền vàng nhấp nháy) và class `.dragging/.resizing` tạm dừng animation |

**Cấu trúc DOM của thanh nhắc:**
```
#study-reminder-bubble (fixed, flex)
├── .ticker-viewport (flex:1, overflow:hidden)
│   └── .ticker-track (absolute, animate translateX)
│       ├── .ticker-text  "📚 Đến giờ học rồi đó!"
│       └── .ticker-btn   "📚 Học ngay"
├── div.close-btn (✕)
└── div.resize-handle (góc dưới phải, 18×18px)
```

### Kéo thả & Resize

| Hàm | Mô tả |
|-----|-------|
| `makeDraggable(el, excludeEls)` | Dùng **Pointer Events** (`pointerdown/move/up/cancel`) để hỗ trợ cả chuột lẫn cảm ứng. Nếu tổng di chuyển < `TAP_THRESHOLD` (8px) → coi là click → mở `STUDY_URL` trong tab mới. Nếu kéo xa hơn → cập nhật vị trí và `saveState()` |
| `makeResizable(el, handle)` | Gắn Pointer Events lên resize handle góc dưới phải. Clamp kích thước vào `[MIN, MAX]` và không vượt viewport. Sau khi thả → `saveState()` và `startMarquee()` để tính lại tốc độ |

### Lên lịch cập nhật thông điệp

| Hàm | Mô tả |
|-----|-------|
| `scheduleUpdates()` | Đặt `setTimeout` ngẫu nhiên 5–10 phút để gọi `updateMessage()` (hoặc `createBubble()` nếu đang ẩn). Tự lên lịch lại sau mỗi lần |
| `stopScheduledUpdates()` | Hủy timer đang chờ |

### Quản lý vòng đời tab

| Hàm / Sự kiện | Mô tả |
|----------------|-------|
| `initTab()` | Khởi tạo một lần duy nhất: inject CSS → tạo bubble → lên lịch cập nhật → bắt đầu đếm giờ mạng xã hội. Chỉ chạy khi tab đang visible |
| `onVisibilityChange()` | Xử lý sự kiện `visibilitychange`: **vào nền** → tạm dừng animation, marquee, timer, interval; **trở lại** → khởi tạo nếu chưa có, hoặc đồng bộ state + resume |
| `GM_addValueChangeListener` | Lắng nghe thay đổi `STATE_KEY` từ **tab khác** (`remote = true`) → gọi `applyState()` để đồng bộ vị trí/kích thước ngay lập tức |
| `window resize` | Gọi `clampToViewport()` để giữ thanh nhắc trong màn hình khi cửa sổ trình duyệt co lại |

### Luồng khởi động

```
Trang web load
    └─ document.hidden?
          ├─ Có → Chờ visibilitychange
          └─ Không → DOMContentLoaded (hoặc ngay lập tức nếu đã load)
                         └─ initTab()
                               ├─ injectStyles()
                               ├─ createBubble()  ← load state từ GM
                               ├─ scheduleUpdates()
                               └─ startDistractionTracking()  ← chỉ trên FB/Reddit
```

---

## 📁 Cấu trúc file

```
nhachocbai/
├── nhac-nho.js   # Toàn bộ script (898 dòng, ~34KB)
└── README.md     # Tài liệu này
```

---

## 🛠️ Công nghệ

| Công nghệ | Dùng để |
|-----------|---------|
| **Tampermonkey UserScript API** | `GM_getValue`, `GM_setValue`, `GM_addValueChangeListener` |
| **Web Animations API** | `element.animate()` cho marquee mượt, kiểm soát được (pause/resume/cancel) |
| **Pointer Events API** | Drag & resize hỗ trợ cả chuột lẫn màn hình cảm ứng |
| **sessionStorage** | Đếm thời gian phiên, lưu trạng thái gia hạn |
| **CSS `@keyframes`** | Animation `pulseGlow` viền vàng nhấp nháy |

---

## 🔗 Liên kết

- 📦 **Cài đặt trực tiếp:** https://raw.githubusercontent.com/ngxuanhai123/nhachocbai/main/nhac-nho.js
- 📂 **GitHub:** https://github.com/ngxuanhai123/nhachocbai

---

## 📋 Lịch sử phiên bản

| Phiên bản | Thay đổi |
|-----------|---------|
| **6.4** | Fix overlay elements chồng lấn nhau khi hết thời gian; dùng `gap` thay `marginBottom`, thêm `overflowY: auto` |
| **6.3** | Fix lỗi kích thước không nhất quán; cải thiện visual (gradient, border-radius 24px, system font, resize handle 18px) |
| **6.2** | Fix nhớ vị trí qua GM storage; chỉ chạy trên tab đang active để giảm tải |
| **6.x** | Thêm đồng bộ đa tab qua `GM_addValueChangeListener`; lazy init khi tab ở nền |

---

## ✍️ Tác giả

[**Ng Xuan Hai**](https://github.com/ngxuanhai123)
