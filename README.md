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
