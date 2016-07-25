import Util from '../modules/util.js';

const glMatrix = require('gl-matrix');

export default function() {
  class Transformer {
    constructor() {
      const center = 250;
      const radius = 200;
      const border_width = 20;
      const kappa = 0.5522848;

      this.$svg_bg = $('#svg-background');
      this.$svg_mask_path = $('#svg-mask-path');
      this.$svg_wrap = $('#svg-wrap');
      this.time = 0;
      this.current_num = 0;
      this.position = [
        [
          center, center - radius * 0.8,

          center + radius * 0.8 * kappa, center - radius * 0.8,
          center + radius * 0.8, center - radius * 0.8 * kappa,
          center + radius * 0.8, center,

          center + radius * 0.8, center + radius * 0.8 * kappa,
          center + radius * 0.8 * kappa, center + radius * 0.8,
          center, center + radius * 0.8,

          center - radius * 0.8 * kappa, center + radius * 0.8,
          center - radius * 0.8, center + radius * 0.8 * kappa,
          center - radius * 0.8, center,

          center - radius * 0.8, center - radius * 0.8 * kappa,
          center - radius * 0.8 * kappa, center - radius * 0.8,
          center, center - radius * 0.8,
        ],
        [
          center + radius * Math.cos(Util.getRadian(-90)), center + radius * Math.sin(Util.getRadian(-90)) + 40,

          center + radius * Math.cos(Util.getRadian(-90)), center + radius * Math.sin(Util.getRadian(-90)) + 40,
          center + radius * Math.cos(Util.getRadian(30)), center + radius * Math.sin(Util.getRadian(30)) + 40,
          center + radius * Math.cos(Util.getRadian(30)), center + radius * Math.sin(Util.getRadian(30)) + 40,

          center + radius * Math.cos(Util.getRadian(30)), center + radius * Math.sin(Util.getRadian(30)) + 40,
          (center * 2 + radius * Math.cos(Util.getRadian(30)) + radius * Math.cos(Util.getRadian(150))) / 2 + 40,
          (center * 2 + radius * Math.sin(Util.getRadian(30)) + radius * Math.sin(Util.getRadian(150))) / 2 + 40,
          (center * 2 + radius * Math.cos(Util.getRadian(30)) + radius * Math.cos(Util.getRadian(150))) / 2 + 40,
          (center * 2 + radius * Math.sin(Util.getRadian(30)) + radius * Math.sin(Util.getRadian(150))) / 2 + 40,

          (center * 2 + radius * Math.cos(Util.getRadian(30)) + radius * Math.cos(Util.getRadian(150))) / 2 + 40,
          (center * 2 + radius * Math.sin(Util.getRadian(30)) + radius * Math.sin(Util.getRadian(150))) / 2 + 40,
          center + radius * Math.cos(Util.getRadian(150)), center + radius * Math.sin(Util.getRadian(150)) + 40,
          center + radius * Math.cos(Util.getRadian(150)), center + radius * Math.sin(Util.getRadian(150)) + 40,

          center + radius * Math.cos(Util.getRadian(150)), center + radius * Math.sin(Util.getRadian(150)) + 40,
          center + radius * Math.cos(Util.getRadian(-90)), center + radius * Math.sin(Util.getRadian(-90)) + 40,
          center + radius * Math.cos(Util.getRadian(-90)), center + radius * Math.sin(Util.getRadian(-90)) + 40,
        ],
        [
          center + radius * Math.cos(Util.getRadian(-135)), center + radius * Math.sin(Util.getRadian(-135)),

          center + radius * Math.cos(Util.getRadian(-135)), center + radius * Math.sin(Util.getRadian(-135)),
          center + radius * Math.cos(Util.getRadian(-45)), center + radius * Math.sin(Util.getRadian(-45)),
          center + radius * Math.cos(Util.getRadian(-45)), center + radius * Math.sin(Util.getRadian(-45)),

          center + radius * Math.cos(Util.getRadian(-45)), center + radius * Math.sin(Util.getRadian(-45)),
          center + radius * Math.cos(Util.getRadian(45)), center + radius * Math.sin(Util.getRadian(45)),
          center + radius * Math.cos(Util.getRadian(45)), center + radius * Math.sin(Util.getRadian(45)),

          center + radius * Math.cos(Util.getRadian(45)), center + radius * Math.sin(Util.getRadian(45)),
          center + radius * Math.cos(Util.getRadian(135)), center + radius * Math.sin(Util.getRadian(135)),
          center + radius * Math.cos(Util.getRadian(135)), center + radius * Math.sin(Util.getRadian(135)),

          center + radius * Math.cos(Util.getRadian(135)), center + radius * Math.sin(Util.getRadian(135)),
          center + radius * Math.cos(Util.getRadian(-135)), center + radius * Math.sin(Util.getRadian(-135)),
          center + radius * Math.cos(Util.getRadian(-135)), center + radius * Math.sin(Util.getRadian(-135)),
        ]
      ];
      this.velocity = this.position[this.current_num].concat();
      this.acceleration = [
        0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0,
      ];
      this.anchor = this.position[this.current_num].concat();
    }
    render() {
      for (var i = 0; i < this.acceleration.length; i += 2) {
        const acceleration = [
          this.acceleration[i + 0],
          this.acceleration[i + 1]
        ];
        const v = 0.2;
        const drag = [
          acceleration[0] * -1,
          acceleration[1] * -1
        ];
        glMatrix.vec2.normalize(drag, drag);
        glMatrix.vec2.scale(drag, drag, glMatrix.vec2.length(acceleration) * v);
        const k = 0.1;
        const hook = [
          this.velocity[i + 0] - this.anchor[i + 0],
          this.velocity[i + 1] - this.anchor[i + 1]
        ];
        const distance = glMatrix.vec2.length(hook);
        glMatrix.vec2.normalize(hook, hook);
        glMatrix.vec2.scale(hook, hook, -1 * k * distance);

        this.acceleration[i + 0] += drag[0] + hook[0];
        this.acceleration[i + 1] += drag[1] + hook[1];
        this.velocity[i + 0] += this.acceleration[i + 0];
        this.velocity[i + 1] += this.acceleration[i + 1];
      }
      const current_position = this.velocity;
      let path_str = `
          M
          ${current_position[0]},
          ${current_position[1]}
        `;
      for (let i = 2; i < current_position.length; i += 6) {
        path_str += `
          C
          ${current_position[i]},
          ${current_position[i + 1]}
          ${current_position[i + 2]},
          ${current_position[i + 3]}
          ${current_position[i + 4]},
          ${current_position[i + 5]}
        `;
      }
      this.$svg_mask_path.attr('d', path_str);
    }
    changePath() {
      this.current_num++;
      if (this.current_num > this.position.length - 1) {
        this.current_num = 0;
      }
      this.anchor = this.position[this.current_num].concat();
      switch (this.current_num) {
        case 0:
          this.$svg_bg.css('fill', '#cc6666');
          this.$svg_wrap.css('backgroundImage', 'url("https://c2.staticflickr.com/8/7145/13663742003_2096962b3a_c.jpg")');
          break;
        case 1:
          this.$svg_bg.css('fill', '#99cc66');
          this.$svg_wrap.css('backgroundImage', 'url("https://c2.staticflickr.com/8/7039/14096679536_72644c7ea0_c.jpg")');
          break;
        case 2:
          this.$svg_bg.css('fill', '#6699cc');
          this.$svg_wrap.css('backgroundImage', 'url("https://c2.staticflickr.com/6/5527/14370696871_c3a5c186ea_c.jpg")');
          break;
        default:
          break;
      }
    }
  }

  const transformer = new Transformer();
  let time_past = Date.now();
  let timer = null;

  const render = () => {
    const time = Date.now();
    transformer.time += time - time_past;
    time_past = time;
    transformer.render();
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const setTimerForChangePath = () => {
    timer = setTimeout(() => {
      transformer.changePath();
      setTimerForChangePath();
    }, 2000);
  }

  renderLoop();
  setTimerForChangePath();
};
