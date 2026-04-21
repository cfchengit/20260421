let capture;

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
  pop();
}

// (額外優化) 當使用者縮放瀏覽器視窗時，畫布也能自動跟著改變大小並維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
