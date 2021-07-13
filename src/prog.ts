{
  let icons = "🌿,🍄,🐞,🐍,🦡,🐻".split(",")
  const rng = (n = 1) => Math.random() * n;

  type Animal = {type:number, x:number, y:number, hp?: number, prey?: Animal}

  let animals:Animal[] = [];

  const breed = (a:Animal, radius) => {
    let b = { type: a.type, x: a.x + rng(2 * radius) - radius, y: a.y + rng(2 * radius) - radius, hp: 30 };
    if (l(b) > 500)
      return;
    a.hp -= 40;
    animals.push(b);
  }

  const l = v => (v.x ** 2 + v.y ** 2) ** 0.5;
  const to = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })
  document.write(`<canvas id="C"/></canvas>`)
  C.width = 1e3;
  C.height = 1e3;
  const d = C.getContext("2d");
  let m;

  C.onmousemove = e => m = e;
  window.onkeydown = (e) => breed({ type: e.key - 1, x: m.offsetX - 505, y: m.offsetY - 500 }, 0);

  let loop = () => {
    if (rng(5) < 1)
      breed({ type: ~~(rng() ** 3 * 6), x: 0, y: 0 }, 100);
    d.clearRect(0, 0, 1e3, 1e3);
    for (let z in icons)
      for (let a of animals) {
        if ((a.type == z)) {
          d.fillStyle = `rgba(0,0,0,${a.hp / 100 + 0.3})`
          d.font = `${a.type < 2 ? 20 : (8 + 6 * a.type)}px Arial`;
          d.fillText(icons[a.type], a.x + 500, a.y + 500);
        }
      }

    for (let a of animals) {
      if (a.hp > 70 && (animals.length < 1000 || a.type > 1))
        breed(a, a.type > 2 ? 0 : 100);
      if (a.type > 1 || rng(10) < 1)
        for (let b of animals) {
          let L = l(to(a, b));
          if (a != b && L < rng(100)) {
            let delta = a.type - b.type;
            if (delta == 0 && L < 10 && a.type < 2)
              a.hp -= 10;
            if (a.prey) {
              if (a.prey.hp <= 0)
                delete a.prey;
            } else if ((delta == 2 || (delta == 1 || delta == 3) && a.type > 1 && rng() < 0.1)) {
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
            let m = (a.type + 1) / L;
            a.x += t.x * m;
            a.y += t.y * m;
          }
        }
      }
      a.hp += a.type < 2 ? 1 : -1;
      if (a.hp > 150)
        a.hp = 150;
      if (rng(1e6) / animals.length < 1)
        a.hp = -100;
    }
    animals = animals.filter(a => a.hp > 0)
    setTimeout(loop, 50);
  }
  loop();
}