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
