# PACE Club

繁體中文靜態跑團網站，使用 HTML、CSS、JavaScript，無需安裝套件或資料庫。

## 在電腦上預覽

1. 開啟 `C:\Users\Neal\Documents\Codex\PACE CLUB` 資料夾。
2. 用 Chrome、Edge 或其他現代瀏覽器開啟 `index.html`（直接雙擊即可）。
3. 修改檔案並儲存後，回到瀏覽器按 `Ctrl + R` 重新整理。

也可以用 VS Code 開啟此資料夾，安裝 Live Server 擴充套件後，在 `index.html` 上按右鍵選擇 **Open with Live Server**，儲存變更時頁面會自動更新。

手機版可在瀏覽器按 `F12`，開啟裝置工具列（`Ctrl + Shift + M`）並選擇手機尺寸來預覽。

## 檔案

- `index.html`：網站內容、活動資訊及加入說明視窗。
- `styles.css`：黑白與螢光綠的響應式版面。
- `script.js`：加入說明視窗、年份及每週團練行事曆下載。

## 功能與修改

「加入跑團」開啟活動說明，沒有收集、儲存或送出個人資料。未提供報名連結，因此目前不做線上報名。正式使用時，可將按鈕接到跑團的 LINE 或報名表單。

行事曆從下一次週三 18:00（台灣時間）開始，每週重複；沒有假設活動結束時間。若改動團練時間，需同步修改 `index.html` 及 `script.js` 的行事曆設定。

網站無需網路即可開啟；Google Fonts 中文字型與 Google Maps 連結需要網路。字型無法載入時會自動使用電腦內建字型。

## 第一階段 SEO

正式網址為 `https://neal1106-source.github.io/pace-club/`。`index.html` 的 Title、Description、Canonical、Open Graph、X/Twitter Cards 與 JSON-LD 使用此網址；分享圖片沿用 `images/hero.jpg`，沒有新增外部套件。

- `favicon.svg`：黑底、萊姆綠 P 字品牌圖示。
- `sitemap.xml`：只列出唯一的首頁正式網址；頁內錨點不是獨立頁面。不填入無法維護的 lastmod 日期。
- `robots.txt`：允許 `/pace-club/` 並宣告 Sitemap，但存在下述 GitHub Pages 限制。
- JSON-LD 使用 `SportsOrganization`、`WebSite`、`WebPage`，僅描述已確認的品牌、跑步社群、新竹與集合地點。每週三 18:00 寫在描述中；未虛構個別活動日期、街道地址、電話、費用、評價或社群帳號，也未宣稱可取得活動複合式搜尋結果。

### GitHub Pages 子路徑與 robots.txt

此專案的 `robots.txt` 部署後位於 `https://neal1106-source.github.io/pace-club/robots.txt`。搜尋引擎讀取的是**網域根目錄** `https://neal1106-source.github.io/robots.txt`，不會將專案子路徑的檔案當成爬取規則，也不能用 HTML 連結或 Canonical 改變此規則。

若要正式啟用，需在使用者網站 `Neal1106-source.github.io` 的根目錄建立或合併 robots.txt，並保留其他網站既有規則；本次沒有操作該 Repository。根目錄若回傳 404，通常不會因此禁止爬取。若無法設定根目錄，可直接在 Search Console 提交本專案的 Sitemap。

參考：[Google robots.txt 說明](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt)、[Sitemap 提交方式](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。

### 部署後驗收與後續工作

1. 推送並完成 GitHub Pages 部署後，檢查首頁、`favicon.svg`、`images/hero.jpg`、`sitemap.xml`、`robots.txt` 回傳成功。CSS、JavaScript、圖片與 Favicon 採相對路徑；Canonical、社群分享與 Sitemap 採包含 `/pace-club/` 的絕對網址。
2. 在 Google Search Console 驗證 `https://neal1106-source.github.io/pace-club/` 的 URL 前置字元資源，提交 `sitemap.xml`，再使用網址檢查要求建立索引。未有驗證碼前不填入假的驗證標籤。
3. 使用 Schema Markup Validator 檢查 JSON-LD；以 Google Rich Results Test 檢查支援的搜尋功能。語法正確不保證取得複合式結果或收錄。
4. 使用社群平台的分享偵錯工具檢查預覽與快取。分享平台使用 JPEG 原圖，不會套用網頁的黑白 CSS；目前沿用既有照片，未另製分享卡。
5. 尚待檢查實際收錄、Google 選定的 Canonical、搜尋摘要、Core Web Vitals，以及實體裝置與舊版瀏覽器的 Favicon 相容性。持續觀察 Search Console，並在未來新增獨立內容頁時同步更新 Sitemap。

目前保留單一 H1、各段 H2 與倒數 H3；加入視窗的 H2 作為獨立對話框標題。兩張照片均已有描述實際畫面的 Alt，沒有堆疊地名關鍵字。這次不改動可見文字、CSS 或 JavaScript，以保持既有視覺與功能。

## GA4 穩定性與隱私修正

評估 ID：`G-1BD5BCB9DE`。僅 HTTPS 正式來源 `https://neal1106-source.github.io`，路徑為 `/pace-club/` 或 `/pace-club/index.html`，且有效同意分析後，才載入 Google 官方 gtag.js。沒有 GTM 容器，不增加套件。未同意／拒絕／過期時不載入 Google 分析程式。

### 初始化與重試

`analytics.js` 有 idle、loading、ready、failed 四種狀態，可於 `document.documentElement.dataset.gaState` 檢查。成功須實際執行 Google 程式；HTTP 200 或存在 script 元素不單獨當作成功。

- 每頁最多三次載入嘗試，失敗後冷卻兩秒，透過隱私視窗「重試載入分析」手動重試；再次接受 Cookie 不會掩蓋錯誤或無限重試。
- 12 秒逾時會保留失敗提示；重試以重新整理進行，避免仍在途中的 Google 腳本與新腳本重複執行。儲存受限時要求先重新整理、重新選擇。
- 同一頁只建立一次 gtag 佇列與 config；page_view 在 ready 後只主動送一次。接受同意後、載入中發生的事件最多暫存 30 筆，成功後才送；拒絕、撤回或過期會丟棄，未同意前的操作不補送。
- 所有全域隱私、網址、標題、Cookie 與 `send_page_view: false` 設定都先以 `gtag('set', ...)` 套用，再初始化及授予分析儲存同意，避免 Google 初始化觸發器先使用預設設定。

### 網址與 UTM 資料政策

是否允許載入只看正式來源／路徑與同意，與查詢參數分開。啟用分析前會以 History API 清理**瀏覽器實際網址**，因為自動事件可能直接讀取 document.location。這不改動 SEO Title、Canonical 或 Sitemap；既有合法元素 ID 錨點保留，但不送進分析網址。

僅保留下表 UTM 欄位及已審核的公開詞彙。未知參數一律移除；每個欄位只接受單一值、最多 64 字元，值必須由核准詞彙以連字號、底線或空白組成。不接受任意姓名、Email、電話、網址、控制字元、百分比二次編碼或重複鍵值。大小寫嚴格使用小寫；全形偽裝字元不自動轉換為可接受值。

| 欄位 | 核准詞彙 |
| --- | --- |
| utm_source | instagram, facebook, line, threads, youtube, google, newsletter, partner, direct |
| utm_medium | social, organic, paid, cpc, email, referral, qr |
| utm_campaign | pace, club, weekly, run, running, wednesday, hsinchu, recruitment, launch, spring, summer, autumn, winter, 2026, 2027, 新竹, 跑團, 團練, 跑步, 新手, 上班族, 週三 |
| utm_content | bio, profile, link, post, story, reel, video, image, button, hero, footer, banner, variant, a, b, 1, 2, 3 |
| utm_term | running, beginner, hsinchu, club, weekly, run, 新竹, 跑團, 跑步, 新手, 上班族 |

範例：`?utm_source=instagram&utm_medium=paid_social&utm_campaign=weekly_run_2026&utm_content=story_a&utm_term=新竹_跑步`。新行銷詞彙需先審核，再擴充 `utmVocabulary`，不是任意 UTM 字串都視為安全。清理後的 UTM 亦映射至 GA4 campaign_source、campaign_medium、campaign_name、campaign_content、campaign_term。

page_location 一律為本網站正式網址加上安全 UTM，不含錨點；page_referrer 為空；分析 page_title 統一與既有 SEO Title 相同，不動 HTML Title。廣告儲存、廣告使用者資料、廣告個人化皆 denied，Google signals 與廣告個人化旗標為 false；不傳送 user_id 或表單輸入。Google 自動收集使用者提供資料的遠端設定仍須依下述步驟關閉，不能把本機測試視為後台設定已完成。

History API 在分析啟用時也會清理同站網址；hashchange、popstate 會同步乾淨的分析網址，不主動送 page_view。既有網頁內導覽、加入說明、地圖與下載功能保留。

### 統一同意與撤回

`pace-club:analytics-consent:v2` 的同一格式紀錄含 version、value、updatedAt、expires，最多 180 天。LocalStorage 為共享持久來源，SessionStorage 與記憶體作為受限儲存的備援；以較新的紀錄為準，同時發生且時間相同時拒絕優先，舊 Session 拒絕不會永久蓋過新同意。v1 設定只遷移一次，保留原有同意的到期時間；有舊拒絕旗標時先採拒絕，之後可重新同意。

跨分頁接受、拒絕、撤回、清除或無效儲存紀錄會同步。撤回／過期先設 `ga-disable-G-1BD5BCB9DE`，停止曝光觀察、清掉待送事件，再清除實際分析 Cookie；持久儲存可用時重載以卸載 Google 監聽器。儲存受限時保留記憶體停用狀態，不重載回舊同意，仍可在本頁重新選擇。撤回不刪除已被 Google 接收的歷史資料，不能取消已送出的請求。

Cookie 清理涵蓋 `_ga`、`_ga_1BD5BCB9DE` 與 `pace_club_` 前綴，在主機／網域及 `/`、`/pace-club`、`/pace-club/` 路徑逐一過期。保留其他 Property 的專屬 Cookie（如 `_ga_OTHER_PROPERTY`）。共用的舊 `_ga` 仍會清除。新 Cookie 使用主機限定與本站路徑、180 天到期且不滑動展延。

### 招募事件

| 操作 | 事件 | 固定參數 |
| --- | --- | --- |
| 導覽、首頁、底部招募按鈕 | join_club_click | button_location: navigation / hero / closing |
| 團練「我想一起跑」 | join_run_click | button_location: weekly |
| 團練資訊面板可視至少 50% | weekly_run_view | section_name: weekly_run, visibility_percent: 50；每頁一次 |
| 查看集合地圖 | map_click | button_location: weekly |
| 啟動 .ics 下載 | calendar_download | button_location: join_dialog, file_format: ics |

曝光觀察 `#weekly .weekly-content`，不含側邊海報與留白。不支援 IntersectionObserver 或視窗無法容納面板一半時不虛構曝光。重新同意不重複本頁已送過的曝光；未送出的曝光若因撤回丟棄，下次同意可再觀察。下載表示啟動，不代表已儲存／匯入；加入點擊不是報名完成。沒有社群連結，因此沒有新增 social_click。

### 真實腳本測試與部署前驗收

測試在正式來源的隔離瀏覽器中映射本機檔案，**載入真實 gtag.js（HTTP 200）**，於網路層攔截 Google collect／其他分析端點，不把測試送進正式 GA4。收集請求因攔截而可能改走 google.com 備援，事件數以主要 google-analytics.com 端點核對，不能將人工阻擋引起的備援當作重複送達。

已測：安全及敏感 UTM、未知參數、重複鍵、二次編碼、正常錨點、History API、帶測試敏感值的 referrer；初始化失敗／逾時重試、同意與跨分頁、到期、Cookie 名稱／網域／路徑清除；五個自訂事件、390／768／1440px、原有功能。初始及錨點切換的 page_view 應維持一次，分析標題一致，所有請求不應含測試敏感值。

正式部署前須完成以下人工後台核對，再重跑真實腳本攔截測試；本次沒有操作後台：

1. GA4 → 管理 → 資料收集和修改 → 資料串流 → 選取 `G-1BD5BCB9DE` 網站串流。
2. 「加強型評估」齒輪 → 網頁瀏覽進階設定 → 關閉「根據瀏覽器記錄事件變更的網頁」類似選項；網站由程式控制 page_view。不要在後台另建由其他事件複製 page_view 的規則。
3. 關閉本站不需要的「站內搜尋」「表單互動」「影片參與」。若要只以自訂事件統計地圖／下載，關閉自動「外連點擊」「檔案下載」，避免在報表把 click／file_download 與 map_click／calendar_download 相加。scroll 可保留，但不作為招募曝光。
4. 同一串流 → Google 代碼 → 配置代碼設定 → 顯示全部 → 「允許納入使用者提供的資料」：關閉允許功能與自動偵測 Email／電話／地址；核對 Google 代碼「管理自動事件偵測」與串流加強型評估一致。不要新增 GTM 或另一份安裝碼。
5. 核對沒有額外關聯目的地／重複安裝／事件建立規則。需要報表維度時，在管理 → 自訂定義中註冊事件範圍的 button_location、section_name；需要時另設 visibility_percent 指標。關鍵事件與招募漏斗由管理者按業務定義設定。
6. 部署後先以 DevTools／Tag Assistant 在「未同意」「拒絕」「撤回」狀態確認無新 collect。取得測試授權後，才允許少量測試實際送達 GA4，即時／DebugView 核對五個事件及 campaign 維度；本次測試未驗證 Google 收件。
7. 另驗收實體手機、Safari、無痕、阻擋器、資料保留期限、清理網址的使用體驗，以及正式網路環境。不能把隔離 Chromium 測試視為所有瀏覽器皆通過。

參考：[Google 同意模式](https://developers.google.com/tag-platform/security/guides/consent)、[GA4 page_view](https://developers.google.com/analytics/devguides/collection/ga4/views)、[Google 代碼設定](https://support.google.com/analytics/answer/12131703?hl=zh-Hant)、[加強型評估](https://support.google.com/analytics/answer/9216061?hl=zh-Hant)。
