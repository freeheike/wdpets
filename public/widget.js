/**
 * WebPet 网页宠物嵌入插件
 * 用法: <script src="https://your-domain.com/widget.js" data-pet-name="小团子" data-skin="default"></script>
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var petName = (script && script.getAttribute('data-pet-name')) || '小团子';
  var skin = (script && script.getAttribute('data-skin')) || 'default';
  var level = (script && script.getAttribute('data-level')) || '1';

  var SKINS = {
    default: { body: '#FFB347', belly: '#FFE4B5', ear: '#FF8C42', cheek: '#FF9999', accent: '#FF6B35' },
    golden: { body: '#FFD700', belly: '#FFF8DC', ear: '#DAA520', cheek: '#FFE066', accent: '#B8860B' },
    strawberry: { body: '#FF6B9D', belly: '#FFE0EC', ear: '#E84393', cheek: '#FF85A2', accent: '#C44569' },
    cyber: { body: '#6C5CE7', belly: '#A29BFE', ear: '#4834D4', cheek: '#74B9FF', accent: '#00CEC9' },
    night: { body: '#2D3436', belly: '#636E72', ear: '#1E272E', cheek: '#6C5CE7', accent: '#A29BFE' },
  };

  var colors = SKINS[skin] || SKINS.default;
  var phrases = ['主人加油～', '摸摸头！', '好困...', '今天也要开心！', '陪你一起努力！'];

  var container = document.createElement('div');
  container.id = 'webpet-widget';
  container.style.cssText = 'position:fixed;bottom:20px;right:20px;width:100px;height:100px;z-index:99999;cursor:grab;user-select:none;touch-action:none;';

  var speech = document.createElement('div');
  speech.style.cssText = 'position:absolute;top:-40px;left:50%;transform:translateX(-50%);background:#fff;border:2px solid #ffd6e8;border-radius:12px;padding:4px 10px;font-size:11px;color:#555;white-space:nowrap;display:none;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);';
  container.appendChild(speech);

  var pet = document.createElement('div');
  pet.style.cssText = 'width:100%;height:100%;position:relative;animation:webpet-bob 3s ease-in-out infinite;';
  pet.innerHTML =
    '<div style="position:absolute;width:22%;height:22%;background:' + colors.ear + ';border-radius:50% 50% 0 0;top:2%;left:12%;transform:rotate(-15deg)"></div>' +
    '<div style="position:absolute;width:22%;height:22%;background:' + colors.ear + ';border-radius:50% 50% 0 0;top:2%;right:12%;transform:rotate(15deg)"></div>' +
    '<div style="position:absolute;width:78%;height:70%;background:' + colors.body + ';border-radius:50%;top:14%;left:11%">' +
      '<div style="position:absolute;width:16%;height:18%;background:#2d3436;border-radius:50%;top:32%;left:22%"></div>' +
      '<div style="position:absolute;width:16%;height:18%;background:#2d3436;border-radius:50%;top:32%;right:22%"></div>' +
      '<div style="position:absolute;width:14%;height:8%;background:' + colors.accent + ';border-radius:50%;top:50%;left:43%"></div>' +
      '<div style="position:absolute;width:14%;height:6%;border:2px solid ' + colors.accent + ';border-top:none;border-radius:0 0 50% 50%;top:58%;left:43%"></div>' +
    '</div>' +
    '<div style="position:absolute;width:50%;height:35%;background:' + colors.belly + ';border-radius:50%;bottom:10%;left:25%"></div>';
  container.appendChild(pet);

  var label = document.createElement('div');
  label.textContent = petName + ' Lv.' + level;
  label.style.cssText = 'position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:10px;color:#999;white-space:nowrap;font-family:sans-serif;';
  container.appendChild(label);

  var style = document.createElement('style');
  style.textContent = '@keyframes webpet-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes webpet-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}';
  document.head.appendChild(style);

  var dragging = false;
  var offsetX = 0, offsetY = 0;

  container.addEventListener('pointerdown', function (e) {
    dragging = true;
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
    container.style.cursor = 'grabbing';
    container.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    container.style.left = (e.clientX - offsetX) + 'px';
    container.style.top = (e.clientY - offsetY) + 'px';
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  });

  container.addEventListener('pointerup', function () {
    dragging = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('click', function () {
    if (dragging) return;
    pet.style.animation = 'webpet-bounce 0.5s ease';
    var phrase = phrases[Math.floor(Math.random() * phrases.length)];
    speech.textContent = phrase;
    speech.style.display = 'block';
    setTimeout(function () {
      pet.style.animation = 'webpet-bob 3s ease-in-out infinite';
      speech.style.display = 'none';
    }, 2000);
  });

  document.body.appendChild(container);
})();
