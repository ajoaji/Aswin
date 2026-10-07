// ---- edit this! put their name in here and it shows up on the first page ----
var friendName = "";
// ------------------------------------------------------------------------------

var screens = document.querySelectorAll(".screen");
var dotsBox = document.getElementById("dots");
var current = 0;

if (friendName) {
  document.querySelector(".fname").textContent = friendName + ".";
  document.title = "For " + friendName + " ❤️";
}

// make the little progress dots
screens.forEach(function (s, i) {
  var d = document.createElement("i");
  if (i == 0) d.className = "on";
  dotsBox.appendChild(d);
});

function showPage(n) {
  if (n < 0 || n >= screens.length) return;
  current = n;

  screens.forEach(function (s, i) {
    s.classList.toggle("active", i === n);
  });
  dotsBox.querySelectorAll("i").forEach(function (d, i) {
    d.className = (i === n) ? "on" : "";
  });

  // last page = party
  if (n === screens.length - 1) {
    for (var i = 0; i < 40; i++) setTimeout(spawnHeart, i * 90);
  }
}

// every button with class "next" just goes forward
document.querySelectorAll(".next").forEach(function (b) {
  b.addEventListener("click", function () { showPage(current + 1); });
});


// ---------- floating hearts ----------
var heartChars = ["♥", "♡", "❤"];

function spawnHeart() {
  var h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + "%";
  h.style.fontSize = (12 + Math.random() * 22) + "px";
  h.style.animationDuration = (6 + Math.random() * 6) + "s";
  document.getElementById("hearts").appendChild(h);
  setTimeout(function () { h.remove(); }, 12500);
}
setInterval(spawnHeart, 1100);


// ---------- the "No" button runs away ----------
function noRunsAway(btnId, hintId) {
  var btn = document.getElementById(btnId);
  var hint = document.getElementById(hintId);
  var card = btn.closest(".card");
  var screen = btn.closest(".screen");

  var gap = 18;      // keep this far from the card edge
  var scared = 95;   // how close the mouse can get
  var jump = 170;
  var x = 0, y = 0;  // how far we've moved from the normal spot

  btn.style.transition = "transform .28s cubic-bezier(.2,1.4,.4,1)";

  // where the button lives when it hasn't moved
  function home() {
    var p = btn.offsetParent.getBoundingClientRect();
    return { l: p.left + btn.offsetLeft, t: p.top + btn.offsetTop, w: btn.offsetWidth, h: btn.offsetHeight };
  }

  function run(mx, my) {
    var c = card.getBoundingClientRect();
    var b = home();

    // limits so it stays inside the card
    var minX = c.left + gap - b.l, maxX = c.right - gap - b.w - b.l;
    var minY = c.top + gap - b.t,  maxY = c.bottom - gap - b.h - b.t;

    var cx = b.l + x + b.w / 2;
    var cy = b.t + y + b.h / 2;
    var dx = cx - mx, dy = cy - my;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;

    var nx = Math.min(maxX, Math.max(minX, x + dx / len * jump));
    var ny = Math.min(maxY, Math.max(minY, y + dy / len * jump));

    function away(px, py) {
      return Math.hypot(b.l + px + b.w / 2 - mx, b.t + py + b.h / 2 - my);
    }

    // stuck in a corner -> pick the best random spot
    if (away(nx, ny) < scared + 40) {
      var bx = nx, by = ny;
      for (var i = 0; i < 40; i++) {
        var rx = minX + Math.random() * (maxX - minX);
        var ry = minY + Math.random() * (maxY - minY);
        if (away(rx, ry) > away(bx, by)) { bx = rx; by = ry; }
      }
      nx = bx; ny = by;
    }

    x = nx; y = ny;
    btn.style.transform = "translate(" + x + "px," + y + "px)";
   // hint.textContent = "Nice try 😄";
  }

  document.addEventListener("mousemove", function (e) {
    if (!screen.classList.contains("active")) return;   // not on this page

    var b = home();
    var l = b.l + x, t = b.t + y;
    var gx = Math.max(l - e.clientX, 0, e.clientX - (l + b.w));
    var gy = Math.max(t - e.clientY, 0, e.clientY - (t + b.h));

    if (Math.hypot(gx, gy) < scared) run(e.clientX, e.clientY);
  });

  // phones
  btn.addEventListener("touchstart", function (e) {
    e.preventDefault();
    run(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    hint.textContent = "That button is feeling shy 😉";
  });

  window.addEventListener("resize", function () {
    x = 0; y = 0;
    btn.style.transform = "";
  });
}

noRunsAway("no1", "hint1");
noRunsAway("no2", "hint2");

// TODO maybe add music?
// showPage(4);  // <- uncomment to jump straight to the question when testing
