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

## Google Analytics 4 與隱私選擇

`analytics.js` 使用 Google 官方 gtag.js，評估 ID 為 `G-1BD5BCB9DE`（公開設定值，不是密鑰），沒有安裝 GTM 容器。初次訪問顯示繁體中文告知，接受、拒絕皆可操作；關閉告知不代表同意。頁尾「隱私與分析 Cookie 設定」可重新開啟並撤回。

- 採基本同意模式：未同意、拒絕或偏好過期時，不載入 gtag.js，也不發送分析或未同意的無 Cookie ping。
- 只有 HTTPS 正式來源 `https://neal1106-source.github.io`，且路徑為 `/pace-club/` 或 `/pace-club/index.html` 時才可能載入。本機、預覽網域及其他路徑均不會傳送正式分析流量。
- 為保守避免網址中的個資，含任何查詢參數或未知錨點的初始網址不載入 GA4；只允許空錨點、`#main`、`#about`、`#weekly`。因此 UTM 等查詢流量目前也不追蹤。
- 只主動送出固定 `page_view`，不讀取姓名、Email、電話、表單或使用者 ID；分析用頁面網址固定為 Canonical，來源網址為空，不傳送查詢參數或錨點。不要在未審查下新增自訂事件或使用者屬性。
- 同意前廣告、分析儲存皆預設 denied；同意後只開放 analytics_storage，持續禁止 ad_storage、ad_user_data、ad_personalization、Google signals 與廣告個人化。
- 偏好採具版本的 `pace-club:analytics-consent:v1` 本機儲存，最長 180 天；GA Cookie 使用 `pace_club` 前綴、僅限本網站 `/pace-club/` 路徑及目前主機。Cookie 不延長原有到期時間。
- 撤回／由同意改為拒絕時，先設定官方 `ga-disable-G-1BD5BCB9DE`，清除本網站前綴的分析 Cookie，再重新載入以卸載已執行的 Google 程式。保留拒絕偏好，其他分頁也會回應本機儲存異動。撤回不會刪除 Google 已收到的歷史資料或取消先前已送出的網路請求。
- 儲存不可用時仍可拒絕，預設不追蹤；接受僅限目前頁面。撤回後保持停用且不強制重載，避免舊同意被重新啟用；請在儲存恢復後重新整理並重新選擇。Google 腳本若遭廣告阻擋器攔截，其他功能仍可操作。

### GA4 部署後驗收

1. 在 GA4 管理後台確認評估 ID、正式網域及資料串流；關閉不需要的「加強型評估」（例如站內搜尋、表單互動、出站連結）、使用者提供的資料收集與廣告功能。本次未登入或改動 GA4 後台設定；遠端串流設定仍需由管理者核對。
2. 本機測試以攔截並模擬 Google 腳本的方式檢查接受、拒絕、撤回、持久化、Cookie 清除及網域限制；不向正式 GA4 傳送測試資料。模擬測試不等於真實 Google 收件驗證。
3. 部署後用瀏覽器 Network 與 Google Tag Assistant 確認：未同意／拒絕時無 gtag.js 或 collect；接受後只載入一次；撤回後停止 collect 且本站分析 Cookie 消失。檢查 payload 沒有姓名、Email、電話、網址查詢或自訂輸入文字。
4. 經同意的正式訪問才可在 GA4 即時報表確認；另檢查實體手機、Safari、無痕模式、廣告阻擋器、儲存限制與跨分頁撤回。GA4 回報可能延遲，且受訪客同意與阻擋設定影響。

官方依據：[基本同意模式](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)、[停用與隱私設定](https://developers.google.com/tag-platform/security/guides/privacy)、[GA4 設定參數](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)。
