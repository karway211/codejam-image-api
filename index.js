const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let offsetLen = 512 / 512;
canvas.width = 512 / offsetLen;
canvas.height = 512 / offsetLen;
const pencil = document.getElementById('pencil');
const paintBucket = document.getElementById('paintBucket');
const choose = document.getElementById('choose');
let chooseFlag = false;
let pencilFlag = true;
let paintBucketFlag = false;
const currentColor = document.getElementById('Current');
const prev = document.getElementById('prev');
const blue = document.getElementById('blue');
const red = document.getElementById('red');
prev.style.backgroundColor = '#fff';
blue.style.backgroundColor = '#0000FF';
red.style.backgroundColor = '#ff0000';
currentColor.value = '#000000';
pencil.style.backgroundColor = '#d7d9d0';
const bth128 = document.getElementById('bth-128');
const bth256 = document.getElementById('bth-256');
const bth512 = document.getElementById('bth-512');
bth512.style.borderRadius = '50%';
const load = document.getElementById('load');
const bw = document.getElementById('B&W');
const city = document.getElementById('city');

const local = () => {
    const imageData = canvas.toDataURL();
    localStorage.setItem('myKey', imageData);
};
const getLocal = () => {
    if (localStorage.getItem('myKey')) {
        const dataURL = localStorage.getItem('myKey');
        const img = new Image();
        img.src = dataURL;
        img.onload = function onl() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }
};

const checkPencil = () => {
    if (pencilFlag) {
        pencilFlag = false;
        pencil.style.backgroundColor = '';
    } else {
        pencilFlag = true;
        paintBucketFlag = false;
        chooseFlag = false;
        pencil.style.backgroundColor = '#d7d9d0';
        paintBucket.style.backgroundColor = '';
        choose.style.backgroundColor = '';
    }
    local();
};

pencil.addEventListener('click', checkPencil);

const checkBucket = () => {
    if (paintBucketFlag) {
        paintBucketFlag = false;
        paintBucket.style.backgroundColor = '';
    } else {
        paintBucketFlag = true;
        pencilFlag = false;
        chooseFlag = false;
        paintBucket.style.backgroundColor = '#d7d9d0';
        pencil.style.backgroundColor = '';
        choose.style.backgroundColor = '';
    }
    local();
};

paintBucket.addEventListener('click', checkBucket);

const checkChoose = () => {
    if (chooseFlag) {
        chooseFlag = false;
        choose.style.backgroundColor = '';
    } else {
        chooseFlag = true;
        pencilFlag = false;
        paintBucketFlag = false;
        paintBucket.style.backgroundColor = '';
        choose.style.backgroundColor = '#d7d9d0';
        pencil.style.backgroundColor = '';
    }
};

choose.addEventListener('click', checkChoose);

ctx.fillStyle = currentColor.value;
ctx.lineWidth = 2;

const colors = (e) => {
    if (pencilFlag) {
        ctx.lineWidth = 1 * 2;
        ctx.strokeStyle = currentColor.value;
        ctx.fillStyle = currentColor.value;
        ctx.lineTo(e.offsetX / offsetLen, e.offsetY / offsetLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(e.offsetX / offsetLen, e.offsetY / offsetLen, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.offsetX / offsetLen, e.offsetY / offsetLen);
        local();
    }
};

const colorBucket = () => {
    if (paintBucketFlag) {
        ctx.fillStyle = currentColor.value;
        ctx.fillRect(0, 0, 512, 512);
        local();
    }
};
// clear localstorage
// localStorage.clear();
const inpChange = () => {
    prev.style.backgroundColor = ctx.fillStyle;
};
currentColor.addEventListener('change', inpChange, false);

canvas.addEventListener('click', colorBucket);

let flag = false;
canvas.addEventListener('mousedown', () => {
    flag = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (flag === true) {
        colors(e);
    }
});
canvas.addEventListener('click', (e) => {
    if (!pencilFlag) return;
    ctx.fillStyle = currentColor.value;
    ctx.fillRect(e.offsetX / offsetLen, e.offsetY / offsetLen, 1, 1);
});

canvas.addEventListener('mouseup', () => {
    flag = false;
    ctx.beginPath();
});

const rgbToHex = (n) => {
    const str = n.split('(')[1].split(')')[0].split(' ').join('');
    const arr = str.split(',');
    const rgbHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`; // eslint-disable-line no-bitwise
    return rgbHex(+arr[0], +arr[1], +arr[2]);
};

blue.onclick = () => {
    prev.style.backgroundColor = ctx.fillStyle;
    currentColor.value = rgbToHex(blue.style.backgroundColor);
};

red.onclick = () => {
    prev.style.backgroundColor = ctx.fillStyle;
    currentColor.value = rgbToHex(red.style.backgroundColor);
};

prev.onclick = () => {
    currentColor.value = rgbToHex(prev.style.backgroundColor);
};

const pipette = (e) => {
    const x = e.offsetX / offsetLen;
    const y = e.offsetY / offsetLen;
    const imgData = ctx.getImageData(x, y, 1, 1).data;
    const w = (`${'rgb'}${'('}${imgData[0]}, ${imgData[1]}, ${imgData[2]})`);
    return rgbToHex(w);
};

canvas.onclick = (e) => {
    if (chooseFlag) {
        prev.style.backgroundColor = ctx.fillStyle;
        currentColor.value = pipette(e);
    }
};

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyB') {
        checkBucket();
    }
    if (event.code === 'KeyP') {
        checkPencil();
    }
    if (event.code === 'KeyC') {
        currentColor.click();
    }
});

const getLinkToImage = async (cityVal) => {
    const baseUrl = 'https://api.unsplash.com/photos/random';
    const queryString = `?query=town,${cityVal}`;
    const clientAssKey = '&client_id=bbc5dc295d7d923fda9957332f4e4cccfedaa9939bed0e4675659c2b704fa37c';
    const url = baseUrl + queryString + clientAssKey;

    const res = await fetch(url);
    const data = await res.json();
    const link = data.urls.small;
    // saves the resulting image to the localstorage
    // const localImg = () => {
    //     localStorage.setItem('myImg', link);
    // };
    // localImg();
    return link;
};

const getImg = (link) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = link;
    img.onload = () => {
        const hRatio = canvas.offsetWidth / offsetLen / img.width;
        const vRatio = canvas.offsetHeight / offsetLen / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (canvas.offsetWidth / offsetLen - img.width * ratio) / 2;
        const centerShiftY = (canvas.offsetHeight / offsetLen - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY,
            img.width * ratio, img.height * ratio);
        local();
    };
};
// convert the resulting image from localstorage
// const getImgLocal = () => {
//     if (localStorage.getItem('myImg')) {
//         const getLink = localStorage.getItem('myImg');
//         getImg(getLink);
//     }
// };

load.addEventListener('click', async () => {
    if (city.value === '') return alert('no city'); // eslint-disable-line no-alert
    const link = await getLinkToImage(city.value);
    await getImg(link);
    return false;
});

bth128.addEventListener('click', () => {
    bth128.style.borderRadius = '50%';
    bth512.style.borderRadius = '';
    bth256.style.borderRadius = '';
    canvas.width = 128;
    canvas.height = 128;
    offsetLen = 512 / 128;
    ctx.imageSmoothingEnabled = false;
    // getImgLocal(); /* get local storage image */
    getLocal();
});

bth256.addEventListener('click', () => {
    bth128.style.borderRadius = '';
    bth512.style.borderRadius = '';
    bth256.style.borderRadius = '50%';
    canvas.width = 256;
    canvas.height = 256;
    offsetLen = 512 / 256;
    ctx.imageSmoothingEnabled = false;
    // getImgLocal(); /* get local storage image */
    getLocal();
});

bth512.addEventListener('click', () => {
    bth128.style.borderRadius = '';
    bth512.style.borderRadius = '50%';
    bth256.style.borderRadius = '';
    canvas.width = 512;
    canvas.height = 512;
    offsetLen = 512 / 512;
    ctx.imageSmoothingEnabled = false;
    // getImgLocal(); /* get local storage image */
    getLocal();
});

window.onload = () => {
    const obj = JSON.parse(localStorage.getItem('data'));
    if (obj.canvasWidth === 512) {
        bth512.click();
    } else if (obj.canvasWidth === 256) {
        bth256.click();
    } else if (obj.canvasWidth === 128) {
        bth128.click();
    }
    currentColor.value = obj.color;
    offsetLen = 512 / obj.canvasWidth;
};

window.onbeforeunload = () => {
    const objCanvasItem = {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        color: currentColor.value,
    };
    const objToLocal = JSON.stringify(objCanvasItem);
    localStorage.setItem('data', objToLocal);
};

bw.addEventListener('click', () => {
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvasData.width; x++) {
        for (let y = 0; y < canvasData.height; y++) {
            const idx = (x + y * canvas.width) * 4;
            const r = canvasData.data[idx + 0];
            const g = canvasData.data[idx + 1];
            const b = canvasData.data[idx + 2];
            const gray = (r + g + b) / 3;
            canvasData.data[idx + 0] = gray;
            canvasData.data[idx + 1] = gray;
            canvasData.data[idx + 2] = gray;
        }
    }
    ctx.putImageData(canvasData, 0, 0);
});
