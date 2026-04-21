let capture;
let pg; // 宣告變數，用來存放 createGraphics 產生的圖層
let bubbles = []; // 宣告陣列，用來存放泡泡資料

function setup() {
  // 第一步驟：產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏 p5.js 預設產生的 HTML <video> 元素，我們只需要將它畫在 Canvas 畫布內
  capture.hide(); 
}

function draw() {
  // 設定畫布的背景顏色為 #e7c6ff
  background('#e7c6ff');
  
  // 當攝影機已準備好且取得寬高時，利用 createGraphics 產生與視訊畫面相同寬高的圖層
  if (capture.width > 0 && !pg) {
    pg = createGraphics(capture.width, capture.height);
  }

  // 如果圖層已建立，進行泡泡效果的繪製
  if (pg) {
    pg.clear(); // 清除上一幀的畫面，保持圖層透明背景
    
    // 隨機產生新的泡泡
    if (random(1) < 0.15) { // 控制泡泡產生的機率 (大約 15%)
      bubbles.push({
        x: random(pg.width),
        y: pg.height + 30, // 從畫布底部外面開始
        r: random(10, 30), // 隨機半徑大小
        speed: random(2, 5) // 隨機上升速度
      });
    }
    
    pg.fill(255, 255, 255, 150); // 半透明白色的泡泡
    pg.noStroke();
    
    // 繪製並更新所有泡泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
      let b = bubbles[i];
      b.y -= b.speed; // 向上移動
      b.x += sin(frameCount * 0.05 + b.y * 0.01) * 2; // 讓泡泡左右微微搖擺
      pg.circle(b.x, b.y, b.r);
      
      // 如果泡泡超出畫面頂部，將其從陣列中移除以節省效能
      if (b.y < -50) {
        bubbles.splice(i, 1);
      }
    }
  }

  // 將影像的繪製對齊模式設定為「中心點」，方便後續置中
  imageMode(CENTER);
  
  // 計算影像顯示的寬高 (整個畫布寬高的 60%)
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  
  // 使用 push() 和 pop() 來確保翻轉效果只套用於目前的影像繪製
  push();
  // 將座標系統平移至畫布中心
  translate(width / 2, height / 2);
  // 水平翻轉 x 軸，解決左右顛倒的問題（產生鏡像效果）
  scale(-1, 1);
  // 因為座標中心已經移動到了 (width/2, height/2)，所以在此直接畫在 (0, 0) 的位置即可
  image(capture, 0, 0, imgWidth, imgHeight);
  
  // 將 pg 圖層顯示在視訊畫面的上方
  if (pg) {
    image(pg, 0, 0, imgWidth, imgHeight);
  }
  
  pop();
}

// (額外優化) 當使用者縮放瀏覽器視窗時，畫布也能自動跟著改變大小並維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
