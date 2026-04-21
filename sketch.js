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
  
  // 在視訊圖片外面（左上角）產生一個按鈕
  let saveBtn = createButton('儲存圖片');
  saveBtn.position(20, 20); // 固定在畫面左上角
  saveBtn.style('font-size', '16px');
  saveBtn.style('padding', '10px');
  saveBtn.mousePressed(takeSnapshot); // 當按下按鈕時，執行 takeSnapshot 函式
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
  
  // 因為座標中心已經移動到了 (width/2, height/2)，原點 (0,0) 即為畫布中心
  // 將原本的影像繪製改成 20x20 黑白馬賽克效果
  if (capture.width > 0) {
    capture.loadPixels(); // 載入影像像素資料至 capture.pixels 陣列中
    if (capture.pixels.length > 0) {
      let step = 20; // 設定每個單位寬高為 20x20
      
      // 計算每個馬賽克單位在畫面縮放 60% 後，實際應該顯示的寬高
      let unitW = imgWidth / (capture.width / step);
      let unitH = imgHeight / (capture.height / step);
      
      // 計算左上角起始點 (因為目前原點已平移到中心，所以退回一半的寬高)
      let startX = -imgWidth / 2;
      let startY = -imgHeight / 2;
      
      noStroke(); // 馬賽克方塊不需要邊框
      for (let y = 0; y < capture.height; y += step) {
        for (let x = 0; x < capture.width; x += step) {
          // 計算當前 x,y 在一維陣列(pixels)中的索引位置
          let index = (y * capture.width + x) * 4;
          let r = capture.pixels[index];
          let g = capture.pixels[index + 1];
          let b = capture.pixels[index + 2];
          
          // 利用 (R+G+B)/3 取得灰階數值，變成黑白顏色
          let gray = (r + g + b) / 3;
          fill(gray);
          
          // 依照單位比例計算，並畫出該位置的正方形
          let drawX = startX + (x / step) * unitW;
          let drawY = startY + (y / step) * unitH;
          rect(drawX, drawY, unitW, unitH);
        }
      }
    }
  }
  
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

// 負責擷取指定範圍並儲存圖片的函式
function takeSnapshot() {
  // 計算與 draw() 相同的視訊畫面寬高及起始點座標
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  let startX = (width - imgWidth) / 2;
  let startY = (height - imgHeight) / 2;
  
  // 使用 get(x, y, w, h) 只擷取視訊畫面範圍的像素
  let snapshot = get(startX, startY, imgWidth, imgHeight);
  // 儲存為 jpg 圖檔
  snapshot.save('my_snapshot', 'jpg');
}
