export default function() {
  class Transformer {
    constructor() {
      const center = 250;
      const radius = 150;
      const border_width = 20;
      const kappa = 0.5522848;

      this.time = 0;
      this.path = document.getElementById('transformer-path');
      this.position = [
        [
          center, center - radius,

          center + radius * kappa, center - radius,
          center + radius, center - radius * kappa,
          center + radius, center,

          center + radius, center + radius * kappa,
          center + radius * kappa, center + radius,
          center, center + radius,

          center - radius * kappa, center + radius,
          center - radius, center + radius * kappa,
          center - radius, center,

          center - radius, center - radius * kappa,
          center - radius * kappa, center - radius,
          center, center - radius,
        ]
      ];
    }
    render() {
      const radian = this.time * Math.PI / 180 / 4;
      const current_position = this.position[0];
      let path_str = `
          M
          ${current_position[0] + Math.cos(radian) * 30},
          ${current_position[1] + Math.sin(radian) * 30}
        `;
      for (let i = 2; i < current_position.length; i += 6) {
        path_str += `
          C
          ${current_position[i] + Math.cos(radian) * 30},
          ${current_position[i + 1] + Math.sin(radian) * 30}
          ${current_position[i + 2] + Math.cos(radian) * 30},
          ${current_position[i + 3] + Math.sin(radian) * 30}
          ${current_position[i + 4] + Math.cos(radian) * 30},
          ${current_position[i + 5] + Math.sin(radian) * 30}
        `;
      }
      this.path.setAttribute('d', path_str);
    }
  }

  const transformer = new Transformer();
  let time_past = Date.now();
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
  renderLoop();
};
