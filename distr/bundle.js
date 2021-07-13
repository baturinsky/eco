{
  let icons = "\u{1F33F},\u{1F344},\u{1F41E},\u{1F40D},\u{1F9A1},\u{1F43B}".split(",");
  const r = (n = 1) => Math.random() * n;
  let animals = [];
  const breed = (a, R) => {
    let b = {type: a.type, x: a.x + r(2 * R) - R, y: a.y + r(2 * R) - R, hp: 30};
    if (l(b) > 500)
      return;
    a.hp -= 40;
    animals.push(b);
  };
  const l = (v) => (v.x ** 2 + v.y ** 2) ** 0.5;
  const to = (a, b) => ({x: b.x - a.x, y: b.y - a.y});
  document.write(`<canvas id="C"/></canvas>`);
  C.width = 1e3;
  C.height = 1e3;
  const d = C.getContext("2d");
  let m;
  C.onmousemove = (e) => m = e;
  window.onkeydown = (e) => breed({type: e.key - 1, x: m.offsetX - 505, y: m.offsetY - 500}, 0);
  let loop = () => {
    if (r(5) < 1)
      breed({type: ~~(r() ** 3 * 6), x: 0, y: 0}, 100);
    d.clearRect(0, 0, 1e3, 1e3);
    for (let z in icons)
      for (let a of animals) {
        if (a.type == z) {
          d.fillStyle = `rgba(0,0,0,${a.hp / 100 + 0.3})`;
          d.font = `${a.type < 2 ? 20 : 8 + 6 * a.type}px Arial`;
          d.fillText(icons[a.type], a.x + 500, a.y + 500);
        }
      }
    for (let a of animals) {
      if (a.hp > 70 && (animals.length < 1e3 || a.type > 1))
        breed(a, a.type > 2 ? 0 : 100);
      if (a.type > 1 || r(10) < 1)
        for (let b of animals) {
          let L = l(to(a, b));
          if (a != b && L < r(100)) {
            let delta = a.type - b.type;
            if (delta == 0 && L < 10 && a.type < 2)
              a.hp -= 10;
            if (a.prey) {
              if (a.prey.hp <= 0)
                delete a.prey;
            } else if (delta == 2 || (delta == 1 || delta == 3) && a.type > 1 && r() < 0.1) {
              a.prey = b;
            }
          }
        }
      if (a.prey) {
        let b = a.prey;
        if (b.hp <= 0) {
          a.prey = null;
        } else {
          let t = to(a, b);
          let L = l(t);
          if (L < 5) {
            a.hp += 50;
            b.hp = -100;
          } else {
            let m2 = (a.type + 1) / L;
            a.x += t.x * m2;
            a.y += t.y * m2;
          }
        }
      }
      a.hp += a.type < 2 ? 1 : -1;
      if (a.hp > 150)
        a.hp = 150;
      if (r(1e6) / animals.length < 1)
        a.hp = -100;
    }
    animals = animals.filter((a) => a.hp > 0);
    setTimeout(loop, 50);
  };
  loop();
}
