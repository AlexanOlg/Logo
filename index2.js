class Slider {

  constructor(options) {
    this.options = options
    this.slider = this.createSlider(options);
    this.createElements(options)
    this.createSettingsEl()

    this.pxStep = this.getPxStep(options)
    this.pxMax = this.getSliderSize(options.orientation)
    this.active = true;
    this.sliderPosition = this.getSliderPosition()



    this.startPosition(options)
    this.updateBar()

    this.addEventListeners()
    this.updateScale(options)

    this.changeOptions(options)

  }

  createSlider(options) {
    let slider = document.createElement('div')
    slider.className = 'slider'
    document.querySelector(`.${options.className}`).append(slider)
    return slider
  }
  createElements(options) {
    const { orientation } = options

    this.track = document.createElement('div')
    this.bar = document.createElement('div')
    this.scale = document.createElement('div')

    if (options.type !== "single") {
      let thumbFirst = document.createElement('div');
      thumbFirst.classList.add(
        'slider__thumb',
        'js-slider__thumb',
        `slider__thumb_${orientation}`,
        'slider__thumb_first',
      );

      this.thumbFirst = thumbFirst
      this.slider.append(thumbFirst);
    }
    let thumbSecond = document.createElement('div');

    thumbSecond.classList.add(
      'slider__thumb', 'js-slider__thumb', `slider__thumb_${orientation}`, 'slider__thumb_second',
    );
    this.slider.append(thumbSecond);
    this.thumbSecond = thumbSecond
    this.track.className = `slider__track slider__track_${orientation}`;
    this.bar.className = `slider__bar slider__bar_${orientation}`;
    this.scale.className = `slider__scale slider__scale_${orientation}`;

    this.slider.append(this.scale);
    this.slider.append(this.track)
    this.track.append(this.bar)
  }

  createSettingsEl() {
    let labelFrom = document.createElement("label")
    let labelTo = document.createElement("label")
    let inputFrom = document.createElement("input")
    let inputTo = document.createElement("input")
    let labelRange = document.createElement("label")
    let labelOrient = document.createElement("label")
    let inputRangeType = document.createElement('input')
    let inputOrientation = document.createElement('input')
    let minus = document.createElement('span')
    let outFrom = document.createElement('input')
    let outTo = document.createElement('input')
    let wrap = document.querySelector('.wrap')
    inputOrientation.className = "inputs"
    inputTo.type = "number"
    inputTo.className = "change"
    inputFrom.className = "change"
    inputFrom.type = "number"
    labelTo.innerHTML = "to"
    labelFrom.innerHTML = "from"
    inputOrientation.type = "checkbox"
    labelOrient.innerHTML = "Orientation"
    labelRange.innerHTML = "range"
    inputRangeType.className = "inputs"
    inputRangeType.type = "checkbox"
    minus.className = "minus"
    outFrom.className = 'out out_from'
    outTo.className = 'out out_to'
    minus.innerHTML = '-'
    outFrom.type = 'text'
    outTo.type = 'text'
    labelFrom.append(inputFrom)
    labelTo.append(inputTo)
    labelOrient.append(inputOrientation)
    labelRange.append(inputRangeType)
    wrap.before(labelTo)
    wrap.before(labelFrom)
    wrap.before(labelOrient)
    wrap.before(labelRange)
    wrap.before(outFrom)
    wrap.before(minus)
    wrap.before(outTo)
    this.outFrom = outFrom
    this.outTo = outTo
    this.inputRangeType = inputRangeType
    this.inputOrientation = inputOrientation
    this.inputTo = inputTo
    this.inputFrom = inputFrom

  }
  changeOptions(options) {
    this.inputRangeType.onchange = () => {
      if (options.type === "double") {
        options.type = "single"
        options.to = options.max
        this.removeSlider(options)
      } else {
        options.type = "double"
        this.removeSlider(options)
      }
    }

    this.inputOrientation.onchange = () => {
      if (options.orientation === "horizontal") {
        options.orientation = "vertical"
        this.removeSlider(options)
      } else {
        options.orientation = "horizontal"
        this.removeSlider(options)
      }
    }

    this.outTo.onchange = () => {
      let value = parseInt(this.outTo.value)
      options.to = value
      this.startPosition(options)
    }
    this.outFrom.onchange = () => {
      let value = parseInt(this.outFrom.value)
      options.from = value
      this.startPosition(options)
    }

    this.inputFrom.onchange = () => {
      let value = parseInt(this.inputFrom.value)
      if (value === "undefined" || value < 0) {
        options.from = options.min
      }
      options.from = Math.abs(value)
      this.startPosition(options)
    }
    this.inputTo.onchange = () => {
      let value = parseInt(this.inputTo.value)
      if (value === "undefined" || value > options.max) {
        options.to = options.max
      }
      options.to = Math.abs(value)
      this.startPosition(options)
    }
  }
  removeSlider(options) {
    this.slider.remove();
    this.slider = this.createSlider(options);
    this.createElements(options);

    this.updateScale()
    this.startPosition(options)

    this.addEventListeners()
    this.updateBar()
  }
  startPosition(options) {

    let from = `${options.from.toLocaleString()}₽`
    let to = `${options.to.toLocaleString()}₽`

    if (options.type === "double") {
      this.moveThumbAtValue(options.to, this.thumbFirst)

      this.thumbFirst.setAttribute('data-text', from);

    }


    this.moveThumbAtValue(options.from, this.thumbSecond)

    this.thumbSecond.setAttribute('data-text', from);
    this.outTo.value = to

    this.outFrom.value = from
    this.updateBar()

  }

  moveThumbAtValue(value, element) {

    const {
      orientation
    } = this.options;
    const coordinate = this.convertValueToPx(value);
    const side = this.getSide(orientation);
    const position = this.convertPxToPercent(coordinate);

    element.style[side] = `${position}%`;

  }
  convertPxToPercent(value) {
    return (value * 100) / this.getSliderSize(this.options.orientation)
  }
  convertValueToPx(value) {

    const { min, max, step, } = this.options;
    if (value === max) return this.pxMax;

    const pxValue = Math.round((value - min) / step) * this.pxStep;
    return pxValue;
  }
  addEventListeners() {

    const bindMouseDown = this.dragStart.bind(this);
    this.slider.addEventListener("touchstart", bindMouseDown);
    this.slider.addEventListener("mousedown", bindMouseDown);
    this.onTrackClick = this.onTrackClick.bind(this)
    this.onScaleClick = this.onScaleClick.bind(this)

    this.slider.addEventListener('click', this.onTrackClick);
    this.scale.addEventListener('click', this.onScaleClick);
  }
  getTargetType(target) {
    if (this.thumbFirst) {
      if (this.thumbFirst.contains(target)) return "from";
    }
    if (this.thumbSecond.contains(target)) return "to";
  }
  dragStart(event) {
    const target = event.target;

    if (this.getTargetType(target)) {

      const drag = this.drag.bind(this, target);

      const handleMouseUp = () => {

        this.slider.removeEventListener("mousemove", drag);
        this.slider.removeEventListener("touchmove", drag);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleMouseUp);
      };

      this.slider.addEventListener("mousemove", drag);
      this.slider.addEventListener("touchmove", drag);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
    }
  }
  drag(target, event) {
    // залипание у левого края
    if (this.options.to === this.options.min) {
      this.active = false;
    }
    if (this.active) {
      this.thumbSecond.style.zIndex = "3";
      this.active = !this.active;
    } else if (this.options.from === this.options.min) {
      this.thumbSecond.style.zIndex = "0";
      this.active = !this.active;
    }

    const { orientation } = this.options
    let mouseValue = 0
    if (orientation === "horizontal") {
      if (event.type === "touchmove") {

        mouseValue = this.convertPxToValue(event.touches[0].clientX);

      } else {
        mouseValue = this.convertPxToValue(event.clientX);
      }
    } else {
      if (event.type === "touchmove") {

        mouseValue = this.convertPxToValue(event.touches[0].clientY);

      } else {
        mouseValue = this.convertPxToValue(event.clientY);
      }
    }

    this.updatePosition(mouseValue, target);

  }
  updatePosition(value, target) {
    this.valueOut = `${value.toLocaleString()}₽`
    const { from, to } = this.options;
    const type = this.getTargetType(target);

    const fromDistance = Math.abs(options.from - value);
    const toDistance = Math.abs(options.to - value);
    console.log(toDistance);
    const isSingle = options.type === "single";
    if (fromDistance * toDistance === 0) return;

    if (!target) {
      target = (fromDistance < toDistance) ? 'from' : 'to';

      if (isSingle && fromDistance) {
        this.options.to = value
        this.moveThumbAtValue(value, this.thumbSecond)
        this.updateBar()
        this.outFrom.value = this.valueOut
        this.thumbSecond.setAttribute('data-text', this.valueOut);

        return;
      }

      if (target === 'from') {
        if (to > value) {
          this.options.from = value
          this.outFrom.value = this.valueOut
          this.thumbSecond.setAttribute('data-text', this.valueOut);
          this.moveThumbAtValue(options.from, this.thumbSecond)
          this.updateBar()
        }
      } else if (from < value) {
        this.options.to = value
        this.outTo.value = this.valueOut
        console.log(this.valueOut);
        this.thumbFirst.setAttribute('data-text', this.valueOut);
        this.moveThumbAtValue(options.to, this.thumbFirst)
        this.updateBar()
      }
    } else {

      if (type === "from") {
        if (value < options.from) {
          value = options.to
        }
        options.to = value
        this.moveThumbAtValue(options.to, target)
        this.updateBar()
        if (value !== to) {
          this.outTo.value = this.valueOut
          this.thumbFirst.setAttribute('data-text', this.valueOut);
        }
      } else {
        if (value > options.to) {
          value = options.from
        }
        options.from = value
        this.moveThumbAtValue(options.from, target)
        this.updateBar()
        if (value !== from) {
          this.thumbSecond.setAttribute('data-text', this.valueOut);
          this.outFrom.value = this.valueOut
        }
      }
    }
  }
  onScaleClick(event) {
    event.preventDefault()
    const { target } = event;

    if (!(target instanceof HTMLElement)) return;

    if (!target.classList.contains('slider__scale-value')) return;

    const value = Number(target.innerHTML);

    this.updatePosition(value);
  }
  onTrackClick(event) {

    const target = event.target;

    if (!/track|bar/.test(target.className)) return;

    const coordinate = this.options.orientation === 'horizontal'
      ? event.clientX : event.clientY;

    this.updatePosition(this.convertPxToValue(coordinate));
  }
  getThumbsPositions() {
    if (options.type === "single") {

      const side = this.options.orientation === 'horizontal' ? 'left' : 'top';
      const width = Number.parseInt(getComputedStyle(this.thumbSecond).width, 10);
      return this.thumbSecond.getBoundingClientRect()[side] + width / 2;
    }

    const thumbs = this.slider.querySelectorAll('.js-slider__thumb');

    const calculatePosition = (element) => {
      const side = this.options.orientation === 'horizontal' ? 'left' : 'top';

      const width = Number.parseInt(getComputedStyle(element).width, 10);

      return element.getBoundingClientRect()[side] + width / 2;
    };

    const thumbsPositions = [calculatePosition(thumbs[0]),
    calculatePosition(thumbs[1])];

    return thumbsPositions.sort((a, b) => a - b);
  }
  getSliderPosition() {
    const side = this.options.orientation === 'horizontal' ? 'left' : 'top';
    return this.slider.getBoundingClientRect()[side];
  }
  getSliderSize(orientation) {
    let sliderPosition = this.slider.getBoundingClientRect();
    return orientation === "horizontal"
      ? sliderPosition.width : sliderPosition.height;
  }
  getPxStep(options) {
    const { min, max, step, orientation } = options;

    const quantity = Math.ceil((max - min) / step);

    return this.getSliderSize(orientation) / quantity;
  }
  updateScale(options) {

    if (this.options.hideScale) {
      this.scale.style.display = 'none';
      return;
    }

    this.scale.style.display = '';
    this.scale.innerHTML = '';
    this.scale.className = `slider__scale slider__scale_${this.options.orientation}`;

    this.insertScaleValues();
  }
  insertScaleValues() {
    const { min, max, step, } = this.options;
    const inc = this.calculateIncrement(step);
    const pxInc = (inc / step) * this.pxStep;
    const fragment = document.createDocumentFragment();

    let pxCurrent = 0;

    for (let current = min; current < max; current += inc) {
      if (pxCurrent > this.pxMax - 50) break;
      this.createScaleValue(fragment, current, pxCurrent);

      pxCurrent += pxInc;

    }

    this.createScaleValue(fragment, max, this.pxMax);
    this.scale.append(fragment);
  }
  calculateIncrement(step) {
    const value = Math.ceil(this.pxMax / this.pxStep);
    const inc = Math.ceil(value / 5) * step;
    return inc;
  }
  createScaleValue(fragment, value, position) {

    const { orientation } = this.options

    const scaleValue = document.createElement('span');
    scaleValue.className = `slider__scale-value slider__scale-value_${orientation}`;
    scaleValue.innerHTML = value.toString();
    fragment.append(scaleValue);

    const offset = this.convertPxToPercent(position);
    const side = orientation === 'horizontal' ? 'left' : 'bottom';
    scaleValue.style[side] = `${offset}%`;
  }
  updateBar() {

    const isHorizontal = this.options.orientation === 'horizontal';

    const side = isHorizontal ? 'left' : 'top';
    const size = isHorizontal ? 'width' : 'height';

    const thumbsPositions = this.getThumbsPositions();

    const sliderPosition = this.getSliderPosition();


    const isSingle = this.options.type === "single";

    if (isSingle) {
      if (isHorizontal) {

        const end = this.convertPxToPercent(Math.abs(thumbsPositions - sliderPosition));

        this.bar.style[side] = '0%';
        this.bar.style[size] = `${end}%`;
      } else {
        const start = this.convertPxToPercent(Math.abs(thumbsPositions - sliderPosition));
        const end = 100 - start;

        this.bar.style[side] = `${start}%`;
        this.bar.style[size] = `${end}%`;
      }
    } else {
      const start = this.convertPxToPercent(Math.abs(thumbsPositions[0] - sliderPosition));
      const length = this.convertPxToPercent(Math.abs(thumbsPositions[1] - thumbsPositions[0]));

      this.bar.style[side] = `${start}%`;
      this.bar.style[size] = `${length}%`;
    }
  }
  getSide(orientation) {

    return orientation === "horizontal" ? 'left' : 'bottom';
  }
  convertPxToValue(coordinate) {
    const { orientation, min, max, step, } = this.options;

    const pxStep = this.getPxStep(this.options);
    const sliderStart = this.getSliderPosition();
    const sliderEnd = this.getSliderPosition() + this.getSliderSize(orientation);

    const px = orientation === "horizontal"
      ? coordinate - sliderStart : sliderEnd - coordinate;

    if (px > this.getSliderSize(orientation)) return max;

    if (px < 0) return min;

    const value = Math.round(px / pxStep) * step + min;
    return value;
  }
}



let options = {
  className: 'js-toxin-slider',
  orientation: 'horizontal',
  type: 'single',
  min: 0,
  max: 10,
  step: 1,
  from: 2,
  to: 6,
  hideFromTo: false,
  hideScale: false,
};

$('.js-toxin-slider').each(function () {
  new Slider(options);
})